import { preloadAllSongs } from "@/lib/song-preloader";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const songs = await preloadAllSongs();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-gold">ፍለጋ</h1>
      <p className="mb-8 text-text-primary/70">Search / ፍለጋ</p>
      <SearchClient songs={songs} />
    </div>
  );
}
