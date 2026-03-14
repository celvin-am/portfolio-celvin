import Link from "next/link";
import { HiOutlineArrowSmRight as ViewIcon } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { TbPinnedFilled as PinIcon } from "react-icons/tb";

import Image from "@/common/components/elements/Image";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { ProjectItem } from "@/common/types/projects";
import { STACKS } from "@/common/constants/stacks";

const ProjectCard = ({
  title,
  slug,
  description,
  image,
  stacks,
  is_featured,
}: ProjectItem) => {
  const t = useTranslations("ProjectsPage");

  // KITA HAPUS sistem trimmedContent slice manual agar tinggi kotak konsisten
  // Kita akan pakai CSS 'line-clamp' di bagian bawah nanti.

  return (
    <Link href={`/projects/${slug}`} className="h-full">
      {/* 1. Tambah 'flex flex-col h-full' agar kartu punya tinggi yang sama dalam satu baris */}
      <SpotlightCard className="group relative cursor-pointer flex flex-col h-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
        
        {is_featured && (
          <div className="absolute right-0 top-0 z-10 flex items-center gap-x-1 rounded-bl-lg rounded-tr-lg bg-primary px-2 py-1 text-sm font-medium text-neutral-900">
            <PinIcon size={15} />
            <span>Featured</span>
          </div>
        )}

        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={450}
            height={200}
            className="h-[200px] w-full rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-1 rounded-t-xl bg-black text-sm font-medium text-neutral-50 opacity-0 transition-opacity duration-300 group-hover:opacity-80">
            <span>{t("view_project")}</span>
            <ViewIcon size={20} />
          </div>
        </div>

        {/* 2. Gunakan 'flex-1' agar bagian teks ini menarik sisa ruang kosong ke bawah */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <h3 className="cursor-pointer text-neutral-700 transition-all duration-300 group-hover:text-primary dark:text-neutral-300 font-medium text-lg">
              {title}
            </h3>
            
            {/* 3. Pakai 'line-clamp-3' supaya teks maksimal 3 baris. 
                Ini yang bikin kotak kanan dan kiri tingginya seimbang meskipun jumlah kata beda. */}
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-3">
              {description}
            </p>
          </div>

          {/* 4. Bagian stacks akan selalu menempel di paling bawah kotak berkat flex-col & justify-between */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {stacks.map((stack: string, index: number) => {
              const stackData = STACKS[stack];

              if (!stackData) {
                return null;
              }

              return (
                <div key={index} className={`${stackData.color || ""} transition-transform duration-300 hover:scale-125`}>
                  {stackData.icon}
                </div>
              );
            })}
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
};

export default ProjectCard;