import React, { useState } from 'react';
import { BookOpen, Search, Users, Award, Clock, ChevronRight, Star, Play, Calendar } from 'lucide-react';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Service() {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);

  const serviceCategories = [
    // { name: "Digital Services", icon: Search, color: "blue" },
    // { name: "Physical Services", icon: BookOpen, color: "indigo" },
    // { name: "Educational Programs", icon: Award, color: "sky" },
    { name: "Other Services", icon: Users, color: "cyan" }
  ];

  const allServices = [
    // Digital Services
    // [
    //   {
    //     title: "Online Catalog Search",
    //     description: "Advanced search capabilities across our entire digital and physical collection with AI-powered recommendations.",
    //     features: ["Smart search filters", "Personalized recommendations", "Real-time availability", "Mobile access"],
    //     icon: Search,
    //     gradient: "from-blue-400 to-blue-600",
    //     price: "Free"
    //   },
    //   {
    //     title: "E-Book & E-Journal Access",
    //     description: "Unlimited access to thousands of digital books, academic journals, and research publications.",
    //     features: ["50,000+ e-books", "Academic databases", "Mobile reading apps", "Offline downloads"],
    //     icon: BookOpen,
    //     gradient: "from-blue-500 to-indigo-600",
    //     price: "Included"
    //   },
    //   {
    //     title: "Digital Archive",
    //     description: "Historical documents, rare manuscripts, and special collections digitized for easy access.",
    //     features: ["Historical documents", "Rare manuscripts", "Image galleries", "Virtual exhibitions"],
    //     icon: Calendar,
    //     gradient: "from-indigo-400 to-blue-600",
    //     price: "Premium"
    //   }
    // ],
    // Physical Services
    // [
    //   {
    //     title: "Book Lending",
    //     description: "Traditional book borrowing with extended loan periods and renewal options.",
    //     features: ["30-day loan period", "Online renewals", "Hold requests", "Interlibrary loans"],
    //     icon: BookOpen,
    //     gradient: "from-indigo-400 to-indigo-600",
    //     price: "Free"
    //   },
    //   {
    //     title: "Study Spaces",
    //     description: "Quiet study areas, group rooms, and collaborative workspaces for all learning styles.",
    //     features: ["Silent study zones", "Group study rooms", "24/7 access areas", "Computer stations"],
    //     icon: Users,
    //     gradient: "from-indigo-500 to-purple-600",
    //     price: "Free"
    //   },
    //   {
    //     title: "Equipment Rental",
    //     description: "Laptops, tablets, and specialized equipment available for short-term rental.",
    //     features: ["Laptops & tablets", "Audio equipment", "Projectors", "Recording devices"],
    //     icon: Play,
    //     gradient: "from-purple-400 to-indigo-600",
    //     price: "Rental fees apply"
    //   }
    // ],
    // Educational Programs
    // [
    //   {
    //     title: "Workshops & Seminars",
    //     description: "Regular educational sessions on research methods, digital literacy, and academic writing.",
    //     features: ["Research methodology", "Citation management", "Digital tools training", "Writing workshops"],
    //     icon: Award,
    //     gradient: "from-sky-400 to-sky-600",
    //     price: "Free"
    //   },
    //   {
    //     title: "Author Events",
    //     description: "Meet renowned authors, attend book launches, and participate in literary discussions.",
    //     features: ["Author readings", "Q&A sessions", "Book signings", "Literary discussions"],
    //     icon: Star,
    //     gradient: "from-sky-500 to-blue-600",
    //     price: "Free"
    //   },
    //   {
    //     title: "Skill Development",
    //     description: "Professional development courses and certification programs for career advancement.",
    //     features: ["Professional courses", "Certification programs", "Career counseling", "Industry partnerships"],
    //     icon: ChevronRight,
    //     gradient: "from-blue-400 to-sky-600",
    //     price: "Course fees apply"
    //   }
    // ],
    // Other Services (ONLY CCTV, expanded)
    [
      {
        title: "CCTV Installation & Maintenance",
        description: "Ensure the security of your library, study zones, and shared learning spaces with our professional CCTV installation and support services. We offer end-to-end surveillance solutions tailored for educational environments.",
        features: [
          "Custom CCTV planning & setup",
          "Indoor & outdoor camera coverage",
          "Remote live access & cloud storage",
          "24/7 monitoring capabilities",
          "Maintenance & repair support",
          "Mobile & desktop support",
          "Night vision and motion detection",
          "Affordable packages"
        ],
        icon: Users,
        gradient: "from-cyan-400 to-cyan-600",
        price: "Starts at ₹4999"
      },
    ]
  ];

  // [
  // {
  //   title: "Research Consultation",
  //   description: "One-on-one sessions with research specialists for personalized academic support.",
  //   features: ["Individual consultations", "Research planning", "Methodology guidance", "Source evaluation"],
  //   icon: Users,
  //   gradient: "from-cyan-400 to-cyan-600",
  //   price: "Free"
  // },
  // {
  //   title: "Research Consultation",
  //   description: "One-on-one sessions with research specialists for personalized academic support.",
  //   features: ["Individual consultations", "Research planning", "Methodology guidance", "Source evaluation"],
  //   icon: Users,
  //   gradient: "from-cyan-400 to-cyan-600",
  //   price: "Free"
  // },
  // {
  //   title: "Citation & Writing Support",
  //   description: "Expert assistance with academic writing, citation styles, and research documentation.",
  //   features: ["Citation management", "Writing assistance", "Style guides", "Plagiarism checking"],
  //   icon: Search,
  //   gradient: "from-cyan-500 to-sky-600",
  //   price: "Free"
  // },
  // {
  //   title: "Data Analysis Support",
  //   description: "Statistical consultation and software training for research data analysis.",
  //   features: ["Statistical consultation", "Software training", "Data visualization", "Research methods"],
  //   icon: Award,
  //   gradient: "from-sky-400 to-cyan-600",
  //   price: "Premium"
  // }
  // ]
  // ];

  return (
    <>
      <Navbar />

      <div className="pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <Award className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Comprehensive Services
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:via-indigo-700 hover:to-blue-900 transition-all duration-300 cursor-default">
                Our Services
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
              {/* Discover our comprehensive range of services designed to support your learning, research,
              and professional development journey at every step. */}
              {/* We specialize in professional CCTV installation and maintenance tailored for libraries, co-learning hubs, coaching centers, and educational environments. Safety starts with visibility — let us handle it for you. */}
              While we started with libraries, our services go beyond. We provide reliable CCTV installation and maintenance for educational institutions, co-learning spaces, commercial premises, and more — with end-to-end support.
            </p>
          </div>
        </section>

        {/* Service Categories Tabs */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center mb-16 gap-4">
              {serviceCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${activeTab === index
                      ? `bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 text-white shadow-lg shadow-${category.color}-200`
                      : `bg-${category.color}-50 text-${category.color}-700 hover:bg-${category.color}-100`
                    }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* grid items-center justify-center grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3*/}
            <div className=" flex items-center justify-center  ">
              {allServices[activeTab].map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 hover:scale-105 hover:-translate-y-4 border border-gray-100 hover:border-blue-200 cursor-pointer group lg:w-[50%]"
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>

                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium group-hover:bg-blue-200 transition-colors duration-300 text-center">
                      {service.price}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        <ChevronRight className="w-4 h-4 text-blue-500 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-105 active:scale-95 group-hover:from-blue-600 group-hover:to-indigo-700"
                    onClick={() => {
                    window.location.href = "tel:+916392091959";
                  }}
                  >
                    Contact Us
                  </button>

                  {hoveredService === index && (
                    <div className="absolute inset-0 border-2 border-blue-300 rounded-2xl animate-pulse pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Hours */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Service Hours</span>
              </h2>
              <p className="text-xl text-gray-600">We're here when you need us</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-blue-200 cursor-pointer group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Library Hours</h3>
                </div>
                <div className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  <div className="flex justify-between">
                    <span>Monday - Saturday</span>
                    <span className="font-semibold">5:00 AM - 11:00 PM</span>
                  </div>
                  {/* <div className="flex justify-between">
                  <span>Friday - Saturday</span>
                  <span className="font-semibold">5:00 AM - 11:00 PM</span>
                </div> */}
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-red-600">Close</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-indigo-200 cursor-pointer group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">Support Services</h3>
                </div>
                <div className="space-y-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  <div className="flex justify-between">
                    <span>Reference Desk</span>
                    <span className="font-semibold">During library hours</span>
                  </div>
                  {/* <div className="flex justify-between">
                  <span>Research Consultation</span>
                  <span className="font-semibold">By appointment</span>
                </div> */}
                  <div className="flex justify-between">
                    <span>Digital Support</span>
                    <span className="font-semibold">24/7 Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Service