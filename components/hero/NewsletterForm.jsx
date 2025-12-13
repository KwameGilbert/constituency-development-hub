function NewsletterForm() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-100 bg-slate-50 p-10 shadow-sm">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
              Stay Updated
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Join our newsletter
            </h2>
            <p className="mt-4 text-sm text-slate-500">
              Receive curated updates on constituency developments, policy
              briefs, and volunteer actions.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
          <form className="space-y-4">
            <label
              className="text-sm font-medium text-slate-600"
              htmlFor="newsletter-email"
            >
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
            <button
              type="button"
              className="w-full rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewsletterForm;
