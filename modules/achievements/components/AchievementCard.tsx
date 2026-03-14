"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowSmRight as ViewIcon } from "react-icons/hi";
import { IoClose as CloseIcon } from "react-icons/io5";
import { AchievementItem } from "@/common/types/achievements";

import Image from "@/common/components/elements/Image";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import Portal from "@/common/components/elements/Portal";
import Link from "next/link";

const AchievementCard = ({
  id,
  name,
  issuing_organization,
  issue_date,
  image,
  type,
  category,
  credential_id,
  url_credential,
}: AchievementItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("AchievementsPage");

  const issueDate = issue_date ? format(parseISO(issue_date), "MMMM yyyy") : "";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const uniqueId = id || name.replace(/\s+/g, "-").toLowerCase();

  return (
    <>
      <motion.div
        layoutId={`card-${uniqueId}`}
        onClick={() => setIsOpen(true)}
        className="h-full cursor-pointer"
      >
        <SpotlightCard className="group flex h-full flex-col overflow-hidden border border-neutral-200 dark:border-neutral-800 transition-all duration-300">
          <div className="relative overflow-hidden aspect-video">
            <motion.div layoutId={`image-${uniqueId}`} className="h-full w-full">
              <Image
                src={image || "/images/placeholder.png"}
                alt={name}
                width={500}
                height={250}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-sm font-medium">View detail</span>
              <ViewIcon size={20} />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
            <div className="space-y-2">
              {credential_id && (
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  {credential_id}
                </p>
              )}
              <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                {name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {issuing_organization}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10px] font-medium capitalize text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  {type}
                </span>
                <span className="rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10px] font-medium capitalize text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                  {category}
                </span>
              </div>

              <div className="border-t border-neutral-100 pt-2 dark:border-neutral-800">
                <p className="text-[10px] font-bold uppercase text-neutral-400 dark:text-neutral-500">
                  Issued on {issueDate}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              <motion.div
                layoutId={`card-${uniqueId}`}
                className="relative z-[10000] flex max-w-6xl w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-[10001] rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                >
                  <CloseIcon size={20} />
                </button>

                <div className="flex flex-col md:flex-row min-h-[400px]">
                  {/* BAGIAN GAMBAR: object-cover biar mepet border */}
                  <div className="flex-1 w-full bg-neutral-100 dark:bg-neutral-800 min-h-[300px] md:min-h-[500px]">
                    <motion.div layoutId={`image-${uniqueId}`} className="w-full h-full">
                      <Image
                        src={image || "/images/placeholder.png"}
                        alt={name}
                        width={1200}
                        height={800}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </div>

                  {/* BAGIAN SIDEBAR: Lebar dikunci md:w-[360px] & shrink-0 */}
                  <div className="flex flex-col justify-between border-l border-neutral-200 py-6 pl-8 pr-12 dark:border-neutral-800 md:flex md:w-[360px] shrink-0 bg-white dark:bg-neutral-900 overflow-y-auto">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight">
                        {name}
                      </h2>
                      <p className="mt-2 text-sm text-neutral-500">
                        {issuing_organization}
                      </p>
                      
                      <div className="mt-8 space-y-5">
                        <InfoItem label="Credential ID" value={credential_id} />
                        <InfoItem label="Type" value={type} />
                        <InfoItem label="Category" value={category} />
                        <InfoItem label="Issue Date" value={issueDate} />
                      </div>
                    </div>

                    {url_credential && (
                      <Link
                        href={url_credential}
                        target="_blank"
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                      >
                        <span>Show Credential</span>
                        <ViewIcon size={18} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

// Komponen Pembantu Info Sidebar
const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
      {label}
    </p>
    <p className="mt-0.5 text-sm font-medium dark:text-neutral-300 capitalize">
      {value || "-"}
    </p>
  </div>
);

export default AchievementCard;