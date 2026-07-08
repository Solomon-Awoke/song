export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን
        </h1>
        <p className="max-w-md text-lg text-gold-light sm:text-xl">
          መንፈሳዊ መዝሙራት
        </p>
        <p className="text-sm text-text-primary/60">
          Ethiopian Orthodox Tewahedo Spiritual Songs
        </p>
        <a
          className="rounded-full border border-solid border-gold/30 bg-bg-mid px-6 py-2 text-sm text-gold transition-colors hover:bg-bg-accent hover:text-gold-light"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Started
        </a>
      </main>
    </div>
  );
}
