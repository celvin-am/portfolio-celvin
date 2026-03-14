import { useTranslations } from "next-intl";
// KUNCINYA DI SINI: Import dari next/image langsung, BUKAN dari @/common/...
import Image from "next/image"; 

const Story = () => {
  const t = useTranslations("AboutPage");

  const paragraphData = [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];

  return (
    <section className="space-y-4 leading-7 text-neutral-800 dark:text-neutral-300">
      {paragraphData.map((paragraph) => (
        <div key={paragraph.index}>
          {t(`resume.paragraph_${paragraph.index}`)}
        </div>
      ))}

      {/* Tanda tangan dijamin anteng di kiri */}
      <div className="pt-2 block">
        <Image
          src="/images/signature.png"
          alt="Celvin Signature"
          width={100} // Sesuaikan ukurannya
          height={100}
          className="object-contain"
        />
      </div>
    </section>
  );
};

export default Story;