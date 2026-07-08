import SongForm from '../../_components/SongForm';

export const dynamic = 'force-dynamic';

export default function NewSongPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Add New Song</h2>
        <p className="mt-1 text-sm text-text-primary/50">
          Create a new spiritual song entry
        </p>
      </div>

      <div className="max-w-3xl rounded-xl border border-gold/10 bg-bg-mid p-6">
        <SongForm mode="create" />
      </div>
    </div>
  );
}
