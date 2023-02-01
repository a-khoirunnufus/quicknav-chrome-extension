const getHtml = (code, itemStatus, appStatus, fileName) => {
  let html = `
    <h6 id="task-item-code" class="d-block fs-6 fw-semibold mb-3">
      ${code}&nbsp;&nbsp;`;

  if(itemStatus == 'NOT_COMPLETE') {
    html += '<span class="badge bg-secondary">belum selesai</span>'; 
  } else if(itemStatus == 'PENDING') {
    html += '<span class="badge bg-warning">pending</span>';
  } else if(itemStatus == 'COMPLETED') {
    html += '<span class="badge bg-success">selesai</span>';
  }

  html += `
    </h6>

    <span class="d-block text-black-50" style="font-size: 12px;">Status</span>
    <span id="task-item-status" class="d-block mb-3">${appStatus}</span>
  
    <span class="d-block text-black-50" style="font-size: 12px;">Perintah</span>
    <span id="task-item-filename" class="d-block mb-1">Pergi ke file dengan nama berikut :</span>
    <div class="alert alert-primary mb-3 py-2 px-3">
      <span>${fileName}</span>
    </div>
  `;

  return html;
}

export default getHtml;