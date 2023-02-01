const content = `
  <i class="bi bi-info-circle-fill"></i>
  <span class="ms-3" style="font-size: 12px;">
    Anda wajib menekan tombol <strong>Siapkan Tugas</strong> sebelum memulai tugas.
  </span>
`;

const divSetupInfo = document.createElement('div');
divSetupInfo.className = 'alert alert-info d-flex align-items-center mb-3 py-2 px-3';
divSetupInfo.innerHTML = content;

export default divSetupInfo;
