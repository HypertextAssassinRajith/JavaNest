export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto pt-28 px-4 text-white" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <h1 className="text-4xl font-bold heading-font mb-10 text-center">About JavaNest</h1>
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
        <div className="flex-1 flex flex-col justify-center">
          <p className="leading-relaxed mb-4">
            JavaNest is dedicated to crafting memorable coffee experiences. We source
            high‑quality Arabica beans and roast them in small batches to bring out
            nuanced flavors and aromas.
          </p>
          <p className="leading-relaxed">
            This page is a placeholder for your project’s About content. Add team
            info, mission statement, or any story that adds authenticity.
          </p>
        </div>
        <div className="flex-1">
          <img
            src="/images/coffee-splash.png"
            alt="Coffee splash"
            className="w-full h-full object-cover rounded-lg opacity-70"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}