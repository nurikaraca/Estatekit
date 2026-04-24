const Features = () => {
  const features = [
    {
      title: "Advanced Property Search",
      desc: "Find properties easily with filters, location and price range.",
    },
    {
      title: "Real-Time Listings",
      desc: "Always up-to-date listings with real-time updates.",
    },
    {
      title: "User Dashboard",
      desc: "Manage your listings, favorites and profile.",
    },
    {
      title: "Analytics & Insights",
      desc: "Track performance and understand your market better.",
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold">
          Everything you need to manage properties
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Powerful tools designed to help you buy, sell and manage real estate.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border hover:shadow-xl transition"
            >
              <div className="mb-4 text-3xl">🏠</div>

              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-gray-600 text-sm">
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default Features