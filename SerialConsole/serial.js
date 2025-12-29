let port = null;
let reader = null;
let writer = null;

let baudRate = 9600;
let parity = 'none';
let dataBits = 8;
let stopBits = 1;

const connectButton = document.getElementById('connectButton');
const sendButton = document.getElementById('sendButton');
const exportButton = document.querySelector('button:nth-of-type(3)');
const baudRateInput = document.getElementById('baudRate');
const paritySelect = document.getElementById('parity');
const dataBitsSelect = document.getElementById('dataBits');
const stopBitsSelect = document.getElementById('stopBits');
const serialOutput = document.getElementById('serialOutput');

let isConnected = false;

// Buffer y almacenamiento de líneas
let readBuffer = '';
let dataLines = [];

/* ================== CONEXIÓN ================== */

connectButton.addEventListener('click', async () => {
    if (!isConnected) {
        await connectPort();
    } else {
        await disconnectPort();
    }
});

async function connectPort() {
    try {
        baudRate = parseInt(baudRateInput.value, 10) || 9600;

        port = await navigator.serial.requestPort();
        await port.open({
            baudRate,
            dataBits,
            parity,
            stopBits
        });

        isConnected = true;
        connectButton.textContent = 'Desconectar';

        readBuffer = '';
        dataLines = [];
        serialOutput.value = '';

        startReading();
    } catch (e) {
        console.error('Error al conectar:', e);
        alert('No se pudo conectar al puerto');
        isConnected = false;
        port = null;
    }
}

async function disconnectPort() {
    try {
        if (reader) {
            await reader.cancel();
            reader.releaseLock();
            reader = null;
        }
        if (writer) {
            writer.releaseLock();
            writer = null;
        }
        if (port) {
            await port.close();
            port = null;
        }
    } catch (e) {
        console.warn(e);
    } finally {
        isConnected = false;
        connectButton.textContent = 'Conectar';
    }
}

/* ================== LECTURA POR LÍNEAS ================== */

async function startReading() {
    const decoder = new TextDecoder();
    reader = port.readable.getReader();

    while (true) {
        try {
            const { value, done } = await reader.read();
            if (done) break;

            if (value) {
                readBuffer += decoder.decode(value, { stream: true });

                // Normaliza finales de línea
                readBuffer = readBuffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                let lines = readBuffer.split('\n');
                readBuffer = lines.pop(); // deja línea incompleta en buffer

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue; // 👈 elimina líneas vacías

                    dataLines.push(trimmed);
                    serialOutput.value += trimmed + '\n';
                }

                serialOutput.scrollTop = serialOutput.scrollHeight;
            }
        } catch (e) {
            console.error('Error de lectura:', e);
            break;
        }
    }
}

/* ================== ESCRITURA ================== */

sendButton.addEventListener('click', async () => {
    if (!port?.writable) return;

    try {
        writer = port.writable.getWriter();
        const encoder = new TextEncoder();
        await writer.write(encoder.encode('\r')); // o '\r\n'
    } catch (e) {
        console.error(e);
    } finally {
        if (writer) {
            writer.releaseLock();
            writer = null;
        }
    }
});

/* ================== EXPORT CSV ================== */

exportButton.addEventListener('click', exportToCSV);

function exportToCSV() {
    if (dataLines.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    let csv = 'data:text/csv;charset=utf-8,';

    // Cabecera opcional
    csv += 'Valor\n';

    // Procesamos cada línea de datos
    dataLines.forEach(line => {
        // Reemplazar tabulaciones (\t) por comas (,) para CSV
        let processedLine = line.replace(/\t/g, ',');

        // Escapar comillas dobles (para que no rompa el CSV)
        processedLine = processedLine.replace(/"/g, '""');

        // Envolver en comillas dobles para asegurar que el CSV sea correcto
        csv += `"${processedLine}"\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'COM_exports.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ================== PARÁMETROS ================== */

baudRateInput.addEventListener('change', e => baudRate = +e.target.value);
paritySelect.addEventListener('change', e => parity = e.target.value);
dataBitsSelect.addEventListener('change', e => dataBits = +e.target.value);
stopBitsSelect.addEventListener('change', e => stopBits = +e.target.value);
