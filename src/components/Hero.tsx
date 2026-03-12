import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <nav className="relative z-20 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            <div className="relative">
              <Logo />
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-wider">
              NEXT<span className="text-yellow-400">LEVEL</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('memberships')}
              className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              Memberships
            </button>
            <button
              onClick={() => scrollToSection('classes')}
              className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              Classes
            </button>
            <button
              onClick={() => scrollToSection('schedule')}
              className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              Schedule
            </button>
            <button
              onClick={() => scrollToSection('news')}
              className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium"
            >
              News
            </button>
            <button className="bg-yellow-400 text-black px-6 py-2 font-bold hover:bg-yellow-500 transition-all duration-300 hover:scale-105">
              JOIN NOW
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg z-30">
            <div className="flex flex-col gap-4 p-6">
              <button
                onClick={() => scrollToSection('memberships')}
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium text-left"
              >
                Memberships
              </button>
              <button
                onClick={() => scrollToSection('classes')}
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium text-left"
              >
                Classes
              </button>
              <button
                onClick={() => scrollToSection('schedule')}
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium text-left"
              >
                Schedule
              </button>
              <button
                onClick={() => scrollToSection('news')}
                className="text-white hover:text-yellow-400 transition-colors duration-300 font-medium text-left"
              >
                News
              </button>
              <button className="bg-yellow-400 text-black px-4 md:px-6 py-2 font-bold hover:bg-yellow-500 transition-all duration-300 text-sm md:text-base">
                JOIN NOW
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            UNLEASH YOUR
            <span className="block text-yellow-400 mt-2">INNER STRENGTH</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
            Transform your body, elevate your mind, and join a community of champions.
            State-of-the-art facilities, expert trainers, and unlimited potential.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={() => scrollToSection('memberships')}
              className="bg-yellow-400 text-black px-6 md:px-8 py-2 md:py-4 font-bold text-sm md:text-lg hover:bg-yellow-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-400/50"
            >
              GET STARTED
            </button>
            <button
              onClick={() => scrollToSection('classes')}
              className="border-2 border-yellow-400 text-yellow-400 px-6 md:px-8 py-2 md:py-4 font-bold text-sm md:text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              VIEW CLASSES
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-24 max-w-2xl">
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">500+</div>
            <div className="text-gray-400 text-xs md:text-base">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">20+</div>
            <div className="text-gray-400 text-xs md:text-base">Classes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">15</div>
            <div className="text-gray-400 text-xs md:text-base">Trainers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
