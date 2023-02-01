const getHtml = (code, status, fileName) => {
  return `
    <span id="task-item-code" class="d-block fs-6 fw-semibold mb-3">${code}</span>
    <span class="d-block text-black-50" style="font-size: 12px;">Status</span>
    <span id="task-item-status" class="d-block mb-3">${status}</span>
  
    <span class="d-block text-black-50" style="font-size: 12px;">Deskripsi</span>
    <span id="task-item-filename" class="d-block mb-1">Pergi ke file dengan nama berikut :</span>
    <div class="alert alert-primary mb-3 py-2 px-3">
      <span>${fileName}</span>
    </div>
  `;
}

export default getHtml;