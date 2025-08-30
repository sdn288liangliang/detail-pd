      const API_KEY = "AIzaSyCT1WcLEW1D278JatxfAiMpoPNoiHDtwGQ"; // Masukkan API Key Google kamu
      const SHEET_ID = "1-1Q9KA32NzCHun-QY7nucQCcoM2bYXW33zbM-jG1DnI"; // Masukkan ID Google Sheets kamu

      // *** Tentukan urutan sheet secara manual di sini ***
      const SHEET_ORDER = [
         "Kelas 1",
         "Kelas 2",
         "Kelas 3",
         "Kelas 4",
         "Kelas 5",
         "Kelas 6"
      ];

      // Ambil semua nama sheet
      async function getSheetNames() {
         const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`;
         const response = await fetch(url);
         const data = await response.json();

         // Ambil semua nama sheet dari Google Sheets
         const availableSheets = data.sheets.map(sheet => sheet.properties.title);

         // Filter hanya sheet yang ada di SHEET_ORDER
         return SHEET_ORDER.filter(sheet => availableSheets.includes(sheet));
      }

      // Ambil data tiap sheet dan buat tabel
      async function fetchSheet(sheetName, index) {
         const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`;
         const response = await fetch(url);
         const data = await response.json();
         const values = data.values;

         if (!values || values.length === 0) return;

         const container = document.getElementById("sheetContainer");
         const col = document.createElement("div");
         col.classList.add("col-11", "col-lg-6", "mx-auto");
         col.id = `sheet-${index}`;

         let html = `
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white fw-bold text-center">
            ${sheetName}
          </div>
          <div class="card-body table-responsive">
            <table id="table${index}" class="table table-striped table-bordered display nowrap" style="width:100%">
              <thead>
                <tr>
      `;

         // Header tabel
         values[0].forEach(header => {
            html += `<th>${header}</th>`;
         });
         html += `</tr></thead><tbody>`;

         // Isi tabel
         values.slice(1).forEach(row => {
            html += `<tr>`;
            values[0].forEach((_, colIndex) => {
               html += `<td>${row[colIndex] || ""}</td>`;
            });
            html += `</tr>`;
         });
         html += `</tbody></table></div></div>`;
         col.innerHTML = html;
         container.appendChild(col);

         // Tambahkan checkbox untuk hide/show sheet
         const checkboxList = document.getElementById("checkboxList");
         const div = document.createElement("div");
         div.classList.add("col-auto", "mb-2");
         div.innerHTML = `
        <div class="form-check">
          <input class="form-check-input sheet-toggle" type="checkbox" id="check-${index}" data-target="sheet-${index}" checked>
          <label class="form-check-label" for="check-${index}">${sheetName}</label>
        </div>
      `;
         checkboxList.appendChild(div);

         // Event listener hide/show
         div.querySelector(".sheet-toggle").addEventListener("change", function () {
            const target = document.getElementById(this.dataset.target);
            target.style.display = this.checked ? "block" : "none";
         });
      }

      async function init() {
         const sheetNames = await getSheetNames();
         sheetNames.forEach((name, i) => fetchSheet(name, i));
      }

      init();