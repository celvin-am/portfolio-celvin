import { createClient } from "@/common/utils/server";

interface GetAchievementsDataProps {
  category?: string;
  search?: string;
}

export const getAchievementsData = async ({
  category,
  search,
}: GetAchievementsDataProps) => {
  const supabase = createClient();

  // Ambil semua kolom termasuk 'image' yang udah lu isi link lengkap
  let query = supabase.from("achievements").select("*");

  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  
  // Balikin data apa adanya. Jangan di-.map lagi!
  return data || [];
};

export const getAchivementTypes = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_enum_values", {
    type_name: "achievement_type",
  });
  if (error) throw new Error(error.message);
  return data?.map((item: any) => item.enum_value) || [];
};

export const getAchivementCategories = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_enum_values", {
    type_name: "achievement_category",
  });
  if (error) throw new Error(error.message);
  return data?.map((item: any) => item.enum_value) || [];
};