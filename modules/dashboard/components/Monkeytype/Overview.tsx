import { useTranslations } from "next-intl";
import OverviewItem from "./OverviewItem";

interface OverviewProps {
  data: any;
}

const Overview = ({ data }: OverviewProps) => {
  const t = useTranslations("DashboardPage.monkeytype");

  // 🛡️ Pelindung: Pastikan data tidak undefined sebelum dikirim ke anak komponen
  const timeData = data?.personalBests?.time || {};
  const wordsData = data?.personalBests?.words || {};

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <OverviewItem data={timeData} type={t("unit_time")} />
      <OverviewItem data={wordsData} type={t("unit_words")} />
    </div>
  );
};

export default Overview;