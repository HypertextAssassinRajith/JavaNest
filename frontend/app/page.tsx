"use client";

import { Header } from "@/app/components/header";
import { Welcome } from "@/app/pages/welcome";
import { About } from "@/app/pages/about";
import ProductPage from "./product/page";



export default function Home() {
  return (
    <>
      <Header />
      <Welcome />
      <ProductPage />
      <About />
    </>
  );
}
