import { useState } from "react";
import { format, isValid } from "date-fns";

import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { PersonalBestsTime } from "@/common/types/monkeytype";

interface OverviewItemProps {
  data?: {
    [time: string]: PersonalBestsTime[];
  };
  type?: string;
}

interface ItemProps {
  data: {
    time: string;
    maxWpm: PersonalBestsTime;
  };
  type?: string;
}

interface ItemHoveredProps {
  data: {
    time: string;
    maxWpm: PersonalBestsTime;
  };
  type?: string;
}

const Item = ({ data, type }: ItemProps) => (
  <div className="flex flex-col items-center gap-y-1">
    <span className="flex text-xs text-neutral-500">{`${data?.time} ${type}`}</span>
    <span className="text-3xl text-primary">
      {/* 🛡️ Proteksi Math.round */}
      {Math.round(data?.maxWpm?.wpm || 0)}
    </span>
    <span className="text-lg text-neutral-600 dark:text-neutral-400">
      {`${Math.floor(data?.maxWpm?.acc || 0)}%`}
    </span>
  </div>
);

const ItemHovered = ({ data, type }: ItemHoveredProps) => {
  // 🛡️ Proteksi format tanggal agar tidak Invalid Time Value
  const rawTimestamp = data?.maxWpm?.timestamp;
  const date = rawTimestamp ? new Date(rawTimestamp) : null;
  const formattedDate = date && isValid(date) ? format(date, "dd MMM yyyy") : "-";

  return (
    <div className="flex flex-col items-center gap-y-1 text-xs">
      <span className="flex text-neutral-500">{`${data?.time} ${type}`}</span>
      <span className="text-primary">
        {`${Math.round(data?.maxWpm?.wpm || 0)} wpm`}
      </span>
      <span className="text-primary">{`${Math.floor(data?.maxWpm?.raw || 0)} raw`}</span>
      <span className="text-primary">{`${Math.floor(data?.maxWpm?.acc || 0)}% acc`}</span>
      <span className="text-primary">{`${Math.floor(data?.maxWpm?.consistency || 0)}% con`}</span>
      <span className="text-neutral-500">{formattedDate}</span>
    </div>
  );
};

const OverviewItem = ({ data, type }: OverviewItemProps) => {
  const [isHover, setIsHover] = useState("");

  const handleHover = (item: string) => {
    setIsHover(item);
  };

  if (data && typeof data === "object") {
    const keys = Object.keys(data);
    
    // 🛡️ Jika tidak ada data, jangan tampilkan apa-apa atau tampilkan skeleton
    if (keys.length === 0) return null;

    const datas = keys.map((time) => {
      const items = data[time] || [];
      
      // 🛡️ Cari nilai max dengan aman
      const maxWpm = items.length > 0 
        ? items.reduce((prev, current) => (prev.wpm > current.wpm ? prev : current))
        : { wpm: 0, acc: 0, raw: 0, consistency: 0, timestamp: Date.now(), difficulty: "", lazyMode: false, language: "", punctuation: false } as PersonalBestsTime;

      return { time, maxWpm };
    });

    return (
      <SpotlightCard className="grid grid-cols-4 items-center justify-center p-4">
        {datas.map((item) => {
          return (
            <div
              key={item.time}
              onMouseEnter={() => handleHover(item.time)}
              onMouseLeave={() => handleHover("")}
              className="flex h-28 items-center justify-center cursor-default"
            >
              {isHover === item.time ? (
                <ItemHovered type={type} data={item} />
              ) : (
                <Item type={type} data={item} />
              )}
            </div>
          );
        })}
      </SpotlightCard>
    );
  }
  return null;
};

export default OverviewItem;