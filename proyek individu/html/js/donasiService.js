// 1. Array of Objects Data Donasi Sesuai Kategori & Posko pada HTML
export const dataDonasi = [
  { id: 1, namaDonatur: "Andi Wijaya", kategori: "pakaian", posko: "posko-1", detail: "Selimut & Pakaian Dewasa", jumlahUnit: 25, status: "Terverifikasi" },
  { id: 2, namaDonatur: "Budi Santoso", kategori: "logistik", posko: "posko-2", detail: "Sembako & Beras 10kg", jumlahUnit: 50, status: "Pending" },
  { id: 3, namaDonatur: "Citra Lestari", kategori: "obat", posko: "posko-1", detail: "Vitamin & Pertolongan Pertama", jumlahUnit: 15, status: "Terverifikasi" },
  { id: 4, namaDonatur: "Dewi Putri", kategori: "logistik", posko: "posko-1", detail: "Air Mineral Dus", jumlahUnit: 30, status: "Terverifikasi" }
];

// 2. Arrow Function dengan Method Array (.filter) & Error Handling
export const filterDonasiByKategori = (donasiArray, kategori) => {
  try {
    if (!Array.isArray(donasiArray)) {
      throw new Error("Data donasi harus berupa Array!");
    }
    if (!kategori) {
      throw new Error("Kategori tidak boleh kosong!");
    }
    return donasiArray.filter(item => item.kategori === kategori);
  } catch (error) {
    console.error("Error pada filterDonasiByKategori:", error.message);
    return [];
  }
};

// 3. Arrow Function dengan Method Array (.map) untuk Format Ringkasan
export const ringkasDataDonasi = (donasiArray) => {
  try {
    if (!Array.isArray(donasiArray)) throw new Error("Data tidak valid!");
    return donasiArray.map(({ namaDonatur, kategori, posko, jumlahUnit }) => 
      `Donatur: ${namaDonatur} | Kategori: ${kategori} | Posko: ${posko} | Total: ${jumlahUnit} unit`
    );
  } catch (error) {
    console.error("Error pada ringkasDataDonasi:", error.message);
    return [];
  }
};

// 4. Arrow Function dengan Method Array (.reduce) untuk Menghitung Total Unit Barang
export const hitungTotalUnit = (donasiArray) => {
  try {
    if (!Array.isArray(donasiArray)) throw new Error("Data tidak valid!");
    return donasiArray.reduce((acc, item) => acc + item.jumlahUnit, 0);
  } catch (error) {
    console.error("Error pada hitungTotalUnit:", error.message);
    return 0;
  }
};

// 5. Arrow Function dengan Method Array (.find) dengan Error Handling
export const cariDonasiById = (donasiArray, id) => {
  try {
    const hasil = donasiArray.find(item => item.id === id);
    if (!hasil) {
      throw new Error(`Donasi dengan ID ${id} tidak ditemukan.`);
    }
    return hasil;
  } catch (error) {
    console.warn("Peringatan Pencarian:", error.message);
    return null;
  }
};