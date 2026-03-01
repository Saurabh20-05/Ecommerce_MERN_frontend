export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-4 gap-12">

        <div>
          <h4 className="text-white font-bold mb-4">Klutch</h4>
          <p className="text-sm">
            Modern multi-vendor marketplace platform.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>Cart</li>
            <li>Orders</li>
            <li>Returns</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>FAQ</li>
            <li>Shipping Policy</li>
            <li>Return Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <p className="text-sm">support@klutch.com</p>
        </div>

      </div>

      <div className="text-center text-sm mt-12 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Klutch. All rights reserved.
      </div>
    </footer>
  );
}