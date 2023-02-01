const content = `
  <i class="bi bi-exclamation-triangle-fill"></i>
  <span class="ms-3" style="font-size: 12px;">
    Petunjuk tidak dapat ditampilkan saat tugas dimulai, pastikan anda mengingatnya.
  </span>
`;

const divHintInfo = document.createElement('div');
divHintInfo.className = 'alert alert-warning d-flex align-items-center mb-3 py-2 px-3';
divHintInfo.innerHTML = content;

export default divHintInfo;
