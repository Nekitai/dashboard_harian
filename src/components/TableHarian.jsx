import { useState } from "react";

// Helper untuk format tampilan uang dan angka
const fmtUang = (n) =>
  "Rp " + Number(n).toLocaleString("id-ID");

const fmtAngka = (n) =>
  Number(n).toLocaleString("id-ID");

// Palet warna untuk indikator setiap tanggal
const COLORS = ['#a78bfa', '#34d399', '#60a5fa', '#f472b6', '#fb923c', '#2dd4bf'];

export default function TableHarian({ data }) {
  // Mengurutkan key tanggal (YYYY-MM-DD) agar yang terbaru muncul paling atas
  const dates = Object.keys(data).sort((a, b) => b.localeCompare(a));
  
  // State untuk mengontrol baris mana yang terbuka (default semua terbuka)
  const [open, setOpen] = useState({});

  const toggle = (tgl) => {
    setOpen((prev) => ({
      ...prev,
      [tgl]: prev[tgl] === undefined ? false : !prev[tgl],
    }));
  };

  // Fungsi pengecekan status buka/tutup (default true jika belum ada di state)
  const isRowOpen = (tgl) => open[tgl] !== false;

  return (
    <div className="space-y-3">
      {dates.map((tglKey, idx) => {
        const dayData = data[tglKey];
        const color = COLORS[idx % COLORS.length];
        const isOpen = isRowOpen(tglKey);

        return (
          <div key={tglKey} className="glass overflow-hidden transition-all duration-300">
            {/* Header Accordion Per Tanggal */}
            <div 
              onClick={() => toggle(tglKey)}
              className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ background: color }} />
                <span className="text-[13.5px] font-semibold text-white/90">
                  {/* Gunakan displayTanggal (15/04/2026) jika ada, jika tidak pakai key (2026-04-15) */}
                  {dayData.displayTanggal || tglKey}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex gap-4 text-[11px] tracking-wide">
                  <span className="text-white/40">Bruto: <b className="text-white/80 font-medium">{fmtAngka(dayData.totalBruto)}</b></span>
                  <span className="text-white/40">Uang: <b className="text-white/80 font-medium">{fmtUang(dayData.totalUang)}</b></span>
                </div>
                <span 
                  className="text-[10px] text-white/30 transition-transform duration-300"
                  style={{ transform: `rotate(${isOpen ? 0 : -90}deg)` }}
                >
                  ▼
                </span>
              </div>
            </div>

            {/* Isi Detail Tabel Per Orang */}
            {isOpen && (
              <div className="animate-fadeIn" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20">
                        <th className="py-2.5 px-4 font-medium text-white/30 uppercase tracking-widest text-[9px] w-[45%]">Nama Driver</th>
                        <th className="py-2.5 px-4 font-medium text-white/30 uppercase tracking-widest text-[9px] text-right">Bruto</th>
                        <th className="py-2.5 px-4 font-medium text-white/30 uppercase tracking-widest text-[9px] text-right">Netto Uang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(dayData.orang).map((nama) => (
                        <tr 
                          key={nama} 
                          className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 text-white/80 flex items-center gap-3">
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold uppercase"
                              style={{ 
                                background: `${color}15`, 
                                border: `1px solid ${color}30`,
                                color: color 
                              }}
                            >
                              {nama.substring(0, 2)}
                            </div>
                            <span className="font-medium truncate">{nama}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-white/70 tabular-nums font-light">
                            {fmtAngka(dayData.orang[nama].totalBruto)}
                          </td>
                          <td className="px-4 py-3 text-right text-white/70 tabular-nums font-light">
                            {fmtUang(dayData.orang[nama].totalUang)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white/[0.04] border-t border-white/10">
                        <td className="px-4 py-2.5 text-white/90 font-bold text-[11px]">TOTAL HARIAN</td>
                        <td className="px-4 py-2.5 text-right text-white font-bold tabular-nums">
                          {fmtAngka(dayData.totalBruto)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-[#4ade80] font-bold tabular-nums">
                          {fmtUang(dayData.totalUang)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}