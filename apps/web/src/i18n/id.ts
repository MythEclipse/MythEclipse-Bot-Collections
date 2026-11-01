import type { Messages } from "./en";

/**
 * Indonesian copy. Same keys as `en.ts`; the type makes a missed key a compile
 * error. Display lines stay short on purpose — they carry the 780 weight at up
 * to 6rem and the serif italic phrase.
 */
export const id: Messages = {
  "nav.primaryLabel": "Utama",
  "nav.bots": "Bot",
  "nav.support": "Bantuan",
  "nav.signIn": "Masuk",
  "nav.language": "Bahasa",
  "nav.theme.toLight": "Ganti ke tema terang",
  "nav.theme.toDark": "Ganti ke tema gelap",
  "brand.tag": "Bot Collections",
  "help.heading": "Bantuan, privasi, dan ketentuan",
  "help.body": "Tiga jawaban singkat, bukan tiga halaman. Dokumen yang mengikat tetap per bot, karena tiap aplikasi Discord menunjuk pasangan URL-nya sendiri.",
  "footer.helpLink": "Bantuan, privasi & ketentuan",
  "skip.link": "Lompat ke konten",

  "footer.blurb": "Bot Discord dari MythEclipse. Tiap bot punya ketentuan dan kebijakan privasi sendiri.",
  "footer.legalLabel": "Legal",
  "footer.copyright": "© {year} MythEclipse",

  "landing.hero.line1": "Servermu.",
  "landing.hero.line2": "Lebih bertenaga.",
  "landing.hero.lead": "Koleksi kecil bot Discord yang dibuat dengan teliti. Satu dashboard untuk setiap server yang memakainya.",
  "landing.hero.cta": "Buka dashboard",
  "landing.hero.secondary": "Lihat koleksinya",

  "proof.result": "Role dibuat — hanya kosmetik, di bawah role staf, tanpa izin apa pun.",
  "proof.caption": "Beginilah perintah yang diketik member. Bot yang membuat role-nya, dan izin staf tidak pernah tersentuh.",

  "products.heading": "Satu rumah untuk semua bot.",
  "products.body": "Satu bot hari ini. Bot berikutnya muncul di sini begitu benar-benar siap. Setiap server punya ruang kerjanya sendiri.",
  "products.loading": "Memuat koleksi…",
  "products.error": "Koleksi gagal dimuat.",
  "products.retry": "Coba lagi",
  "products.empty": "Belum ada bot yang terbit. Yang pertama muncul di sini begitu siap.",

  "product.available": "Tersedia",
  "product.comingSoon": "Segera",
  "product.manage": "Kelola bot →",


  "cta.line1": "Bikin komunitasmu",
  "cta.line2": "terasa milikmu.",
  "cta.body": "Masuk dengan Discord; ruang kerja terbuka hanya kalau kamu bisa mengelola server itu.",
  "cta.button": "Buka dashboard",

  "dash.h1": "Ruang kerjamu.",
  "dash.lead": "Kondisi terkini server tempat Booster Role berjalan.",
  "dash.checking": "Memeriksa sesi…",
  "dash.signIn.heading": "Masuk untuk mengelola server ini",
  "dash.signIn.body": "Masuk memakai Discord. Ruang kerja terbuka hanya kalau akunmu punya izin Administrator atau Kelola Server di server ini.",
  "dash.signIn.button": "Lanjut dengan Discord",
  "dash.auth.denied": "Akun Discord itu tidak bisa mengelola server ini, jadi ruang kerjanya tidak dibuka.",
  "dash.auth.state": "Proses masuk terlalu lama atau berasal dari tab lain. Coba lagi.",
  "dash.auth.error": "Discord menolak proses masuk. Coba lagi sebentar lagi.",
  "dash.signedInAs": "Masuk sebagai",
  "dash.signOut": "Keluar",
  "dash.signingOut": "Keluar…",
  "dash.loadingServer": "Memuat server dari Discord…",
  "dash.loadError": "Server ini gagal dibaca dari Discord.",
  "dash.rolesLoading": "Memeriksa role yang dibuat bot…",
  "dash.rolesError": "Role di server ini gagal dibaca dari Discord.",
  "dash.retry": "Coba lagi",
  "dash.connected": "● Terhubung",
  "dash.guild": "Server {id}",
  "dash.readAt": "Dibaca dari Discord pada {time}",

  "metric.members": "Anggota (perkiraan)",
  "metric.boosters": "Booster",
  "metric.managedRoles": "Role terkelola",

  "roles.heading": "Role booster di server ini",
  "roles.summary": "{safe} dari {total} role lolos semua pemeriksaan keamanan.",
  "roles.allSafe": "● Semua aman",
  "roles.attentionOne": "● 1 perlu perhatian",
  "roles.attention": "● {count} perlu perhatian",
  "roles.empty": "Belum ada booster yang mengambil role. Pengambilan pertama akan muncul di sini beserta hasil pemeriksaannya.",
  "roles.safe": "● Aman dipakai",
  "roles.rejected": "● Akan ditolak",
  "roles.member": "Anggota {id}",

  "check.boosterEligibility": "Kelayakan booster",
  "check.roleOwnership": "Kepemilikan role",
  "check.botManaged": "Role dikelola bot",
  "check.cosmeticPermissions": "Tanpa izin",
  "check.safePosition": "Posisi role aman",

  "fix.boosterEligibility": "Minta anggota boost lagi; bot menyinkronkan ulang pada pembaruan berikutnya.",
  "fix.roleOwnership": "Minta anggota menjalankan /booster-role claim lagi supaya role tersimpan cocok.",
  "fix.botManaged": "Baris tersimpan masih ada padahal role-nya sudah hilang — hapus baris itu, lalu minta anggota mengambil role baru.",
  "fix.cosmeticPermissions": "Cabut semua izin dari role ini; seharusnya kosmetik saja.",
  "fix.safePosition": "Geser role ke bawah role bot sendiri di Pengaturan Server → Role.",

  "diag.summary": "Diagnostik: periksa role secara manual",
  "diag.note":
    "Nilai contoh, bukan data servermu. Panel ini menjalankan kontrak yang sama dengan bot, jadi kamu bisa melihat persis kenapa sebuah role akan ditolak.",
  "diag.userId": "ID pengguna Discord",
  "diag.roleId": "ID role Discord",
  "diag.storedUserId": "ID pengguna tersimpan",
  "diag.storedRoleId": "ID role tersimpan",
  "diag.rolePosition": "Posisi role",
  "diag.anchorPosition": "Posisi role bot",
  "diag.permissions": "Izin role (pisahkan dengan koma)",
  "diag.permissionsPlaceholder": "ManageRoles, KickMembers",
  "diag.managed": "Role dikelola bot",
  "diag.eligible": "Pengguna sedang boost",
  "diag.caption": "Pemeriksaan untuk nilai di atas",
  "diag.check": "Pemeriksaan",
  "diag.detail": "Detail",
  "diag.result": "Hasil",
  "diag.pass": "Lolos",
  "diag.fail": "Gagal",
  "diag.region": "Pemeriksaan keamanan",

  "support.h1": "Pusat bantuan",
  "support.body":
    "Ceritakan apa yang terjadi dan sertakan id server, id ruang kerja yang tampil di dashboard, dan perintah yang kamu pakai. Jangan pernah mengirim token bot atau kata sandi.",
  "support.before.one": "Pastikan bot masih ada di server dan role-nya berada di atas role yang dikelolanya.",
  "support.before.two":
    "Pastikan anggota masih punya role kelayakan booster; kalau tidak, role-nya memang dicabut.",
  "support.before.three": "Cek dashboard untuk status ruang kerja dan waktu pembaruan terakhir.",
  "support.emailLabel": "Email bantuan",

  "legal.privacy": "Privasi",
  "legal.terms": "Ketentuan",
  "legal.updated": "Terakhir diperbarui",
  "legal.effective": "Berlaku sejak",
  "legal.notFound.title": "Dokumen tidak ditemukan",
  "legal.notFound.subtitle": "Tidak ada dokumen legal di alamat ini.",
  "legal.notFound.body.one": "Pilih bot dari indeks",
  "legal.notFound.body.two": "atau",
  "legal.notFound.body.three": ".",
  "legal.index.privacy.subtitle": "Tiap bot punya kebijakannya sendiri. Halaman ini menjelaskan koleksinya.",
  "legal.index.terms.subtitle": "Tiap bot punya ketentuannya sendiri. Halaman ini menjelaskan koleksinya.",
  "legal.index.privacy.body":
    "MythEclipse Bot Collections adalah kumpulan bot Discord yang dijalankan pengembang yang sama. Tiap bot menerbitkan kebijakan privasinya sendiri, karena tiap bot meminta intent Discord dan menyimpan data yang berbeda.",
  "legal.index.terms.body":
    "MythEclipse Bot Collections adalah kumpulan bot Discord yang dijalankan pengembang yang sama. Tiap bot menerbitkan ketentuannya sendiri, karena tiap bot meminta izin Discord yang berbeda.",
  "legal.index.termsLink": "Ketentuan layanan",
  "legal.index.policy": "Kebijakan privasi",
  "legal.index.site": "Situs ini",
  "legal.index.privacy.site":
    "Situs yang kamu baca ini halaman statis. Tidak memasang cookie, tidak menjalankan analitik atau pelacak, dan tidak meminta akun. Situs hanya memanggil API koleksi ini untuk menampilkan daftar bot dan memuat dashboard server; tidak ada data dari panggilan itu yang dibagikan ke pihak ketiga.",
  "legal.index.terms.site":
    "Situs ini bersifat informatif. Memakainya tidak memberi akses ke bot melebihi yang diizinkan Discord, dan bot bisa diubah atau dihentikan kapan saja.",
  "legal.index.contact": "Kontak dan perubahan",
  "legal.index.contact.body":
    "Pertanyaan soal bot mana pun atau soal koleksinya: {email}. Saat perilaku sebuah bot berubah, halamannya diperbarui dan tanggal di atas halaman ikut berubah.",
  "legal.notice": "Dokumen hukum di halaman ini tersedia dalam bahasa Inggris.",

  "notFound.h1": "Halaman ini sudah menghilang.",
  "notFound.body": "Tautannya mungkin sudah lama.",
  "notFound.back": "Kembali ke halaman utama"
};