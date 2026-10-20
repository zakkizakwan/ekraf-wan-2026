export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-10 animate-pulse">
      {/* Skeleton Header Beranda */}
      <div className="flex flex-col gap-3">
        <div className="h-10 w-2/3 max-w-md rounded-xl bg-permukaan" />
        <div className="h-5 w-1/2 max-w-sm rounded-lg bg-permukaan" />
        <div className="h-4 w-1/4 max-w-xs rounded-md bg-permukaan" />
      </div>

      {/* Skeleton Filter & Cari */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-garis pt-6">
        <div className="h-6 w-32 rounded-lg bg-permukaan" />
        <div className="h-10 w-full sm:w-72 rounded-xl bg-permukaan" />
      </div>

      {/* Skeleton Grid Kartu Produk */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
          >
            <div className="aspect-square w-full bg-permukaan" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-16 rounded bg-permukaan" />
              <div className="h-5 w-3/4 rounded bg-permukaan" />
              <div className="mt-2 h-6 w-24 rounded bg-permukaan" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
