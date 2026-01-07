"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useCartStore } from "@/app/lib/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ orderId: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    note: "",
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const payload = useMemo(
    () => ({
      items: items.map((i) => ({ productId: Number(i.id), qty: i.qty })),
      customer: {
        name: form.name,
        contact: form.contact,
        address: form.address,
        note: form.note,
      },
    }),
    [items, form]
  );

  async function placeOrder() {
    setError(null);

    if (!form.name.trim() || !form.contact.trim() || !form.address.trim()) {
      setError("Please fill Name, Contact and Address.");
      return;
    }

    if (payload.items.some((it) => !Number.isFinite(it.productId))) {
      setError("Cart contains invalid product. Please clear cart and add items again.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${apiBase}/orders`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const orderId = res.data?.order?._id || res.data?.order?.id || res.data?.id || "";

      // Simulated payment
      if (orderId) {
        await axios.post(`${apiBase}/orders/${orderId}/pay`, null, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
      }

      clear();
      setSuccess({ orderId });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-3xl font-bold">No items in cart</h1>
        <Link
          href="/product"
          className="rounded-lg border cursor-pointer border-white px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-white hover:text-black"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-3xl font-bold">Order placed</h1>
        <p className="text-white/80">Payment simulated. Thank you.</p>
        {success.orderId && <p className="text-white/60 text-sm">Order ID: {success.orderId}</p>}
        <Link
          href="/product"
          className="rounded-lg bg-white text-black px-6 py-3 text-lg font-semibold shadow-md transition duration-300 hover:bg-gray-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 md:px-10 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>
        <p className="text-white/70">
          Please review your order and enter delivery details below to complete checkout.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm text-white/80 mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Contact (Phone) *</label>
              <input
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                className="w-full rounded-lg bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white/50"
                placeholder="07X XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Address *</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full rounded-lg bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white/50 min-h-[96px]"
                placeholder="House No, Street, City"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1">Special Note</label>
              <textarea
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full rounded-lg bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white/50 min-h-[80px]"
                placeholder="e.g., no sugar, call when arrived"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-white/80">Total</span>
            <span className="text-2xl font-bold">Rs {total.toFixed(2)}</span>
          </div>

          {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="cursor-pointer mt-6 w-full rounded-lg bg-white py-3 text-black font-semibold hover:bg-gray-200 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>

          <Link
            href="/cart"
            className="block text-center mt-3 w-full rounded-lg border border-white/60 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-white hover:text-black"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
