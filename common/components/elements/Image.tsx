"use client";

import clsx from "clsx";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

interface ImageProps extends NextImageProps {
  rounded?: string;
}

const Image = (props: ImageProps) => {
  const { alt, src, className, rounded, ...rest } = props;
  const [isLoading, setLoading] = useState(true);

  return (
    <div
      className={clsx(
        "overflow-hidden w-full h-full flex items-center justify-center", // FIX 1: Biar div luarnya gak mencekik layout (anti-bantet)
        isLoading ? "animate-pulse bg-neutral-200 dark:bg-neutral-800" : "",
        rounded,
      )}
    >
      <NextImage
        className={clsx(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-[1.02] blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          rounded,
          className,
        )}
        src={src || "/images/placeholder.png"}
        alt={alt || "image"}
        loading="lazy"
        quality={75}
        unoptimized // Pantes tadi Next.js gak ngeblokir, karena ini udah di-unoptimized!
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)} // FIX 2: Kalo link error/Supabase private, loadingnya dimatiin biar keliatan icon errornya!
        {...rest}
      />
    </div>
  );
};

export default Image;