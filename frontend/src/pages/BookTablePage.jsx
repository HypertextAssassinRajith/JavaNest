import { useState } from 'react';

export default function BookTablePage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="max-w-2xl mx-auto pt-28 pb-20 px-4">
      <h1 className="text-4xl font-bold heading-font mb-6">Book a Table</h1>
      {!submitted && (
        <form
          onSubmit={e => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="grid gap-4"
        >
          <input required className="input input-bordered w-full" placeholder="Name" />
          <input required type="email" className="input input-bordered w-full" placeholder="Email" />
          <input required type="date" className="input input-bordered w-full" />
          <input required type="time" className="input input-bordered w-full" />
          <input required type="number" min="1" className="input input-bordered w-full" placeholder="Guests" />
          <textarea className="textarea textarea-bordered w-full h-28" placeholder="Special requests" />
          <button className="btn btn-primary">Submit</button>
        </form>
      )}
      {submitted && (
        <div className="alert alert-success mt-4">
          <span>Reservation request submitted! (Simulated)</span>
        </div>
      )}
    </div>
  );
}