
    let availableFields = {};
    let selectedFields = {};

    document.getElementById('toggleFilters').addEventListener('click', () => {
      const panel = document.getElementById('filterPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    function renderObject(section, obj, grid) {
      for (const key in obj) {
        if (selectedFields[section] && selectedFields[section].includes(key)) {
          const sectionDiv = document.createElement('div');
          sectionDiv.textContent = section;

          const keyDiv = document.createElement('div');
          keyDiv.textContent = key;

          const valueDiv = document.createElement('div');
          const value = obj[key];
          valueDiv.textContent = typeof value === 'object' ? JSON.stringify(value) : value;

          grid.appendChild(sectionDiv);
          grid.appendChild(keyDiv);
          grid.appendChild(valueDiv);
        }
      }
    }

 function buildFilterPanel() {
  const panel = document.getElementById('filterPanel');
  panel.innerHTML = '';

  for (const section in availableFields) {
    const sectionTitle = document.createElement('h4');
    sectionTitle.textContent = section;
    panel.appendChild(sectionTitle);

    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.textContent = 'Seleccionar/Deseleccionar todo';
    toggleAllBtn.style.marginBottom = '10px';
    toggleAllBtn.addEventListener('click', () => {
      const checkboxes = panel.querySelectorAll(`input[data-section="${section}"]`);
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => cb.checked = !allChecked);

      selectedFields[section] = !allChecked
        ? [...availableFields[section]]
        : [];

      renderFiles();
    });
    panel.appendChild(toggleAllBtn);

    availableFields[section].forEach(field => {
      const label = document.createElement('label');
      label.style.display = 'block';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.dataset.section = section;
      checkbox.dataset.field = field;

      checkbox.addEventListener('change', () => {
        if (!selectedFields[section]) selectedFields[section] = [];
        if (checkbox.checked) {
          selectedFields[section].push(field);
        } else {
          selectedFields[section] = selectedFields[section].filter(f => f !== field);
        }
        renderFiles();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + field));
      panel.appendChild(label);
    });
  }
}


    let parsedFiles = [];

    function renderFiles() {
      const output = document.getElementById('output');
      output.innerHTML = '';

      parsedFiles.forEach(({ name, json }) => {
        const container = document.createElement('div');
        container.className = 'file-container';

        const title = document.createElement('div');
        title.className = 'file-title';
        title.textContent = `Archivo: ${name}`;
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'grid';

        for (const section in json) {
          const value = json[section];
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              renderObject(`${section}[${index}]`, item, grid);
            });
          } else if (typeof value === 'object' && value !== null) {
            renderObject(section, value, grid);
          } else {
            if (selectedFields[section] && selectedFields[section].includes('(valor)')) {
              const sectionDiv = document.createElement('div');
              sectionDiv.textContent = section;

              const keyDiv = document.createElement('div');
              keyDiv.textContent = '(valor)';

              const valueDiv = document.createElement('div');
              valueDiv.textContent = value;

              grid.appendChild(sectionDiv);
              grid.appendChild(keyDiv);
              grid.appendChild(valueDiv);
            }
          }
        }

        container.appendChild(grid);
        output.appendChild(container);
      });
    }

	
function exportToExcel() {
  const containers = document.querySelectorAll('#output .file-container');
  const allRows = [];

  containers.forEach(container => {
    const fileName = container.querySelector('.file-title')?.textContent.replace('Archivo: ', '') || 'Archivo';

    const gridItems = container.querySelectorAll('.grid div');
    for (let i = 0; i < gridItems.length; i += 3) {
      const section = gridItems[i]?.textContent || '';
      const variable = gridItems[i + 1]?.textContent || '';
      const value = gridItems[i + 2]?.textContent || '';

      // Buscar si ya existe una fila para esta sección
      let row = allRows.find(r => r.__file === fileName && r.__section === section);
      if (!row) {
        row = { __file: fileName, __section: section };
        allRows.push(row);
      }

      row[variable] = value;
    }
  });

  // Eliminar columnas auxiliares si no las quieres en el Excel
  const rowsForExcel = allRows.map(({ __file, __section, ...rest }) => ({
    Archivo: __file,
    Sección: __section,
    ...rest
  }));

  const worksheet = XLSX.utils.json_to_sheet(rowsForExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos por columnas");

  XLSX.writeFile(workbook, "datos_por_columnas.xlsx");
}



    document.getElementById('fileInput').addEventListener('change', function(event) {
      const files = event.target.files;
      parsedFiles = [];
      availableFields = {};
      selectedFields = {};

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const json = JSON.parse(e.target.result);
            parsedFiles.push({ name: file.name, json });

            for (const section in json) {
              const value = json[section];
              if (!availableFields[section]) availableFields[section] = [];

              if (Array.isArray(value)) {
                value.forEach(item => {
                  for (const key in item) {
                    if (!availableFields[section].includes(key)) {
                      availableFields[section].push(key);
                    }
                  }
                });
              } else if (typeof value === 'object' && value !== null) {
                for (const key in value) {
                  if (!availableFields[section].includes(key)) {
                    availableFields[section].push(key);
                  }
                }
              } else {
                if (!availableFields[section].includes('(valor)')) {
                  availableFields[section].push('(valor)');
                }
              }
            }

            // Inicializar selección
            for (const section in availableFields) {
              selectedFields[section] = [...availableFields[section]];
            }

            buildFilterPanel();
            renderFiles();
          } catch (err) {
            alert(`Error al leer ${file.name}: ${err.message}`);
          }
        };
        reader.readAsText(file);
      });
    });
