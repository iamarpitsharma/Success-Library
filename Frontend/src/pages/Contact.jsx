import React, { useState,  } from 'react';
import { Clock, ChevronRight, ArrowRight, Phone, Mail, MapPin} from 'lucide-react';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Contact Page Component
function Contact() {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   subject: '',
  //   message: ''
  // });
  const [hoveredContact, setHoveredContact] = useState(null);

  // const handleInputChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission
  //   console.log('Form submitted:', formData);
  // };

  const contactMethods = [
    {
      title: "Visit Us",
      description: "Come visit our beautiful library and explore our facilities in person.",
      icon: MapPin,
      details: "Near Amrawati Computer Center \nBindrabazar, Azamgarh 276205",
      action: "Get Directions",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      shadowColor: "hover:shadow-blue-200"
    },
    {
      title: "Call Us",
      description: "Speak directly with us for immediate assistance.",
      icon: Phone,
      details: "+91 63920 91959\nMonday - Saturday : 8AM - 6PM",
      action: "Call Now",
      gradient: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      hoverBg: "hover:bg-indigo-100",
      shadowColor: "hover:shadow-indigo-200"
    },
    {
      title: "Email Us",
      description: "Send us a detailed message and we'll respond within 24 hours.",
      icon: Mail,
      details: "successlibrary@gmail.com\ndevbrat@gmail.com",
      action: "Send Email",
      gradient: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-50",
      hoverBg: "hover:bg-sky-100",
      shadowColor: "hover:shadow-sky-200"
    }
  ];

//   const departments = [
//     {
//       name: "General Information",
//       email: "info@successlibrary.com",
//       phone: "+1 (555) 123-4567",
//       description: "General inquiries, membership, and library services"
//     },
//     {
//       name: "Research Support",
//       email: "research@successlibrary.com",
//       phone: "+1 (555) 123-4568",
//       description: "Academic research assistance and consultation"
//     },
//     {
//       name: "Technical Support",
//       email: "tech@successlibrary.com",
//       phone: "+1 (555) 123-4569",
//       description: "Digital services and technical assistance"
//     },
//     {
//       name: "Events & Programs",
//       email: "events@successlibrary.com",
//       phone: "+1 (555) 123-4570",
//       description: "Workshops, seminars, and community programs"
//     }
//   ];

  const faqs = [
    {
      question: "How do I become a member?",
      answer: "Simply visit us with a Aadhaar Card and 2 passport size photo."
    }
  ];

    return (
      <>
            <Navbar/>
      
    <div className="pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Get In Touch
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:via-indigo-700 hover:to-blue-900 transition-all duration-300 cursor-default">
              Contact Us
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
            We're here to help! Reach out to us for assistance, information, or to learn more about our services. 
            Our friendly team is always ready to support your learning journey.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Ways to Reach Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the method that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`${method.bgColor} ${method.hoverBg} rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:shadow-2xl ${method.shadowColor} cursor-pointer border border-gray-100 hover:border-gray-200 group`}
                onMouseEnter={() => setHoveredContact(index)}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                  <method.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {method.description}
                </p>
                
                <div className="text-gray-700 mb-6 font-medium whitespace-pre-line group-hover:text-gray-800 transition-colors duration-300">
                  {method.details}
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-105 active:scale-95 group-hover:from-blue-600 group-hover:to-indigo-700 flex items-center justify-center space-x-2"
                onClick={() => {
                    if (method.title === "Call Us") {
                      window.location.href = "tel:+916392091959";
                    } else if (method.title === "Email Us") {
                      window.location.href = "mailto:successlibrary@gmail.com";
                    } else if (method.title === "Visit Us") {
                      window.open("https://maps.app.goo.gl/M4FeJXhuLQPiPq1A9?g_st=ac", "_blank");
                    }
                  }}
                >
                  <span>{method.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                {hoveredContact === index && (
                  <div className="absolute inset-0 border-2 border-blue-300 rounded-2xl animate-pulse pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Map Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 border border-gray-100 hover:border-blue-200 group cursor-pointer">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-blue-600 transition-colors duration-300">
          Find Us Here
        </h3>
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl h-64 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <p className="text-blue-800 font-semibold group-hover:text-blue-900 transition-colors duration-300">
              Interactive Map Coming Soon
            </p>
            <p className="text-blue-600 mt-2 group-hover:text-blue-700 transition-colors duration-300">
              Near Amrawati Computer Center, Bindrabazar Azamgarh
            </p>
          </div>
        </div>
      </div>

      {/* Hours Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 border border-gray-100 hover:border-indigo-200 group cursor-pointer flex flex-col justify-center">
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
  </div>
</section>


      {/* Department Contacts */}
      {/* <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Department Contacts</span>
            </h2>
            <p className="text-xl text-gray-600">Connect directly with the right department for faster assistance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-200 transition-all duration-500 hover:scale-105 border border-blue-100 hover:border-blue-200 cursor-pointer group"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {dept.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm group-hover:text-gray-700 transition-colors duration-300">
                  {dept.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group/item">
                    <Mail className="w-4 h-4 mr-2 group-hover/item:scale-110 transition-transform duration-200" />
                    <span className="text-sm">{dept.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700 hover:text-green-600 transition-colors duration-300 group/item">
                    <Phone className="w-4 h-4 mr-2 group-hover/item:rotate-12 transition-transform duration-200" />
                    <span className="text-sm">{dept.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Frequently Asked Questions</span>
            </h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-200 transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-blue-200 cursor-pointer group"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 flex items-center">
                  <ChevronRight className="w-5 h-5 mr-2 text-blue-500 group-hover:rotate-90 group-hover:scale-110 transition-all duration-300" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-7 group-hover:text-gray-700 transition-colors duration-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed hover:text-white transition-colors duration-300">
            Join thousands of learners who have transformed their educational journey with Success Library. 
            Your path to knowledge starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-black/20 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 active:scale-95 hover:bg-gray-50 flex items-center justify-center space-x-2 group"
                onClick={() => {
                  window.open("https://maps.app.goo.gl/M4FeJXhuLQPiPq1A9?g_st=ac", "_blank");
                }}
                >
              <span>Visit Us Today</span>
              <MapPin className="w-5 h-5 group-hover:bounce transition-all duration-300" />
            </button>
                <button
                  onClick={() => window.location.href = "tel:+916392091959"}

                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2 group">
              <span>Call Now</span>
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default Contact