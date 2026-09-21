import { 
  dataDonasi, 
  filterDonasiByKategori, 
  ringkasDataDonasi, 
  hitungTotalUnit, 
  cariDonasiById 
} from './donasiService.js';

console.log("=== SISTEM PLATFORM DONASI BENCANA ===");

// A. Menampilkan Ringkasan Semua Donasi (.map)
console.log("\n1. Ringkasan Seluruh Donasi:");
const ringkasan = ringkasDataDonasi(dataDonasi);
ringkasan.forEach(item => console.log(item));

// B. Filter Berdasarkan Kategori 'logistik' (.filter)
console.log("\n2. Filter Donasi Kategori Logistik:");
const donasiLogistik = filterDonasiByKategori(dataDonasi, "logistik");
console.log(donasiLogistik);

// C. Total Unit Barang Donasi (.reduce)
const totalUnit = hitungTotalUnit(dataDonasi);
console.log(`\n3. Total Seluruh Unit Barang Donasi Terkumpul: ${totalUnit} unit`);

// D. Pencarian ID Berdasarkan (.find) + Uji Error Handling
console.log("\n4. Cari Donasi ID 2:");
console.log(cariDonasiById(dataDonasi, 2));

console.log("\n5. Uji Coba Error Handling (Cari ID yang Tidak Ada):");
cariDonasiById(dataDonasi, 99); // Akan memicu Error Handling tanpa merusak program