export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-bg-deep">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-text-primary/60">
          የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን
        </p>
        <p className="text-sm text-text-primary/40">
          Built with{' '}
          <span aria-label="prayer" role="img">
            🙏
          </span>
        </p>
        <p className="text-xs text-text-primary/30">v0.1.0</p>
      </div>
    </footer>
  );
}
