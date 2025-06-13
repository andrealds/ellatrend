import { Link } from "wouter";
import { Microchip, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Microchip className="h-6 w-6 text-primary mr-2" />
              <span className="text-2xl font-bold">TecReview</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted source for technology reviews, comparisons, and deals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Content Links */}
          <div>
            <h3 className="font-semibold mb-4">Content</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/category/comparatives">
                  <span className="hover:text-white transition-colors cursor-pointer">Comparatives</span>
                </Link>
              </li>
              <li>
                <Link to="/category/reviews">
                  <span className="hover:text-white transition-colors cursor-pointer">Reviews</span>
                </Link>
              </li>
              <li>
                <Link to="/deals">
                  <span className="hover:text-white transition-colors cursor-pointer">Deals</span>
                </Link>
              </li>
              <li>
                <Link to="/category/news">
                  <span className="hover:text-white transition-colors cursor-pointer">News</span>
                </Link>
              </li>
              <li>
                <Link to="/guides">
                  <span className="hover:text-white transition-colors cursor-pointer">Buying Guides</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Category Links */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/category/smartphones">
                  <span className="hover:text-white transition-colors cursor-pointer">Smartphones</span>
                </Link>
              </li>
              <li>
                <Link to="/category/laptops">
                  <span className="hover:text-white transition-colors cursor-pointer">Laptops</span>
                </Link>
              </li>
              <li>
                <Link to="/category/gaming">
                  <span className="hover:text-white transition-colors cursor-pointer">Gaming</span>
                </Link>
              </li>
              <li>
                <Link to="/category/tvs">
                  <span className="hover:text-white transition-colors cursor-pointer">TVs</span>
                </Link>
              </li>
              <li>
                <Link to="/category/audio">
                  <span className="hover:text-white transition-colors cursor-pointer">Audio</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/contact">
                  <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <span className="hover:text-white transition-colors cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy">
                  <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <span className="hover:text-white transition-colors cursor-pointer">Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link to="/disclosure">
                  <span className="hover:text-white transition-colors cursor-pointer">Affiliate Disclosure</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TecReview. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for tech enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
