"use client";

import { useActionState } from "react";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";

export default function FormUbahProdukClient({ produk }) {
  const [state, formAction] = useActionState(ubahProduk, null);

  return (
    <>
      {state?.error && (
        <div className="max-w-xl rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
          {state.error}
        </div>
      )}

      <FormProduk
        produk={produk}
        action={formAction}
        labelTombol="Simpan perubahan"
        errors={state?.errors}
        values={state?.values}
      />
    </>
  );
}
