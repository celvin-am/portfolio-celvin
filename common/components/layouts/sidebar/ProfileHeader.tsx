import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";

import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";
import Tooltip from "../../elements/Tooltip";
import Image from "../../elements/Image";

import cn from "@/common/libs/clsxm";

interface ProfileHeaderProps {
  expandMenu: boolean;
  imageSize: number;
}

const ProfileHeader = ({ expandMenu, imageSize }: ProfileHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-grow items-center gap-4 lg:flex-col lg:items-center lg:justify-center lg:gap-0.5",
        expandMenu && "flex-col !items-start",
      )}
    >
      {/* 📸 Foto Profile - Center */}
      <div className="flex justify-center w-full">
        <Image
          src={"/images/celvin.jpeg"} 
          width={expandMenu ? 80 : imageSize * 1}
          height={expandMenu ? 80 : imageSize * 1}
          alt="Celvin Andra Maulana"
          className="border-2 border-neutral-400 dark:border-neutral-600 lg:hover:scale-105 transition-all duration-300"
          rounded="rounded-full"
        />
      </div>

      {/* 📝 Container Nama & Username - Center */}
      <div className="mt-1 flex flex-col items-center justify-center text-center lg:mt-4 w-full">
        <div className="flex items-center justify-center gap-1.5 w-full">
          <Link href="/" passHref>
            <h2 className="text-[18px] lg:text-[20px] font-medium tracking-tighter whitespace-nowrap">
              Celvin Andra Maulana
            </h2>
          </Link>

          <Tooltip title="Verified">
            <VerifiedIcon size={18} className="text-blue-400 flex-shrink-0" />
          </Tooltip>
        </div>
        
        <div className="hidden text-sm font-code text-neutral-600 transition-all duration-300 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-400 lg:flex justify-center mt-1">
          @celvinaddr
        </div>
      </div>

      {/* 🌓 Toggle Buttons - Center */}
      <div className="hidden justify-center items-center gap-6 lg:mt-5 lg:flex w-full">
        <IntlToggle />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ProfileHeader;