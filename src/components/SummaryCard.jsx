// Fungsi untuk angka biasa (tanpa Rp) untuk Bruto
const fmtAngka = n => {
  if (!n || isNaN(n)) return "0";
  return Math.round(n).toLocaleString('id-ID');
};

// Fungsi khusus untuk uang (menambahkan Rp)
const fmtRp = n => {
  if (!n || isNaN(n)) return "Rp 0";
  return "Rp " + Math.round(n).toLocaleString('id-ID');
};

export default function SummaryCard({ totalBruto, totalUang, jumlahHari }) {
  // Proteksi agar tidak NaN jika jumlahHari 0
  const rataRata = jumlahHari > 0 ? (totalBruto / jumlahHari) : 0;

  const cards = [
    // Bagian pill dihapus, diganti dengan sub teks biasa
    { lbl:'Total Bruto',  val:fmtAngka(totalBruto),        sub:'Akumulasi bruto', accent:true },
    { lbl:'Total Uang',   val:fmtRp(totalUang),            sub:'Terkumpul' },
    { lbl:'Jumlah Hari',  val:jumlahHari,                  sub:'Periode aktif' },
    { lbl:'Rerata/Hari',  val:fmtAngka(rataRata),          sub:'Bruto rata-rata' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {cards.map(c => (
        <div key={c.lbl} className={`p-4 rounded-[20px] ${c.accent
          ? 'border border-[rgba(150,160,255,0.35)]'
          : 'glass'}`}
          style={c.accent ? {
            background:'linear-gradient(135deg,rgba(99,102,241,0.55),rgba(59,130,246,0.45))',
            backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
            border:'1px solid rgba(150,160,255,0.35)', borderRadius:20
          } : {}}>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-2"
            style={{ color: c.accent ? 'rgba(200,210,255,0.7)' : 'rgba(255,255,255,0.5)' }}>
            {c.lbl}
          </p>
          <p className="text-[22px] font-semibold text-white tracking-tight leading-none">{c.val}</p>
          
          {/* Karena c.pill sudah dihapus, otomatis akan merender teks keterangan (c.sub) */}
          {c.pill
            ? <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background:'rgba(99,255,160,0.15)', color:'rgba(120,255,180,0.9)', border:'1px solid rgba(99,255,160,0.25)' }}>
                {c.pill}
              </span>
            : <p className="text-[11px] mt-1.5" style={{ color:'rgba(255,255,255,0.4)' }}>{c.sub}</p>
          }
        </div>
      ))}
    </div>
  );
}