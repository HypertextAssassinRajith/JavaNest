"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/lib/cartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link
          href="/#products"
          className="rounded-lg border cursor-pointer border-white px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-white hover:text-black"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 md:px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Cart</h1>
          <button
            onClick={clear}
            className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition"
          >
            Clear cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="h-20 w-20 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center">
                  {i.imageUrl && i.imageUrl !== "/" ? (
                    <Image src={i.imageUrl} alt={i.name} width={80} height={80} className="object-contain" />
                  ) : (
                    <div className="text-xs text-white/60">No image</div>
                  )}
                </div>
                <div>
                  <div className="text-xl font-semibold">{i.name}</div>
                  <div className="text-sm text-white/70">Rs {i.price.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-white/80">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.id, parseInt(e.target.value, 10) || 1)}
                  className="w-20 p-2 rounded bg-transparent border border-white/20 text-white"
                />
                <button
                  onClick={() => removeItem(i.id)}
                  className="rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-white/10 pt-6">
          <div className="text-2xl font-bold">
            Total: <span className="text-white">Rs {total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="rounded-lg bg-white text-black px-6 py-3 text-lg font-semibold shadow-md transition duration-300 hover:bg-gray-200 text-center"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
