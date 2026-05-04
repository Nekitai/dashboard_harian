import axios from "axios";

export default async function handler(req, res) {
  // 1. Cek PIN
  const pin = req.headers["x-secret-pin"];
  if (pin !== process.env.PIN_RAHASIA) {
    return res.status(401).json({ error: "Akses Ditolak! PIN Salah." });
  }

  // 2. Ambil Link
  const sheetUrl = process.env.GOOGLE_SHEET_URL;

  try {
    const response = await axios.get(sheetUrl);
    
    // 3. Kirim langsung sebagai CSV (bukan JSON), biar PapaParse seneng
    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Detail Error:", error.message);
    res.status(500).json({ error: "Gagal narik data dari Google." });
  }
}