export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-white text-xl font-bold">RealEstate</h3>
          <p className="mt-4 text-sm">
            Modern platform to buy, sell and rent properties.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>Buy</li>
            <li>Rent</li>
            <li>Sell</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-sm text-gray-500 mt-12">
        © {new Date().getFullYear()} RealEstate. All rights reserved.
      </div>
    </footer>
  )
}