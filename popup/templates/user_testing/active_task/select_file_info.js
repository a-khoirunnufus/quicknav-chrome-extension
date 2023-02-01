const content = `
  <i class="bi bi-info-circle-fill"></i>
  <span class="ms-3" style="font-size: 12px;">
    Pastikan mengklik (satu kali) file yang dituju hingga berubah menjadi biru sebelum menyelesaikan tugas.
  </span>
`;

const divSelectFileInfo = document.createElement('div');
divSelectFileInfo.className = 'alert alert-info d-flex align-items-center mb-3 py-2 px-3';
divSelectFileInfo.innerHTML = content;

export default divSelectFileInfo;
