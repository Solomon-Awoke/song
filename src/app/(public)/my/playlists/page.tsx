import Link from "next/link";
import { requireAuth } from "@/lib/auth-helpers";
import dbConnect from "@/lib/db";
import Playlist from "@/models/Playlist";
import { FiMusic, FiChevronRight } from "react-icons/fi";
import CreatePlaylistButton from "./CreatePlaylistButton";

// ---------- Types ----------

interface PlaylistItem {
  _id: string;
  name: string;
  description?: string;
  songs: { _id: string }[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- Empty State ----------

function EmptyState() {
  return (
    <div className="py-24 text-center">
      <div className="mb-4 text-4xl text-gold/40" aria-hidden="true">
        ✠
      </div>
      <p className="text-lg text-text-primary/50">ምንም የመዝሙር ዝርዝር የለም</p>
      <p className="mt-1 text-sm text-text-primary/30">
        You haven&apos;t created any playlists yet.
      </p>
      <CreatePlaylistButton />
    </div>
  );
}

// ---------- Playlist Card ----------

function PlaylistCard({ playlist }: { playlist: PlaylistItem }) {
  const songCount = playlist.songs?.length ?? 0;

  return (
    <Link
      href={`/my/playlists/${playlist._id}`}
      className="block"
    >
      <div className="group rounded-xl border border-gold/20 bg-bg-mid p-5 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-black/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-gold group-hover:text-gold-light">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="mt-1 line-clamp-2 text-sm text-text-primary/60">
                {playlist.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 text-xs text-text-primary/40">
              <FiMusic size="14" aria-hidden="true" />
              <span>
                {songCount} song{songCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <FiChevronRight
            size="20"
            className="mt-1 shrink-0 text-text-primary/30 transition-colors group-hover:text-gold"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

// ---------- Page ----------

export const dynamic = "force-dynamic";

export default async function PlaylistsPage() {
  const user = await requireAuth();
  await dbConnect();
  const userPlaylists = await Playlist.find({ owner: (user as any).id })
    .populate("songs", "titleAm titleEn slug")
    .sort({ updatedAt: -1 })
    .lean();
  const playlists = (userPlaylists || []) as unknown as PlaylistItem[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gold">የመዝሙር ዝርዝሮች</h1>
          <p className="mt-1 text-sm text-text-primary/50">My Playlists</p>
        </div>
        <CreatePlaylistButton />
      </div>

      {playlists.length > 0 ? (
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
