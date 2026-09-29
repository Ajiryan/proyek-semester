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

  // 1. Pemicu Modal: Klik Menu Header "Login / Registrasi"
  if (btnOpenLogin) {
    btnOpenLogin.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModal();
    });
  }

  // 2. Pemicu Modal: Klik Menu Header "Ingin Berdonasi" (Jika belum login)
  if (btnOpenDonasi) {
    btnOpenDonasi.addEventListener('click', (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        openLoginModal();
      }
    });
  }

  // 3. Kontrol Tutup Modal (Klik X, area overlay luar, atau tombol ESC)
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

  // 4. Simulasi Submit Form Login Modal
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
  // FITUR 3: AUTOSAVE DRAFT FORM DONASI + WEB STORAGE
  // ==========================================
  const formDonasi = document.querySelector('#donasi-form');
  const inputNama = document.querySelector('#nama-donatur');
  const selectKategori = document.querySelector('#kategori-barang');
  const selectPosko = document.querySelector('#posko-tujuan');
  const textareaDetail = document.querySelector('#detail-barang');
  const statusDraftEl = document.querySelector('#draft-status');

  const STORAGE_KEY_DRAFT = 'donasi_form_draft';

  function restoreFormDraft() {
    const rawDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft);
        if (draft.nama) inputNama.value = draft.nama;
        if (draft.kategori) selectKategori.value = draft.kategori;
        if (draft.posko) selectPosko.value = draft.posko;
        if (draft.detail) textareaDetail.value = draft.detail;
        statusDraftEl.textContent = '✨ Draft formulir sebelumnya berhasil dipulihkan!';
      } catch (err) {
        console.error('Gagal membaca draft:', err);
      }
    }
  }

  function saveFormDraft() {
    const draftData = {
      nama: inputNama.value,
      kategori: selectKategori.value,
      posko: selectPosko.value,
      detail: textareaDetail.value
    };
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftData));
    statusDraftEl.textContent = 'Draft tersimpan otomatis di browser...';
  }

  formDonasi.addEventListener('input', saveFormDraft);

  // Pemicu Modal: Saat Form Donasi di-submit namun user belum login
  formDonasi.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      openLoginModal();
    } else {
      alert(`Terima kasih ${inputNama.value}! Pengajuan donasi Anda berhasil dikirim.`);
      localStorage.removeItem(STORAGE_KEY_DRAFT);
      formDonasi.reset();
      statusDraftEl.textContent = 'Form berhasil dikirim. Draft dibersihkan!';
    }
  });

  // Inisialisasi
  updateActiveTabUI();
  applyFilterAndSearch();
  restoreFormDraft();
});