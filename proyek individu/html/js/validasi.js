/**
 * Memvalidasi data formulir Donasi berdasarkan aturan kriteria
 * @param {Object} data - Objek yang berisi data input dari form
 * @returns {Object} Objek yang berisi pesan kesalahan per field
 */
export function validateForm(data) {
  const errors = {};

  // Daftar Kategori Valid yang Diizinkan
  const kategoriValid = ['pakaian', 'logistik', 'obat'];

  // 1. Validasi Nama Donatur (Pembedaan Pesan Kosong)
  if (!data.nama || data.nama.trim() === '') {
    errors.nama = 'Nama lengkap wajib diisi.';
  }

  // 2. Validasi Email (Pembedaan Kosong vs Format Invalid)
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Alamat email wajib diisi.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Format alamat email tidak valid (contoh: nama@email.com).';
    }
  }

  // 3. Validasi Kategori Barang (Memastikan Pilihan Terdaftar)
  if (!data.kategori || data.kategori.trim() === '') {
    errors.kategori = 'Silakan pilih kategori barang.';
  } else if (!kategoriValid.includes(data.kategori.trim().toLowerCase())) {
    errors.kategori = 'Pilihan kategori tidak valid atau tidak terdaftar.';
  }

  // 4. Validasi Jumlah Unit (Pembedaan Kosong vs Batas Angka)
  if (data.jumlah === undefined || data.jumlah === null || data.jumlah === '') {
    errors.jumlah = 'Jumlah unit/porsi wajib diisi.';
  } else {
    const jumlahNum = Number(data.jumlah);
    if (isNaN(jumlahNum) || jumlahNum < 10 || jumlahNum > 500) {
      errors.jumlah = 'Jumlah harus berupa angka antara 10 sampai 500 unit.';
    }
  }

  // 5. Validasi Tanggal (Tidak Boleh Melebihi Hari Ini)
  if (!data.tanggal || data.tanggal.trim() === '') {
    errors.tanggal = 'Tanggal perolehan / pengiriman wajib diisi.';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.tanggal)) {
      errors.tanggal = 'Format tanggal tidak valid.';
    } else {
      const selectedDate = new Date(data.tanggal);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        errors.tanggal = 'Tanggal pengiriman tidak boleh melebihi tanggal hari ini.';
      }
    }
  }

  // 6. Validasi Posko Tujuan
  if (!data.posko || data.posko.trim() === '') {
    errors.posko = 'Silakan pilih posko tujuan.';
  }

  // 7. Validasi Detail Barang
  if (!data.detail || data.detail.trim() === '') {
    errors.detail = 'Detail barang wajib diisi.';
  } else if (data.detail.trim().length < 10) {
    errors.detail = 'Rincian detail barang minimal 10 karakter.';
  }

  // 8. Validasi Syarat & Ketentuan
  if (!data.setuju) {
    errors.setuju = 'Anda harus menyetujui konfirmasi kelayakan barang.';
  }

  return errors;
}

/**
 * Membaca seluruh data input dari elemen form
 */
export function readFormData(formElement) {
  const formData = new FormData(formElement);
  return {
    nama: formData.get('nama'),
    email: formData.get('email'),
    kategori: formData.get('kategori'),
    jumlah: formData.get('jumlah'),
    tanggal: formData.get('tanggal'),
    posko: formData.get('posko'),
    detail: formData.get('detail'),
    setuju: formElement.querySelector('#setuju')?.checked ?? false,
  };
}

/**
 * Menampilkan pesan kesalahan di bawah input & di ringkasan atas secara aksesibel
 */
export function renderErrors(formElement, errors) {
  clearAllErrors(formElement);

  const errorSummary = document.querySelector('#errorSummary');
  const errorSummaryList = document.querySelector('#errorSummaryList');

  if (errorSummaryList) {
    errorSummaryList.innerHTML = '';
  }

  const fieldKeys = Object.keys(errors);

  fieldKeys.forEach((fieldName) => {
    // Tampilkan di bawah field input terkait
    const errorEl = document.querySelector(`#${fieldName}Error`);
    if (errorEl) {
      errorEl.textContent = errors[fieldName];
    }

    // Tandai atribut aria-invalid untuk aksesibilitas screen reader
    const inputField = formElement.elements[fieldName];
    if (inputField) {
      inputField.setAttribute('aria-invalid', 'true');
      inputField.classList.add('input-error');
    }

    // Tambahkan item ke bagian error summary
    if (errorSummaryList) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${fieldName}` + (fieldName === 'setuju' ? '' : (inputField?.id || ''));
      a.textContent = errors[fieldName];
      a.addEventListener('click', (e) => {
        e.preventDefault();
        inputField?.focus();
      });
      li.appendChild(a);
      errorSummaryList.appendChild(li);
    }
  });

  if (errorSummary && fieldKeys.length > 0) {
    errorSummary.style.display = 'block';
    errorSummary.focus();
  }

  // Fokus otomatis berpindah ke field error pertama
  if (fieldKeys.length > 0) {
    const firstField = formElement.elements[fieldKeys[0]];
    if (firstField) {
      firstField.focus();
    }
  }
}

/**
 * Membersihkan semua indikator pesan kesalahan
 */
export function clearAllErrors(formElement) {
  const errorTexts = document.querySelectorAll('.error-text');
  errorTexts.forEach((el) => {
    el.textContent = '';
  });

  if (formElement) {
    const invalidInputs = formElement.querySelectorAll('[aria-invalid="true"]');
    invalidInputs.forEach((el) => {
      el.removeAttribute('aria-invalid');
      el.classList.remove('input-error');
    });
  }

  const errorSummary = document.querySelector('#errorSummary');
  if (errorSummary) {
    errorSummary.style.display = 'none';
  }
}

/**
 * Fitur LocalStorage Draft Form
 */
export function saveDraft(data) {
  localStorage.setItem('donasi_form_draft', JSON.stringify(data));
}

export function loadDraft(formElement) {
  const savedData = localStorage.getItem('donasi_form_draft');
  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);
    Object.keys(data).forEach((key) => {
      const field = formElement.elements[key];
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = Boolean(data[key]);
        } else {
          field.value = data[key];
        }
      }
    });
  } catch (e) {
    console.error('Gagal memuat draft formulir:', e);
  }
}

export function clearDraft() {
  localStorage.removeItem('donasi_form_draft');
}