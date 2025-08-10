export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <h1 className="text-4xl font-bold heading-font mb-6">Contact Us</h1>
      <p className="opacity-80 mb-8">
        Have questions? Reach out via the form below (placeholder) or add your
        real contact channels.
      </p>
      <form className="space-y-4 max-w-xl">
        <input className="input input-bordered w-full" placeholder="Name" />
        <input className="input input-bordered w-full" placeholder="Email" />
        <textarea className="textarea textarea-bordered w-full h-32" placeholder="Message" />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}