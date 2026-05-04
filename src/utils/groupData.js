export const groupData = (data) => {
  const result = {};

  data.forEach((item) => {
    const tglKey = item.TanggalSort || item.Tanggal;
    const nama = item.Nama || "Tanpa Nama";

    if (!result[tglKey]) {
      result[tglKey] = {
        totalBruto: 0,
        totalUang: 0,
        orang: {},
        labelTgl: item.Tanggal 
      };
    }

    if (!result[tglKey].orang[nama]) {
      result[tglKey].orang[nama] = { totalBruto: 0, totalUang: 0 };
    }

    const bruto = Number(item.Bruto) || 0;
    const uang = Number(item.Uang) || 0;

    result[tglKey].totalBruto += bruto;
    result[tglKey].totalUang += uang;
    result[tglKey].orang[nama].totalBruto += bruto;
    result[tglKey].orang[nama].totalUang += uang;
  });

  return result;
};