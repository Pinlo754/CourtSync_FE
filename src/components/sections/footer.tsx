export default function Footer() {
  return (
    <footer className="bg-gray-600 text-white h-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>
              &copy; {new Date().getFullYear()} Your Company Name. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-400">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
