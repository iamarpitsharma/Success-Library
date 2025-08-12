import { useState } from "react";
import { BookOpen, Search, Users, Award, Home } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// About Page Component
function About() {
    const [hoveredMember, setHoveredMember] = useState(null);
    const [hoveredValue, setHoveredValue] = useState(null);

    const teamMembers = [
        {
            name: "Mr. Devbrat Yadav",
            role: "Founder & Owner",
            bio: "Passionate about creating disciplined, affordable study environments, Mr. Devbrat Yadav founded Success Library to help students stay focused, consistent, and comfortable in their academic journey.",
            avatar: "DY",
            gradient: "from-blue-500 to-indigo-600",
            expertise: ["Self-Study Spaces", "Student Support", "Library Management"]
        },

        // {
        //     name: "Michael Rodriguez",
        //     role: "Technology Director",
        //     bio: "Leading our digital innovation initiatives and ensuring cutting-edge library technologies.",
        //     avatar: "MR",
        //     gradient: "from-indigo-500 to-purple-600",
        //     expertise: ["Database Management", "System Integration", "User Experience"]
        // },
        // {
        //     name: "Emily Chen",
        //     role: "Community Outreach Manager",
        //     bio: "Passionate about connecting our community with valuable learning resources and programs.",
        //     avatar: "EC",
        //     gradient: "from-sky-500 to-blue-600",
        //     expertise: ["Community Engagement", "Program Development", "Event Planning"]
        // },
        // {
        //     name: "David Thompson",
        //     role: "Research Specialist",
        //     bio: "Expert in academic research support and helping students achieve their learning goals.",
        //     avatar: "DT",
        //     gradient: "from-cyan-500 to-sky-600",
        //     expertise: ["Academic Research", "Citation Management", "Data Analysis"]
        // }
    ];

    // const coreValues = [
    //     {
    //         title: "Excellence",
    //         description: "We strive for the highest standards in all our services and resources.",
    //         icon: "🎯",
    //         color: "blue",
    //         bgColor: "bg-blue-50",
    //         hoverBg: "hover:bg-blue-100"
    //     },
    //     {
    //         title: "Innovation",
    //         description: "Embracing new technologies and methods to enhance learning experiences.",
    //         icon: "💡",
    //         color: "indigo",
    //         bgColor: "bg-indigo-50",
    //         hoverBg: "hover:bg-indigo-100"
    //     },
    //     {
    //         title: "Community",
    //         description: "Building strong connections and fostering collaborative learning environments.",
    //         icon: "🤝",
    //         color: "sky",
    //         bgColor: "bg-sky-50",
    //         hoverBg: "hover:bg-sky-100"
    //     },
    //     {
    //         title: "Accessibility",
    //         description: "Ensuring equal access to knowledge and resources for everyone.",
    //         icon: "🌟",
    //         color: "cyan",
    //         bgColor: "bg-cyan-50",
    //         hoverBg: "hover:bg-cyan-100"
    //     }
    // ];

    const coreValues = [
        {
            title: "Focus",
            description: "We provide a calm, distraction-free space to help you concentrate on what matters most — your studies.",
            icon: "🎯",
            color: "blue",
            bgColor: "bg-blue-50",
            hoverBg: "hover:bg-blue-100"
        },
        {
            title: "Discipline",
            description: "We promote self-study habits and consistent routines that lead to real academic progress.",
            icon: "📘",
            color: "indigo",
            bgColor: "bg-indigo-50",
            hoverBg: "hover:bg-indigo-100"
        },
        {
            title: "Accessibility",
            description: "Affordable plans, flexible hours, and open access — because quality study spaces should be for everyone.",
            icon: "🚪",
            color: "sky",
            bgColor: "bg-sky-50",
            hoverBg: "hover:bg-sky-100"
        },
        {
            title: "Comfort & Safety",
            description: "Clean, AC-equipped spaces with RO water and CCTV monitoring — designed for your peace of mind.",
            icon: "🛡️",
            color: "cyan",
            bgColor: "bg-cyan-50",
            hoverBg: "hover:bg-cyan-100"
        }
    ];


    // const milestones = [
    //     { year: "1995", event: "Founded with 5,000 books", icon: BookOpen },
    //     { year: "2005", event: "Digital transformation begins", icon: Search },
    //     { year: "2015", event: "50,000+ digital resources", icon: Award },
    //     { year: "2025", event: "15,000+ active members", icon: Users }
    // ];

    const milestones = [
        { year: "2024", event: "Success Library Founded - Bringing a fresh study experience", icon: BookOpen },
        { year: "2024", event: "Launched 24/6 fully AC, quiet study space", icon: Home },
        { year: "2025", event: "Reached 1,000+ daily visitors and growing", icon: Users },
        { year: "2026", event: "Expanding with more seats and amenities", icon: Award }
    ];

    return (
        <>
            <Navbar />

            <div className="pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Hero Section */}
                <section className="py-24 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer group">
                            <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                            Our Story
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:via-indigo-700 hover:to-blue-900 transition-all duration-300 cursor-default">
                                About Success Library
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
                            {/* For over 30 years, we've been the cornerstone of learning and knowledge in our community,
                            evolving from a traditional library to a modern hub of digital innovation and academic excellence. */}
                            Created for focused minds, Success Library is a modern study space where students bring their own books and find the peace, comfort, and consistency they need to succeed. Built for today’s learners, open for your growth.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="group hover:scale-105 transition-all duration-500 cursor-pointer">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 border border-blue-100 hover:border-blue-200">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-6 group-hover:text-blue-600 transition-colors duration-300">Our Mission</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                        {/* To provide exceptional library services, foster intellectual growth, and create an inclusive environment
                                        where knowledge thrives and communities connect through the power of learning and discovery. */}
                                        To create a peaceful, accessible, and affordable space for self-learners — where students can bring their own books, focus deeply, and stay consistent in their academic journey.

                                    </p>
                                </div>
                            </div>

                            <div className="group hover:scale-105 transition-all duration-500 cursor-pointer">
                                <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl p-8 md:p-12 hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-500 border border-indigo-100 hover:border-indigo-200">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                        <Search className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-6 group-hover:text-indigo-600 transition-colors duration-300">Our Vision</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                        {/* To be the leading library institution that bridges traditional knowledge with digital innovation,
                                        empowering individuals and communities to achieve their full potential through accessible, world-class resources. */}
                                        To become the go-to destination for dedicated learners — a modern self-study space that supports academic goals with comfort, discipline, and consistency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
                                <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Our Core Values</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {coreValues.map((value, index) => (
                                <div
                                    key={index}
                                    className={`${value.bgColor} ${value.hoverBg} rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-4 hover:shadow-2xl cursor-pointer border border-gray-100 group`}
                                    onMouseEnter={() => setHoveredValue(index)}
                                    onMouseLeave={() => setHoveredValue(null)}
                                >
                                    <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                        {value.description}
                                    </p>
                                    {hoveredValue === index && (
                                        <div className="absolute inset-0 border-2 border-blue-300 rounded-2xl animate-pulse pointer-events-none"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Our Journey</span>
                            </h2>
                            <p className="text-xl text-gray-600">Key milestones in our evolution</p>
                        </div>

                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} group`}>
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 hover:scale-105 border border-gray-100 hover:border-blue-200 cursor-pointer">
                                            <div className="text-2xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                                                {milestone.year}
                                            </div>
                                            <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                                                {milestone.event}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-4 border-white">
                                            <milestone.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Meet Our Team</span>
                            </h2>
                            <p className="text-xl text-gray-600">Dedicated professionals committed to your success</p>
                        </div>

                        {/* <div className="grid grid-cols-3 gap-8  justify-center"> */}
                        <div className="flex justify-center">
                            <div className="w-[50%]">
                                {teamMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 hover:scale-105 hover:-translate-y-4 border border-gray-100 hover:border-blue-200 cursor-pointer group text-justify"
                                        onMouseEnter={() => setHoveredMember(index)}
                                        onMouseLeave={() => setHoveredMember(null)}
                                    >
                                        <div className="text-center mb-6">
                                            <div className={`w-20 h-20 bg-gradient-to-br ${member.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                                {member.avatar}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                                {member.name}
                                            </h3>
                                            <p className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                                                {member.role}
                                            </p>
                                        </div>

                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                                            {member.bio}
                                        </p>

                                        <div className="space-y-1">
                                            {member.expertise.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1 group-hover:bg-blue-200 transition-colors duration-300"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {hoveredMember === index && (
                                            <div className="absolute inset-0 border-2 border-blue-300 rounded-2xl animate-pulse pointer-events-none"></div>
                                        )}
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default About