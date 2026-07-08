import Link from "next/link";
import { MdMusicNote } from "react-icons/md";

interface CategoryCardProps {
  nameAm: string;
  nameEn?: string;
  slug: string;
  songCount?: number;
  icon?: string;
}

export default function CategoryCard({
  nameAm,
  nameEn,
  slug,
  songCount,
}: CategoryCardProps) {
  return (
    <Link
      href={`/songs?category=${slug}`}
      className={[
        "group flex items-center gap-4 rounded-lg border-l-2 border-gold bg-bg-mid p-5 shadow-lg shadow-black/20",
        "transition-all duration-200 ease-in-out",
        "hover:-translate-y-1 hover:border-gold-light hover:shadow-xl hover:shadow-black/30",
      ].join(" ")}
    >
      {/* Icon container */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg-accent text-xl text-gold">
        <MdMusicNote />
      </div>

      {/* Text content */}
      <div className="flex min-w-0 flex-col">
        <h3
          className={[
            "truncate text-base font-bold text-text-primary",
            "transition-colors duration-150 group-hover:text-gold",
          ].join(" ")}
        >
          {nameAm}
        </h3>
        {nameEn && (
          <p className="truncate text-sm text-text-primary/50">{nameEn}</p>
        )}
        {songCount !== undefined && (
          <span className="mt-0.5 text-xs text-text-primary/40">
            {songCount} {songCount === 1 ? "song" : "songs"}
          </span>
        )}
      </div>
    </Link>
  );
}
