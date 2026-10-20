export default function LoadingDetail() {
  return (
    <div className="grid gap-8 py-8 md:grid-cols-2 md:py-12 animate-pulse">
      {/* Skeleton Gambar Produk */}
      <div className="aspect-square w-full rounded-2xl border border-garis bg-permukaan" />

      {/* Skeleton Informasi Produk */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-28 rounded bg-permukaan" />
        <div className="h-3 w-20 rounded bg-permukaan" />
        <div className="h-9 w-3/4 rounded-lg bg-permukaan" />
        <div className="h-8 w-32 rounded-md bg-permukaan" />
        <div className="flex flex-col gap-2 pt-2">
          <div className="h-4 w-full rounded bg-permukaan" />
          <div className="h-4 w-5/6 rounded bg-permukaan" />
          <div className="h-4 w-2/3 rounded bg-permukaan" />
        </div>
        <div className="h-12 w-full rounded-lg bg-permukaan sm:w-48 mt-4" />
      </div>
    </div>
  );
}
