import { useEffect, useState } from "react";
import { BookOpen, Menu, X, ArrowRight} from 'lucide-react';
// Navbar Component
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'About', 'Services','Contact'];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-blue-100' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a className="flex items-center space-x-3 group cursor-pointer" href="/">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-blue-200 group-hover:shadow-xl">
                <BookOpen className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-blue-400 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                Success Library
              </span>
              <div className="text-xs text-gray-500 font-medium group-hover:text-blue-600 transition-colors duration-300">
                Your Gateway to Knowledge
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={`${item.toLowerCase()}`}
                className="relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50 group font-medium hover:scale-105 hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="absolute inset-0 bg-blue-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </a>
            ))}
            {/* <button className="ml-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 active:scale-95">
              <span className="flex items-center space-x-2">
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button> */}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              {isMenuOpen ? (
                <X className="h-6 w-6 rotate-0 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-blue-100 animate-slide-down">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={`${item.toLowerCase()}`}
                className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-medium hover:translate-x-2 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
              </a>
            ))}
            {/* <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold mt-4 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
              Join Now
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar
