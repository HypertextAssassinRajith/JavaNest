"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CoffeeCard } from "@/app/components/coffeeCard";
import { useCartStore } from "@/app/lib/cartStore";

type Product = {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  price: number | string;
  imageUrl?: string;
  images?: string[];
  bgColor?: string;
};

function toNumber(v: number | string) {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const palette = useMemo(
    () => ["bg-[#9C6B44]", "bg-[#6F7D5F]", "bg-[#2D241F]", "bg-[#8B5A2B]"],
    []
  );

  const dummyProducts: Product[] = useMemo(
    () => [
      {
        id: "dummy-espresso",
        name: "Espresso",
        price: 2.5,
        imageUrl: "/images/coffee-cup.png",
        bgColor: palette[2],
      },
      {
        id: "dummy-cappuccino",
        name: "Cappuccino",
        price: 4.2,
        imageUrl: "/images/coffee-cup.png",
        bgColor: palette[0],
      },
      {
        id: "dummy-latte",
        name: "Cafe Latte",
        price: 3.15,
        imageUrl: "/images/coffee-cup.png",
        bgColor: palette[1],
      },
      {
        id: "dummy-mocha",
        name: "Mocha",
        price: 4.75,
        imageUrl: "/images/coffee-cup.png",
        bgColor: palette[3],
      },
    ],
    [palette]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${apiBase}/products`, { headers: { Accept: "application/json" } })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data.length ? data : dummyProducts);
      })
      .catch((e) => {
        console.error("Error fetching products:", e);
        // show dummy items
        setProducts(dummyProducts);
      })
      .finally(() => setLoading(false));
  }, [apiBase, dummyProducts]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="flex flex-col text-white text-center justify-center py-12 px-6 rounded-lg">
        <h1 className="text-4xl font-bold">Shop</h1>
        <div className="w-12 h-1 bg-white mx-auto mt-2" />
        <p className="mt-4 text-lg text-center w-full md:w-3/5 mx-auto text-gray-200">
          Order your favorite coffee online. Add items to your cart and checkout.
        </p>
      </section>

      {loading && <p className="text-center text-white">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="flex flex-col justify-center gap-6 p-6 lg:flex-row lg:flex-wrap">
        {products.map((p, index) => {
          const id = p.id || p._id || `${index}`;
          const name = p.name || p.title || "Coffee";
          const priceNum = toNumber(p.price);
          const imageUrl =
            p.imageUrl || (Array.isArray(p.images) ? p.images[0] : undefined) || "/";
          const bgColor = p.bgColor || palette[index % palette.length];

          return (
            <CoffeeCard
              key={id}
              name={name}
              price={priceNum.toFixed(2)}
              imageUrl={imageUrl}
              bgColor={bgColor}
              actionLabel="Add to Cart"
              onAction={(qty) =>
                addItem(
                  {
                    id,
                    name,
                    price: priceNum,
                    imageUrl,
                  },
                  qty
                )
              }
            />
          );
        })}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-200 w-full">No products available.</p>
        )}
      </div>
    </div>
  );
}
