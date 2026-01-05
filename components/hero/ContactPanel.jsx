import { contactDetails } from "@/data/data";

function ContactPanel() {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
              Reach Out
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Get in touch
            </h2>
            <p className="mt-4 text-slate-600">
              Share your thoughts, invite us to community forums, or request
              constituency services. We respond within 24 hours on business
              days.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-500">
              {contactDetails.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <div>
                {contactDetails.phone.map((phone) => (
                  <p key={phone}>📱 {phone}</p>
                ))}
              </div>
              <div>
                {contactDetails.email.map((email) => (
                  <p key={email}>✉️ {email}</p>
                ))}
              </div>
            </div>
          </div>

          <form className="rounded-3xl bg-white p-8 shadow-lg space-y-4">
            <div>
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="contact-name"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="contact-email"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label
                className="text-sm font-medium text-slate-600"
                htmlFor="contact-message"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows="4"
                placeholder="How can we help?"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPanel;
