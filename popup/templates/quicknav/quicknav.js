const getHtml = () => {
  return `
    <div class="notification bg-warning w-100 p-2 text-left">
      Silahkan refresh halaman ini untuk melihat perubahan.
    </div>
    <div class="d-flex flex-column h-100">
      <p class="fs-5 fw-bold my-3 text-center" id="status-text">
        ${ showQuicknav ? 'Quicknav diaktifkan' : 'Quicknav dimatikan' }
      </p>
      <div class="toggle-qn-container show d-flex justify-content-center">
        ${
          showQuicknav ?
            '<button type="button" id="btn-hide" class="btn btn-sm btn-secondary fw-bold">Matikan</button>'
            : '<button type="button" id="btn-show" class="btn btn-sm btn-primary fw-bold me-3">Aktifkan</button>'
        }
      </div>
    </div>
  `;
}

export default getHtml;