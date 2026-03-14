import { useTranslations } from "next-intl";

import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { convertToOrdinal } from "@/common/helpers";
import { MonkeytypeData } from "@/common/types/monkeytype";

interface LeaderboardProps {
  data: MonkeytypeData;
}

interface ItemProps {
  label: string;
  value: string;
  percent?: string;
}

const Leaderboard = ({ data }: LeaderboardProps) => {
  const t = useTranslations("DashboardPage.monkeytype");

  // 🛡️ PELINDUNG 1: Ambil data time, kalau kosong jadikan array kosong
  const timeData = data?.allTimeLbs?.time;
  const datas = timeData ? Object.values(timeData) : [];

  // 🛡️ PELINDUNG 2: Kalau belum ada riwayat main (kosong), kita buatin "ruang kosong" 
  // biar tampilan 15 detik dan 60 detik tetap muncul rapi.
  const displayDatas = datas.length > 0 ? datas : [null, null];

  const Item = ({ label, value, percent }: ItemProps) => {
    // 🛡️ PELINDUNG 3: Deteksi kalau value-nya error atau kosong
    const isInvalid = !value || value === "-" || value.includes("Invalid") || value.includes("NaN");
    
    // Pisahkan angka dan hurufnya biar nggak numpuk (contoh: 1st, 2nd)
    const number = isInvalid ? "-" : value.replace(/[a-zA-Z]/g, "");
    const suffix = isInvalid ? "" : value.replace(/[0-9]/g, "") || "th";

    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-y-0.5">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {label} {t("unit_seconds")}
          </span>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {t("top")} {percent !== "-" && percent ? `${percent}%` : "-"}
          </span>
        </div>
        <div className="flex gap-1 items-baseline">
          <span className="text-2xl text-primary">{number}</span>
          {suffix && <span className="text-neutral-400 text-sm">{suffix}</span>}
        </div>
      </div>
    );
  };

  return (
    <SpotlightCard className="flex flex-col items-center justify-between gap-y-3 p-4 sm:flex-row sm:gap-y-1">
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        {t("title_leaderboard")}
      </span>
      {displayDatas.map((item: any, index: number) => {
        const rank = item?.english?.rank;
        const count = item?.english?.count;
        
        // 🛡️ PELINDUNG 4: Cek pembagian matematika biar nggak jadi NaN%
        const percent = (rank && count) ? ((rank / count) * 100).toFixed(2) : "-";
        const ordinalValue = rank ? convertToOrdinal(rank) : "-";

        return (
          <Item
            key={index}
            label={index === 0 ? "15" : "60"}
            value={ordinalValue}
            percent={percent}
          />
        );
      })}
    </SpotlightCard>
  );
};

export default Leaderboard;