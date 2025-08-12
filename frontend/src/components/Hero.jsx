export default function Hero() {
  return (
    <section className="relative pt-16"> 
      <div className="relative flex flex-col lg:flex-row h-screen">
        {/* Left Beans */}
        <div className="relative w-full lg:w-3/5">
          <img
            src="/images/coffee-beans.jpg"
            alt="Coffee beans"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1px]" />
          <div className="relative z-10 max-w-xl px-6 md:px-12 lg:px-16 py-20 text-neutral-content flex flex-col justify-center h-full">
            <p className="text-xs tracking-[0.25em] uppercase mb-4 opacity-80">
              Welcome to JavaNest
            </p>
            <h1 className="heading-font text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
              Enjoy Your Morning<br className="hidden sm:block" /> Coffee Shot
            </h1>
            <p className="text-sm md:text-base mb-10 max-w-md text-gray-200">
              Start your day with fresh coffee made with 100% Arabica beans.
              Indulge in rich flavors and aromas that awaken your senses.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/book-table" className="btn btn-primary btn-wide">
                Book a Table
              </a>
              <a href="#shop" className="btn btn-outline btn-wide">
                Visit Our Shop
              </a>
            </div>
          </div>
        </div>
        {/* Right Cup */}
        <div className="hidden lg:flex w-2/5 bg-neutral-900 items-center justify-center relative overflow-hidden">
          <img
            src="/images/coffee-cup.png"
            alt="Coffee Cup"
            className="w-98 max-w-[100%] drop-shadow-2xl animate-fadein-slow"
            loading="lazy"
          />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}