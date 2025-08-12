import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Search, Users, Award, Clock, ChevronRight, Star, ArrowRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Play, Download, Calendar, ShieldCheck, Newspaper, Cog } from 'lucide-react';

// import About from "../pages/About"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { href } from 'react-router-dom';
// Homepage Component
const Homepage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [showLibraryHours, setShowLibraryHours] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sudheer Prajapati",
      role: "Graduate Student",
      text: "Success Library transformed my research experience. The resources and environment are exceptional!",
      rating: 5,
      avatar: "SP"
    },
    {
      name: "Arpit Sharma",
      role: "Professional",
      text: "The perfect place for continuous learning. I've advanced my career significantly thanks to their programs.",
      rating: 5,
      avatar: "AS"
    },
    {
      name: "Mangesh Singh",
      role: "Professional",
      text: "An inspiring space that fuels creativity and knowledge. The staff is incredibly supportive.",
      rating: 5,
      avatar: "MS"
    },
    {
      name: "Sonu Prajapati",
      role: "SSC Aspirants",
      text: "An inspiring space that fuels creativity and knowledge. The staff is incredibly supportive.",
      rating: 4,
      avatar: "SP"
    }
  ];

  const stats = [
    // { icon: BookOpen, number: "50K+", label: "Books & Resources", color: "blue", bgColor: "bg-blue-500" },
    // { icon: Users, number: "15K+", label: "Active Members", color: "indigo", bgColor: "bg-indigo-500" },
    // { icon: Award, number: "200+", label: "Programs Offered", color: "sky", bgColor: "bg-sky-500" },
    // { icon: Clock, number: "24/7", label: "Digital Access", color: "cyan", bgColor: "bg-cyan-500" },
    { icon: BookOpen, number: "100+", label: "Seats Available", color: "blue", bgColor: "bg-blue-500" },
    { icon: Users, number: "80+", label: "Daily Visitors", color: "indigo", bgColor: "bg-indigo-500" },
    { icon: Clock, number: "24/6", label: "Open Hours", color: "cyan", bgColor: "bg-cyan-500" },
    { icon: ShieldCheck, number: "100%", label: "CCTV Secured", color: "sky", bgColor: "bg-sky-500" }


  ];

  const services = [
    // {
    //   title: "Digital Library",
    //   description: "Access thousands of e-books, journals, and digital resources from anywhere, anytime with our advanced search system.",
    //   icon: BookOpen,
    //   gradient: "from-blue-400 to-blue-600",
    //   bgColor: "bg-blue-50",
    //   hoverBg: "hover:bg-blue-100",
    //   shadowColor: "hover:shadow-blue-200"
    // },
    // {
    //   title: "Study Spaces",
    //   description: "Modern, comfortable study areas designed for productivity and collaboration with state-of-the-art facilities.",
    //   icon: Users,
    //   gradient: "from-indigo-400 to-indigo-600",
    //   bgColor: "bg-indigo-50",
    //   hoverBg: "hover:bg-indigo-100",
    //   shadowColor: "hover:shadow-indigo-200"
    // },
    // {
    //   title: "Research Support",
    //   description: "Expert librarians ready to assist with your research projects and provide personalized academic guidance.",
    //   icon: Search,
    //   gradient: "from-sky-400 to-sky-600",
    //   bgColor: "bg-sky-50",
    //   hoverBg: "hover:bg-sky-100",
    //   shadowColor: "hover:shadow-sky-200"
    // },
    // {
    //   title: "Workshops & Events",
    //   description: "Regular educational programs, author talks, and skill-building workshops to enhance your learning journey.",
    //   icon: Calendar,
    //   gradient: "from-cyan-400 to-cyan-600",
    //   bgColor: "bg-cyan-50",
    //   hoverBg: "hover:bg-cyan-100",
    //   shadowColor: "hover:shadow-cyan-200"
    // },
    {
      title: "Bring Your Own Books",
      description: "Study your way. Just bring your books and grab a dedicated seat in our quiet, focused environment.",
      icon: BookOpen,
      gradient: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      shadowColor: "hover:shadow-blue-200"
    },
    {
      title: "Comfortable Study Spaces",
      description: "Enjoy fully air-conditioned seating, clean surroundings, and uninterrupted focus — day or night.",
      icon: Users,
      gradient: "from-indigo-400 to-indigo-600",
      bgColor: "bg-indigo-50",
      hoverBg: "hover:bg-indigo-100",
      shadowColor: "hover:shadow-indigo-200"
    },
    {
      title: "24/6 Access & Security",
      description: "Study anytime with 24/6 availability, CCTV monitoring, and a peaceful, secure environment.",
      icon: Clock,
      gradient: "from-sky-400 to-sky-600",
      bgColor: "bg-sky-50",
      hoverBg: "hover:bg-sky-100",
      shadowColor: "hover:shadow-sky-200"
    },
    {
      title: "Student Amenities",
      description: "Stay refreshed with RO hot/cold water, daily newspapers, and popular magazines — all included.",
      icon: Newspaper,
      gradient: "from-cyan-400 to-cyan-600",
      bgColor: "bg-cyan-50",
      hoverBg: "hover:bg-cyan-100",
      shadowColor: "hover:shadow-cyan-200"
    }
  ];

  // const quickActions = [
  //   { icon: Search, label: "Search Catalog", hoverColor: "hover:bg-blue-50", iconColor: "text-blue-600", shadowColor: "hover:shadow-blue-200" },
  //   { icon: Download, label: "Digital Resources", hoverColor: "hover:bg-indigo-50", iconColor: "text-indigo-600", shadowColor: "hover:shadow-indigo-200" },
  //   { icon: Calendar, label: "Book Events", hoverColor: "hover:bg-sky-50", iconColor: "text-sky-600", shadowColor: "hover:shadow-sky-200" },
  //   { icon: Play, label: "Virtual Tours", hoverColor: "hover:bg-cyan-50", iconColor: "text-cyan-600", shadowColor: "hover:shadow-cyan-200" }
  // ];
  const quickActions = [
    // {
    //   icon: Calendar,
    //   label: "Book a Seat",
    //   hoverColor: "hover:bg-blue-50",
    //   iconColor: "text-blue-600",
    //   shadowColor: "hover:shadow-blue-200"
    // },
    {
      icon: Clock,
      label: "Check Timings",
      hoverColor: "hover:bg-indigo-50",
      iconColor: "text-indigo-600",
      shadowColor: "hover:shadow-indigo-200"
    },
    {
      icon: MapPin,
      label: "Find Us",
      hoverColor: "hover:bg-sky-50",
      iconColor: "text-sky-600",
      shadowColor: "hover:shadow-sky-200"
    },
    {
      icon: Phone,
      label: "Contact Us",
      hoverColor: "hover:bg-cyan-50",
      iconColor: "text-cyan-600",
      shadowColor: "hover:shadow-cyan-200",
      link: "tel:+916392091959"
    }
  ];


  return (
    <main className="pt-20">
      {/* Professional geometric background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-60 right-40 w-24 h-24 bg-indigo-200 rounded-lg rotate-45 animate-bounce opacity-50"></div>
        <div className="absolute bottom-40 left-60 w-28 h-28 bg-sky-200 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-cyan-200 rounded-lg rotate-12 animate-bounce opacity-50"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 mt-6">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer group">
              <Star className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Trusted by 150+ Students
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hover:from-gray-700 hover:to-gray-500 transition-all duration-300 cursor-default">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:via-indigo-700 hover:to-blue-900 transition-all duration-300 cursor-default animate-pulse">
                Success Library
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
              {/* Discover unlimited knowledge, cutting-edge resources, and inspiring learning spaces. 
              Transform your academic journey with our comprehensive  physical library services. */}
              <b>A dedicated space for serious learners.</b><br />At Success Library, bring your own books and enjoy round-the-clock access to a quiet, well-equipped environment designed to support your academic journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-200 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 flex items-center space-x-3 hover:from-blue-600 hover:to-indigo-700 active:scale-95"
              href="/about"
            >
              <span>About Library</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
            </a>
            <a className="group border-2 border-blue-300 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 flex items-center space-x-3 hover:scale-105 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
            href='/services'
            >
              <Cog className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              <span >Services</span>
            </a>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`bg-white p-4 rounded-xl shadow-md hover:shadow-xl ${action.shadowColor} ${action.hoverColor} transition-all duration-300 hover:scale-105 hover:-translate-y-2 group border border-gray-100 hover:border-gray-200 active:scale-95`
                }
                onClick={() => {
                  if (action.icon === Phone) {
                    window.location.href = action.link
                  } else if (action.icon === MapPin) {
                    window.open("https://maps.app.goo.gl/M4FeJXhuLQPiPq1A9?g_st=ac", "_blank");
                  } else if (action.icon === Clock) {
                    // console.log(action.icon);       
                    setShowLibraryHours(true);
                  }
                }}
              >
                <action.icon className={`w-6 h-6 ${action.iconColor} mx-auto mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`} />
                <div className={`text-sm font-medium text-gray-700 group-hover:${action.iconColor} transition-colors duration-300`}>
                  {action.label}
                </div>

              </button>
            ))}
          </div>

          {/* {showLibraryHours && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30 animate-fadeIn">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 border border-gray-100 hover:border-indigo-200 group cursor-pointer flex flex-col justify-center relative animate-scaleIn">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                  onClick={() => setShowLibraryHours(false)}
                >
                  ✕
                </button>

                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                    Library Hours
                  </h3>
                </div>

                <div className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  <div className="flex justify-between hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                    <span>Monday - Saturday</span>
                    <span className="font-semibold">5:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between text-red-600 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Digital Services</span>
                      <span>24/7 Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {showLibraryHours && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{
      backdropFilter: "blur(6px)",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      animation: "fadeIn 0.4s ease-out"
    }}
  >
    <div
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 border border-gray-100 hover:border-indigo-200 group cursor-pointer flex flex-col justify-center relative"
      style={{
        animation: "scaleIn 0.3s ease-out"
      }}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
        onClick={() => setShowLibraryHours(false)}
      >
        ✕
      </button>

      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
          Library Hours
        </h3>
      </div>

      <div className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
        <div className="flex justify-between hover:text-blue-600 transition-colors duration-300 cursor-pointer">
          <span>Monday - Saturday</span>
          <span className="font-semibold">5:00 AM - 11:00 PM</span>
        </div>
        <div className="flex justify-between text-red-600 hover:text-red-400 transition-colors duration-300 cursor-pointer">
          <span>Sunday</span>
          <span className="font-semibold">Closed</span>
        </div>
        <div className="border-t pt-3 mt-4">
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Digital Services</span>
            <span>24/7 Available</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-110 transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 ${stat.bgColor} rounded-2xl mb-4 group-hover:rotate-12 group-hover:shadow-xl hover:shadow-${stat.color}-200 transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium group-hover:text-blue-500 transition-colors duration-300">
                  {stat.label}
                </div>
                {hoveredStat === index && (
                  <div className="absolute inset-0  border-blue-300 rounded-2xl animate-pulse pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <Award className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Premium Services
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent hover:from-gray-700 hover:to-blue-700 transition-all duration-300">
                Our Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
              Comprehensive services designed to support your learning journey and unlock your full potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative ${service.bgColor} ${service.hoverBg} rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:shadow-2xl ${service.shadowColor} cursor-pointer border border-gray-100 hover:border-gray-200`}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                    <service.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>

                  {/* <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-all duration-300 hover:scale-105">
                    <span>Learn more</span>
                    <ChevronRight className="w-5 h-5 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
                  </button> */}
                </div>

                {hoveredService === index && (
                  <div className="absolute inset-0 border-2 border-blue-300 rounded-2xl animate-pulse pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center bg-white text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Users className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Member Stories
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-20 hover:scale-105 transition-transform duration-300 cursor-default">
            <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent hover:from-gray-700 hover:to-blue-700 transition-all duration-300">
              What Our Members Say
            </span>
          </h2>

          <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-blue-100 hover:border-blue-200 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {testimonials[currentTestimonial].avatar}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current hover:scale-125 transition-transform duration-200 cursor-pointer"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl text-gray-700 mb-8 leading-relaxed font-medium italic group-hover:text-gray-800 transition-colors duration-300">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="group-hover:scale-105 transition-transform duration-300">
                <div className="font-bold text-blue-600 text-xl mb-1 group-hover:text-blue-700 transition-colors duration-300">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 active:scale-90 ${index === currentTestimonial
                    ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-200'
                    : 'bg-gray-300 hover:bg-blue-300 hover:shadow-md'
                  }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};



// Main App Component
const SuccessLibrary = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <Homepage />
      <Footer />
      {/* <About /> */}
    </div>
  );
};

export default SuccessLibrary;