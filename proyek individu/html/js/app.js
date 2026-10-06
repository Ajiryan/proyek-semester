import { 
  dataDonasi, 
  filterDonasiByKategori, 
  hitungTotalUnit, 
  cariDonasiById 
} from './donasiService.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("=== SISTEM PLATFORM DONASI BENCANA: SCRIPT DOM LOADED ===");

  // State Aplikasi
  let isLoggedIn = false; // Status sesi login
  let activeStatus = localStorage.getItem('donasi_active_status') ?? 'semua';
  let currentKategori = 'semua';
  let searchQuery = '';

  // Element Selectors
  const statusTabs = document.querySelectorAll('.tab-status');
  const containerDonasi = document.querySelector('#daftar-donasi-container');
  const totalInfoEl = document.querySelector('#total-info');
  const searchInput = document.querySelector('#search-input');
  const filterButtons = document.querySelectorAll('.btn-filter');

  // Element Modal Selectors
  const loginModal = document.querySelector('#login-modal');
  const btnCloseModal = document.querySelector('#btn-close-modal');
  const btnOpenLogin = document.querySelector('#btn-open-login');
  const btnOpenDonasi = document.querySelector('#btn-open-donasi');
  const loginFormModal = document.querySelector('#login-form-modal');

  // ==========================================
  // LOGIKA MODAL LOGIN MENGAMBANG
  // ==========================================
  function openLoginModal() {
    loginModal.classList.add('active');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLoginModal() {
    loginModal.classList.remove('active');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnOpenLogin) {
    btnOpenLogin.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModal();
    });
  }

  if (btnOpenDonasi) {
    btnOpenDonasi.addEventListener('click', (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        openLoginModal();
      }
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeLoginModal);
  }

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
      closeLoginModal();
    }
  });

  if (loginFormModal) {
    loginFormModal.addEventListener('submit', (e) => {
      e.preventDefault();
      isLoggedIn = true;
      alert("Login berhasil! Silakan lanjutkan pengajuan donasi Anda.");
      closeLoginModal();
    });
  }

  // ==========================================
  // FITUR 1: STATUS FILTER TABS + WEB STORAGE
  // ==========================================
  function updateActiveTabUI() {
    statusTabs.forEach(tab => {
      if (tab.dataset.status === activeStatus) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeStatus = tab.dataset.status;
      localStorage.setItem('donasi_active_status', activeStatus);
      updateActiveTabUI();
      applyFilterAndSearch();
    });
  });

  // ==========================================
  // FITUR 2: SAFE DOM RENDERING & EVENT DELEGATION
  // ==========================================
  function renderDonasi(listData) {
    containerDonasi.replaceChildren();

    if (listData.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'Tidak ada data donasi yang cocok dengan pencarian/filter.';
      emptyMsg.className = 'empty-msg';
      containerDonasi.append(emptyMsg);
      totalInfoEl.textContent = 'Total Barang Terkumpul: 0 unit';
      return;
    }

    listData.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card card-donasi';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'card-header';

      const title = document.createElement('h3');
      title.textContent = `${item.namaDonatur}`;

      const kategoriBadge = document.createElement('span');
      kategoriBadge.className = 'badge badge-kategori';
      kategoriBadge.textContent = item.kategori.toUpperCase();

      headerDiv.append(title, kategoriBadge);

      const detail = document.createElement('p');
      detail.textContent = `Detail: ${item.detail}`;

      const poskoInfo = document.createElement('p');
      poskoInfo.className = 'posko-info';
      poskoInfo.textContent = `📍 Posko: ${item.posko} | 📦 Jumlah: ${item.jumlahUnit} unit`;

      const footerDiv = document.createElement('div');
      footerDiv.className = 'card-footer';

      const statusBadge = document.createElement('span');
      statusBadge.className = `badge badge-status ${item.status.toLowerCase()}`;
      statusBadge.textContent = `Status: ${item.status}`;

      const detailBtn = document.createElement('button');
      detailBtn.type = 'button';
      detailBtn.className = 'btn-secondary btn-sm';
      detailBtn.dataset.id = item.id;
      detailBtn.textContent = 'Lihat Info Detail';

      footerDiv.append(statusBadge, detailBtn);
      card.append(headerDiv, detail, poskoInfo, footerDiv);
      containerDonasi.append(card);
    });

    const total = hitungTotalUnit(listData);
    totalInfoEl.textContent = `Total Barang Terkumpul (Filtered): ${total} unit`;
  }

  function applyFilterAndSearch() {
    let filtered = dataDonasi;

    if (activeStatus !== 'semua') {
      filtered = filtered.filter(item => item.status === activeStatus);
    }

    if (currentKategori !== 'semua') {
      filtered = filterDonasiByKategori(filtered, currentKategori);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.namaDonatur.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q)
      );
    }

    renderDonasi(filtered);
  }

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    applyFilterAndSearch();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentKategori = btn.dataset.kategori;
      applyFilterAndSearch();
    });
  });

  containerDonasi.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      const id = parseInt(e.target.dataset.id, 10);
      const donasi = cariDonasiById(dataDonasi, id);
      if (donasi) {
        alert(`[DETAIL DONASI]\nDonatur: ${donasi.namaDonatur}\nKategori: ${donasi.kategori}\nBarang: ${donasi.detail}\nPosko: ${donasi.posko}\nStatus: ${donasi.status}`);
      }
    }
  });

  // ==========================================
  // FITUR 3: AUTOSAVE DRAFT & VALIDASI FORM AKSESIBEL
  // ==========================================
  const formDonasi = document.querySelector('#donasi-form');
  const inputNama = document.querySelector('#nama-donatur');
  const inputEmail = document.querySelector('#email-donatur');
  const selectKategori = document.querySelector('#kategori-barang');
  const inputJumlah = document.querySelector('#jumlah-unit');
  const selectPosko = document.querySelector('#posko-tujuan');
  const inputTanggal = document.querySelector('#tanggal-pengiriman');
  const textareaDetail = document.querySelector('#detail-barang');
  const checkKelayakan = document.querySelector('#check-kelayakan');
  const statusDraftEl = document.querySelector('#draft-status');

  const errorSummary = document.querySelector('#errorSummary');
  const errorList = document.querySelector('#errorList');

  const STORAGE_KEY_DRAFT = 'donasi_form_draft';

  function restoreFormDraft() {
    const rawDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft);
        if (draft.nama) inputNama.value = draft.nama;
        if (draft.email && inputEmail) inputEmail.value = draft.email;
        if (draft.kategori) selectKategori.value = draft.kategori;
        if (draft.jumlah && inputJumlah) inputJumlah.value = draft.jumlah;
        if (draft.posko) selectPosko.value = draft.posko;
        if (draft.tanggal && inputTanggal) inputTanggal.value = draft.tanggal;
        if (draft.detail) textareaDetail.value = draft.detail;
        if (draft.kelayakan && checkKelayakan) checkKelayakan.checked = draft.kelayakan;
        statusDraftEl.textContent = '✨ Draft formulir sebelumnya berhasil dipulihkan!';
      } catch (err) {
        console.error('Gagal membaca draft:', err);
      }
    }
  }

  function saveFormDraft() {
    const draftData = {
      nama: inputNama.value,
      email: inputEmail ? inputEmail.value : '',
      kategori: selectKategori.value,
      jumlah: inputJumlah ? inputJumlah.value : '',
      posko: selectPosko.value,
      tanggal: inputTanggal ? inputTanggal.value : '',
      detail: textareaDetail.value,
      kelayakan: checkKelayakan ? checkKelayakan.checked : false
    };
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftData));
    statusDraftEl.textContent = 'Draft tersimpan otomatis di browser...';
  }

  formDonasi.addEventListener('input', saveFormDraft);

  // Fungsi Pembantu Validasi Form & Aksesibilitas
  function resetFormErrors() {
    errorSummary.style.display = 'none';
    errorList.innerHTML = '';
    const errorSpans = formDonasi.querySelectorAll('.field-error');
    errorSpans.forEach(span => span.textContent = '');
    const inputs = formDonasi.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.removeAttribute('aria-invalid'));
  }

  function markFieldError(inputEl, errorElId, message) {
    inputEl.setAttribute('aria-invalid', 'true');
    const errSpan = document.querySelector(`#${errorElId}`);
    if (errSpan) errSpan.textContent = message;
  }

  // Handle Form Submission dengan Validasi Bisnis
  formDonasi.addEventListener('submit', (e) => {
    e.preventDefault();
    resetFormErrors();

    const errors = [];

    // Validasi 1: Nama
    if (!inputNama.value.trim()) {
      const msg = 'Nama lengkap wajib diisi.';
      markFieldError(inputNama, 'error-nama', msg);
      errors.push({ el: inputNama, msg });
    }

    // Validasi 2: Email
    if (inputEmail) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(inputEmail.value.trim())) {
        const msg = 'Alamat email tidak valid.';
        markFieldError(inputEmail, 'error-email', msg);
        errors.push({ el: inputEmail, msg });
      }
    }

    // Validasi 3: Kategori
    if (!selectKategori.value) {
      const msg = 'Pilih salah satu kategori barang.';
      markFieldError(selectKategori, 'error-kategori', msg);
      errors.push({ el: selectKategori, msg });
    }

    // Validasi 4: Jumlah Unit (10 - 500)
    if (inputJumlah) {
      const jml = Number(inputJumlah.value);
      if (!inputJumlah.value || isNaN(jml) || jml < 10 || jml > 500) {
        const msg = 'Jumlah barang harus berupa angka (10 - 500 unit).';
        markFieldError(inputJumlah, 'error-jumlah', msg);
        errors.push({ el: inputJumlah, msg });
      }
    }

    // Validasi 5: Posko Tujuan
    if (!selectPosko.value) {
      const msg = 'Pilih posko tujuan pengiriman.';
      markFieldError(selectPosko, 'error-posko', msg);
      errors.push({ el: selectPosko, msg });
    }

    // Validasi 6: Tanggal Pengiriman (Tidak Boleh Masa Lalu)
    if (inputTanggal) {
      const selectedDate = new Date(inputTanggal.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!inputTanggal.value || selectedDate < today) {
        const msg = 'Tanggal pengiriman tidak boleh berada di masa lalu.';
        markFieldError(inputTanggal, 'error-tanggal', msg);
        errors.push({ el: inputTanggal, msg });
      }
    }

    // Validasi 7: Detail Barang (Min 10 Karakter)
    if (textareaDetail.value.trim().length < 10) {
      const msg = 'Detail barang minimal 10 karakter.';
      markFieldError(textareaDetail, 'error-detail', msg);
      errors.push({ el: textareaDetail, msg });
    }

    // Validasi 8: Checkbox Kelayakan
    if (checkKelayakan && !checkKelayakan.checked) {
      const msg = 'Anda harus menyetujui pernyataan kelayakan barang.';
      markFieldError(checkKelayakan, 'error-kelayakan', msg);
      errors.push({ el: checkKelayakan, msg });
    }

    // Tampilkan Error Summary atau Submit
    if (errors.length > 0) {
      errors.forEach(err => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${err.el.id}`;
        a.textContent = err.msg;
        a.addEventListener('click', (ev) => {
          ev.preventDefault();
          err.el.focus();
        });
        li.appendChild(a);
        errorList.appendChild(li);
      });

      errorSummary.style.display = 'block';
      errorSummary.focus();
      errors[0].el.focus(); // Auto-focus ke bidang error pertama
    } else {
      if (!isLoggedIn) {
        openLoginModal();
      } else {
        alert(`Terima kasih ${inputNama.value}! Pengajuan donasi Anda berhasil dikirim.`);
        localStorage.removeItem(STORAGE_KEY_DRAFT);
        formDonasi.reset();
        statusDraftEl.textContent = 'Form berhasil dikirim. Draft dibersihkan!';
      }
    }
  });

  // Inisialisasi awal
  updateActiveTabUI();
  applyFilterAndSearch();
  restoreFormDraft();
});