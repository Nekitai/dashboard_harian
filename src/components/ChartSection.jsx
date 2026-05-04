import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

// Perbaikan 1: Gunakan toLocaleString('id-ID') agar pakai TITIK, dan ubah 1.5jt jadi 1,5jt
const fmtS = n => {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + 'jt';
  return Math.round(n).toLocaleString('id-ID');
};

const fmt = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

export default function ChartSection({ data }) {
  const ref = useRef();
  const chart = useRef();

  useEffect(() => {
    if (chart.current) chart.current.destroy();
    
    // Pastikan urutan grafik dari kiri (terlama) ke kanan (terbaru)
    const dates = Object.keys(data).sort((a, b) => a.localeCompare(b));
    
    chart.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        // Perbaikan 2: Ambil tanggal asli dari groupData (misal: 15/04/2026 -> 15/04)
        labels: dates.map(d => {
          const labelAsli = data[d].displayTanggal || d;
          return labelAsli.substring(0, 5); // Tampilkan tgl/bln saja di bawah batang
        }),
        datasets: [{ 
          data: dates.map(d => data[d].totalBruto),
          backgroundColor: 'rgba(167,139,250,0.65)',
          borderColor: 'rgba(167,139,250,0.9)',
          borderWidth: 1, 
          borderRadius: 8, 
          borderSkipped: false,
          hoverBackgroundColor: 'rgba(167,139,250,0.85)' // Efek hover
        }]
      },
      options: {
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false }, 
          tooltip: {
            backgroundColor: 'rgba(20,15,50,0.85)',
            borderColor: 'rgba(255,255,255,0.15)', 
            borderWidth: 1,
            titleColor: 'rgba(255,255,255,0.6)', 
            bodyColor: '#fff',
            padding: 10,
            callbacks: { 
              // Perbaikan 3: Tampilkan tanggal lengkap saat batang di-hover
              title: (tooltipItems) => {
                const idx = tooltipItems[0].dataIndex;
                return data[dates[idx]].displayTanggal || dates[idx];
              },
              label: ctx => ' ' + fmt(ctx.raw) 
            }
          }
        },
        scales: {
          x: { 
            grid: { display: false }, 
            ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } } 
          },
          y: { 
            beginAtZero: true, // Perbaikan 4: Batang grafik proporsional dari 0
            grid: { color: 'rgba(255,255,255,0.06)' }, 
            ticks: { 
              color: 'rgba(255,255,255,0.35)', 
              font: { size: 11 }, 
              callback: v => fmtS(v) 
            }, 
            border: { dash: [4, 4], color: 'transparent' } 
          }
        }
      }
    });
    
    return () => chart.current?.destroy();
  }, [data]);

  return (
    <div className="glass p-4 mb-5 rounded-2xl border border-white/5 bg-white/[0.02]">
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-4">Grafik bruto harian</p>
      <div className="relative w-full" style={{ height: 190 }}>
        <canvas ref={ref} role="img" aria-label="Grafik bruto harian">Data bruto per hari.</canvas>
      </div>
    </div>
  );
}