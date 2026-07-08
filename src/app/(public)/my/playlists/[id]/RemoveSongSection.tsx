"use client";

import { useRouter } from "next/navigation";
import RemoveSongButton from "@/components/playlist/RemoveSongButton";

interface RemoveSongSectionProps {
  playlistId: string;
  songId: string;
}

export default function RemoveSongSection({
  playlistId,
  songId,
}: RemoveSongSectionProps) {
  const router = useRouter();

  return (
    <RemoveSongButton
      playlistId={playlistId}
      songId={songId}
      onRemoved={() => {
        router.refresh();
      }}
    />
  );
}
