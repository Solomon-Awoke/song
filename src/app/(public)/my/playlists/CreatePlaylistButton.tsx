"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import CreatePlaylistDialog from "@/components/playlist/CreatePlaylistDialog";

export default function CreatePlaylistButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-bg-deep transition-all hover:bg-gold-mid"
      >
        <FiPlus size="16" aria-hidden="true" />
        Create Playlist
      </button>
      <CreatePlaylistDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          // Trigger a router refresh to show the new playlist
          window.location.reload();
        }}
      />
    </>
  );
}
