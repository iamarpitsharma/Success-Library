
// Footer Component
import { useState } from "react";
import { BookOpen, ChevronRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialLinks = [
    // { Icon: Facebook, color: "hover:bg-blue-600", name: "Facebook" },
    // { Icon: Twitter, color: "hover:bg-sky-500", name: "Twitter" },
    { Icon: Instagram, color: "hover:bg-pink-600", name: "Instagram", link: `https://www.instagram.com/suc_cess_library?igsh=MTA0ODF1ZGE0eGF5Ng==` },
    // { Icon: Linkedin, color: "hover:bg-blue-700", name: "LinkedIn" }
  ];

  const quickLinks = ['About Us', 'Services', 'Contact Us'];

  const contactInfo = [
    {
      icon: MapPin,
      text: "Near Amrawati Computer Center\n Bindrabazar Azamgarh 276205",
      hoverColor: "group-hover:text-blue-400"
    },
    {
      icon: Phone,
      text: "+91 63920 91959",
      hoverColor: "group-hover:text-green-400"
    },
    {
      icon: Mail,
      text: "successlibrary@gmail.com",
      hoverColor: "group-hover:text-yellow-400"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-indigo-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-sky-500 rounded-full opacity-10 animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <a className="flex items-center space-x-3 mb-6 group cursor-pointer"
            href="/">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-blue-400">
                
                <BookOpen className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="group-hover:translate-x-1 transition-transform duration-300">
                <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  Success Library
                </span>
                <div className="text-sm text-gray-400 group-hover:text-blue-300 transition-colors duration-300">
                  Your Gateway to Knowledge
                </div>
              </div>
            </a>
            
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed hover:text-gray-200 transition-colors duration-300">
              Empowering minds through knowledge and fostering success through comprehensive resources, 
              cutting-edge technology, and exceptional service that transforms learning experiences.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, color, name, link }, index) => (
                <a
                  key={index}
                  className={`w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center ${color} transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group relative cursor-pointer`}
                  href={link}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  title={name}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {hoveredSocial === index && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in">
                      {name}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center group hover:text-blue-400 transition-colors duration-300">
              <ChevronRight className="w-5 h-5 text-blue-400 mr-2 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item, index) => (
                <li key={item}>
                  <a 

                    href={`${item.split(' ')[0].toLowerCase()}`} 
                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-2 inline-block hover:scale-105 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="relative">
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center group hover:text-blue-400 transition-colors duration-300">
              <Phone className="w-5 h-5 text-blue-400 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              Contact Us
            </h3>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div 
                  key={index}
                  // className={`flex items-start space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 group cursor-pointer hover:duration-300 transform-x-3`}
                  className={`flex items-start space-x-3 text-gray-300 hover:text-blue-400 transition-all duration-300 group cursor-pointer hover:translate-x-1`}

                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <contact.icon className={`w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 ${index === 0 ? 'group-hover:bounce' : index === 1 ? 'group-hover:rotate-12' : 'group-hover:scale-110'} transition-all duration-300`} />
                  <span className="group-hover:scale-105 transition-transform duration-300">
                    {contact.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center hover:border-gray-700 transition-colors duration-300">
          <p className="text-gray-400 hover:text-gray-300  duration-300 hover:scale-105 transition-transform cursor-default">
            © 2025 Success Library. All rights reserved. Developed with dedication to knowledge and achievement by Arpit Sharma,
            <a href="https://www.amrawaticomputer.org/"><b className="hover:underline">Amrawati Computer Center</b>.</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer