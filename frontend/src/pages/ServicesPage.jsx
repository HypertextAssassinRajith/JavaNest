export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto pt-28 pb-20 px-4">
      <h1 className="text-4xl font-bold heading-font mb-8">Services</h1>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { title: 'Fresh Roasts', desc: 'Daily roasted beans for peak flavor.' },
          { title: 'Barista Training', desc: 'Learn espresso fundamentals & latte art.' },
          { title: 'Wholesale Supply', desc: 'Reliable bean supply for cafes & restaurants.' }
        ].map(s => (
          <div key={s.title} className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title text-lg">{s.title}</h2>
              <p className="text-sm opacity-70">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}