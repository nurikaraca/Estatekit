export default function Pricing() {
  return (
    <section className="py-20 ">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold">
          Simple, transparent pricing
        </h2>

        <p className="mt-4 text-gray-600">
          Choose the plan that fits your needs
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">

          {/* FREE */}
          <div className="p-8 rounded-2xl border bg-white dark:bg-gray-800">
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="mt-2 text-gray-600">For individuals</p>

            <p className="mt-6 text-4xl font-bold">$0</p>

            <ul className="mt-6 space-y-2 text-gray-600 text-sm">
              <li>✔ Basic property listing</li>
              <li>✔ Limited search</li>
              <li>✔ Email support</li>
            </ul>

            <button className="mt-6 w-full py-3 rounded-xl border">
              Get Started
            </button>
          </div>

          {/* PRO */}
          <div className="p-8 rounded-2xl bg-black text-white relative">

            <span className="absolute top-4 right-4 text-xs bg-white text-black px-2 py-1 rounded">
              Popular
            </span>

            <h3 className="text-xl font-semibold">Pro</h3>
            <p className="mt-2 text-gray-300">For professionals</p>

            <p className="mt-6 text-4xl font-bold">$29/mo</p>

            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              <li>✔ Unlimited listings</li>
              <li>✔ Advanced filters</li>
              <li>✔ Analytics dashboard</li>
              <li>✔ Priority support</li>
            </ul>

            <button className="mt-6 w-full py-3 rounded-xl bg-white text-black">
              Upgrade Now
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}