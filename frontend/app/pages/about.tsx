import React from "react";
import CoffeeSplash from "@/app/assets/coffee-splash.png";
import Image from "next/image";

export function About() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 mt-10 lg:mt-0 bg-[#0A0A0A]">
      <div className="text-center mb-10">
        <h3 className="text-sm md:text-base font-semibold tracking-[0.25em] text-[#a57242]">
          ABOUT US
        </h3>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
          Serving Since <span className="text-[#8B5A2B]">1950</span>
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          A coffee-first experience built on quality beans, careful roasting, and warm hospitality.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center max-w-6xl w-full gap-10">
        <div className="md:w-1/2 text-left">
          <h3 className="text-2xl font-bold text-white">
            Our <span className="text-[#a57242]">Story</span>
          </h3>
          <p className="text-white/80 mt-4 leading-relaxed">
            JavaNest started with one goal: make specialty coffee approachable. We source high-quality
            beans and focus on consistency so every cup tastes as good as the last.
          </p>
          <p className="text-white/70 mt-3 leading-relaxed">
            From classic espresso drinks to seasonal favorites, we blend tradition with modern craft.
            Whether you dine in, take away, or order online—your coffee is made with care.
          </p>
          <button className="rounded-lg border cursor-pointer border-white/60 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-white hover:text-black mt-6">
            Learn More
          </button>
        </div>

        <div className="md:w-1/3 flex justify-center my-2">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[#8B5A2B]/15 blur-2xl" />
            <Image
              width={500}
              height={500}
              src={CoffeeSplash}
              alt="Coffee Splash"
              className="relative drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="md:w-1/2 text-left">
          <h3 className="text-2xl font-bold text-white">
            Our <span className="text-[#a57242]">Vision</span>
          </h3>
          <p className="text-white/80 mt-4 leading-relaxed">
            To deliver a premium coffee experience—online and in-store—while staying true to our
            roots: friendly service, great beans, and a cozy atmosphere.
          </p>
          <ul className="mt-4 space-y-2 text-white/75">
            <li className="flex gap-2">
              <span className="text-[#a57242]">✔</span> Freshly prepared drinks, every time
            </li>
            <li className="flex gap-2">
              <span className="text-[#a57242]">✔</span> Quality ingredients and sustainable sourcing
            </li>
            <li className="flex gap-2">
              <span className="text-[#a57242]">✔</span> Fast online ordering with smooth pickup/delivery
            </li>
          </ul>
          <button className="rounded-lg cursor-pointer bg-[#8B5A2B] px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 hover:bg-[#a57242] mt-6">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}


