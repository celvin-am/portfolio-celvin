"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AchievementItem } from "@/common/types/achievements";
import { fetcher } from "@/services/fetcher";

import EmptyState from "@/common/components/elements/EmptyState";
import AchievementCard from "./AchievementCard";
import AchievementSkeleton from "./AchievementSkeleton";
import FilterHeader from "./FilterHeader";

const Achievements = () => {
  const t = useTranslations("AchievementsPage");
  const params = useSearchParams();

  const type = params.get("type");
  const category = params.get("category");
  const search = params.get("search");

  // 1. Fetch SEMUA data tanpa query params di API, biar kita punya master datanya
  const { data, isLoading, error } = useSWR("/api/achievements", fetcher);

  // 2. Trik Rahasia: Ekstrak tipe dan kategori langsung dari data!
  // Ini yang bikin dropdown lu bakal langsung keisi "Course", "Badge", dll secara otomatis
  const typesData = Array.from(
    new Set(data?.map((item: AchievementItem) => item?.type).filter(Boolean))
  ) as string[];

  const categoriesData = Array.from(
    new Set(data?.map((item: AchievementItem) => item?.category).filter(Boolean))
  ) as string[];

  // 3. Logika Filter di Frontend (Client-side)
  const filteredAchievements: AchievementItem[] = data
    ?.filter((item: AchievementItem) => {
      const matchesShow = item?.is_show !== false;

      // Filter kebal huruf besar/kecil
      const matchesCategory = !category || item?.category?.toLowerCase() === category.toLowerCase();
      const matchesType = !type || item?.type?.toLowerCase() === type.toLowerCase();
      const matchesSearch = !search || item?.name?.toLowerCase().includes(search.toLowerCase());

      return matchesShow && matchesType && matchesCategory && matchesSearch;
    })
    .sort((a: AchievementItem, b: AchievementItem) => b.id - a.id);

  return (
    <section className="space-y-4">
      <FilterHeader
        // Sekarang lempar data yang udah diekstrak ke dropdown
        categoryOptions={categoriesData}
        typeOptions={typesData}
        totalData={filteredAchievements?.length || 0}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <AchievementSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <EmptyState message={t("error")} />}

      {!isLoading && !error && filteredAchievements?.length === 0 && (
        <EmptyState message={t("no_data")} />
      )}

      {!isLoading && !error && filteredAchievements?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredAchievements?.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AchievementCard {...item} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievements;