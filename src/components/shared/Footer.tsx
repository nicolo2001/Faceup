import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Mail, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Video className="h-7 w-7 text-indigo-400" />
              <span className="text-xl font-bold text-white">FaceUp</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Connecting content creators with professional actors to bring your videos to life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white">
                  Find Actors
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/become-actor" className="text-gray-400 hover:text-white">
                  Become an Actor
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-400 hover:text-white">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/copyright" className="text-gray-400 hover:text-white">
                  Copyright Policy
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} FaceUp. All rights reserved.
          </p>
          <div className="flex items-center">
            <a href="mailto:contact@faceup.com" className="text-sm text-gray-400 hover:text-white flex items-center">
              <Mail className="mr-2 h-4 w-4" /> contact@faceup.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;