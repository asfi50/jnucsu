export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-6xl sm:text-8xl font-bold mb-4 tracking-tight">
            JnU<span className="text-orange-500">CSU</span>
          </h1>
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-light">
            <span>🔥</span>
            <p>Something big is cooking... Stay tuned!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
