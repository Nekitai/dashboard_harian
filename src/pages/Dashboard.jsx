import { useEffect, useState, useMemo } from "react";
import { groupData } from "../utils/groupData";
import SummaryCards from "../components/SummaryCard";
import ChartSection from "../components/ChartSection";
import TableHarian from "../components/TableHarian";
import * as Papa from "papaparse";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // 1. TAMBAH STATE LOADING
  const [isLoading, setIsLoading] = useState(true);

  const cleanNumber = (val) => {
    if (val === undefined || val === null || val === "") return 0;
    let str = String(val);
    str = str.replace(/Rp/g, "").replace(/\s/g, "").replace(/\./g, "");
    str = str.replace(",", ".");
    return parseFloat(str) || 0;
  };

  const formattanggal = (tgl) => {
    if (!tgl || typeof tgl !== "string") return "";
    const parts = tgl.split("/");
    if (parts.length !== 3) return tgl;
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };

  useEffect(() => {
    // 1. Siapkan opsi fetch dengan PIN Rahasia
    const requestOptions = {
      headers: {
        "x-secret-pin": "361479", 
      },
    };

    // Tembak pake fetch dan requestOptions
    fetch("/api/laporan", requestOptions)
      .then((res) => {
        if (!res.ok) throw new Error("Akses ditolak");
        return res.text(); // Tetap pakai text() kayak aslinya!
      })
      .then((csv) => {
        // Papa parse tetap baca 'csv' seperti biasa
        const parsed = Papa.parse(csv, { skipEmptyLines: true });
        const rawRows = parsed.data.slice(1);

        let lastTanggal = "";

        const clean = rawRows
          .map((row) => {
            if (row[0] && row[0].trim() !== "") {
              lastTanggal = row[0];
            }
            return {
              Tanggal: lastTanggal,
              TanggalSort: formattanggal(lastTanggal),
              Nama: row[1] || "Tanpa Nama",
              Bruto: cleanNumber(row[2]),
              Uang: cleanNumber(row[6]),
            };
          })
          .filter((item) => item.Tanggal !== "");

        setData(clean);
        setIsLoading(false); // Matikan loading jika pakai skeleton
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setIsLoading(false);
      });
  }, []);

  const uniqueDates = useMemo(() => {
    const dates = [...new Set(data.map((i) => i.TanggalSort))];
    return dates.filter(Boolean).sort((a, b) => b.localeCompare(a));
  }, [data]);

  useEffect(() => {
    if (uniqueDates.length > 0 && selectedDate === null) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  const filteredData = useMemo(() => {
    return selectedDate ? data.filter((item) => item.TanggalSort === selectedDate) : data;
  }, [data, selectedDate]);

  const grouped = useMemo(() => groupData(filteredData), [filteredData]);
  const totalBruto = useMemo(() => filteredData.reduce((t, i) => t + i.Bruto, 0), [filteredData]);
  const totalUang = useMemo(() => filteredData.reduce((t, i) => t + i.Uang, 0), [filteredData]);
  const jumlahHari = Object.keys(grouped).length;

  // 3. RENDER SKELETON JIKA MASIH LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1a1040 0%,#0f2356 40%,#0d3d4a 70%,#0a2e1a 100%)" }}>
        <div className="animate-pulse">
          {/* Skeleton Header */}
          <div className="glass p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 bg-white/[0.02]">
            <div>
              <div className="h-6 w-48 bg-white/10 rounded-lg mb-2"></div>
              <div className="h-3 w-32 bg-white/5 rounded-lg"></div>
            </div>
            <div className="h-10 w-40 bg-white/10 rounded-xl"></div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-[20px] glass bg-white/[0.02] border border-white/5 h-[104px]">
                <div className="h-3 w-20 bg-white/10 rounded-lg mb-3"></div>
                <div className="h-6 w-28 bg-white/20 rounded-lg mb-3"></div>
                <div className="h-3 w-16 bg-white/5 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Skeleton Chart */}
          <div className="glass p-4 mb-5 rounded-2xl border border-white/5 bg-white/[0.02] h-[240px]">
            <div className="h-3 w-32 bg-white/10 rounded-lg mb-6"></div>
            <div className="h-[170px] w-full bg-white/5 rounded-xl"></div>
          </div>

          {/* Skeleton Table */}
          <div className="mt-8 space-y-4">
            <div className="h-3 w-28 bg-white/10 rounded-lg mb-4"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[72px] w-full glass rounded-2xl bg-white/[0.02] border border-white/5"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen p-6 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(135deg,#1a1040 0%,#0f2356 40%,#0d3d4a 70%,#0a2e1a 100%)",
      }}
    >
      {/* BACKGROUND DECORATION */}
      <div className="absolute w-80 h-80 -top-20 -left-20 rounded-full pointer-events-none opacity-50" style={{ background: "radial-gradient(circle,rgba(120,80,255,0.35) 0%,transparent 70%)" }} />

      {/* HEADER CARD */}
      <div className="glass p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 bg-white/[0.03] shadow-lg">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold tracking-wide">Dashboard Laporan</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 font-medium tracking-wider uppercase">Live</span>
          </div>
          <p className="text-[11px] text-white/50">{selectedDate ? `Menampilkan data periode: ${selectedDate}` : "Menampilkan data semua periode"}</p>
        </div>

        {/* DROPDOWN FILTER */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/90 bg-black/20 border border-white/10 hover:bg-black/30 transition-colors backdrop-blur-md">
          <select className="bg-transparent border-none outline-none cursor-pointer appearance-none pr-6 w-full" value={selectedDate || ""} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="" className="bg-[#1a1040]">
              Semua Tanggal
            </option>
            {uniqueDates.map((tgl) => (
              <option key={tgl} value={tgl} className="bg-[#1a1040]">
                {tgl}
              </option>
            ))}
          </select>
          <div className="pointer-events-none -ml-5 opacity-50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* RENDER COMPONENTS */}
      <SummaryCards totalBruto={totalBruto} totalUang={totalUang} jumlahHari={jumlahHari} />

      <div className="mt-6">
        <ChartSection data={grouped} />
      </div>

      <div className="mt-8">
        <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-3">Rincian per hari</p>
        <TableHarian data={grouped} />
      </div>
    </div>
  );
}
