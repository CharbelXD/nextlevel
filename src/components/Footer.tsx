import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8">
                <Logo />
              </div>
              <span className="text-lg md:text-xl font-bold text-white">
                NEXT<span className="text-yellow-400">LEVEL</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm mb-4 leading-relaxed">
              Your journey to peak performance starts here. Join our community
              and transform your life.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/nextlevelleb"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/nextlevelleb"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
              
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
               
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#memberships" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-xs md:text-sm">
                  Memberships
                </a>
              </li>
              <li>
                <a href="#classes" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-xs md:text-sm">
                  Classes
                </a>
              </li>
              <li>
                <a href="#schedule" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-xs md:text-sm">
                  Schedule
                </a>
              </li>
              <li>
                <a href="#news" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-xs md:text-sm">
                  News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm md:text-base">Hours</h3>
            <ul className="space-y-1 md:space-y-2 text-gray-400 text-xs md:text-sm">
              <li>24/7 all days of the week!</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm md:text-base">Contact</h3>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span>Antelias - Lebanon</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span>03585572</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span>info@nextlevelgym.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-6 md:pt-8">
          <p className="text-center text-gray-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Nextlevel Gym. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
