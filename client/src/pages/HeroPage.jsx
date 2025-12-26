// client/src/components/pages/HeroPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, Users, Shield, ArrowRight, TrendingUp, BookOpen, 
  Target, MapPin, Heart, Database, CheckCircle, Globe,
  Sparkles, Cloud, Server, Cpu, Lock, Layers, Camera,
  ArrowRightCircle, Star, Award, Zap, Brain, ShieldCheck
} from 'lucide-react';
import plantService from '../services/plantService';
import Navbar from '../components/layout/Navbar';

function HeroPage() {
    const navigate = useNavigate();
    const [plantCount, setPlantCount] = useState(0);
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const fetchPlantCount = async () => {
            try {
                const response = await plantService.getVerified();
                setPlantCount(response.data.length);
            } catch (error) {
                console.error("Failed to fetch plant count", error);
            }
        };
        fetchPlantCount();
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
            <Navbar />
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center py-20">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <Sparkles className="h-4 w-4 mr-2" />
                        From Hills to Healing
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            HillHerbs
                        </span>
                        <br />
                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                            Discover & Preserve Medicinal Plants
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Bridging traditional wisdom with modern verification to empower communities 
                        and conserve biodiversity in hill regions.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button
                            onClick={() => navigate('/explore')}
                            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            <Camera className="h-5 w-5 mr-3" />
                            Explore Plant Database
                            <ArrowRightCircle className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/register?expert=true')}
                            className="group inline-flex items-center px-8 py-4 border-2 border-emerald-500 text-emerald-600 text-lg font-bold rounded-full hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            <ShieldCheck className="h-5 w-5 mr-3" />
                            Join as Expert
                            <ArrowRight className="ml-3 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                            <div className="flex items-center justify-center mb-3">
                                <Database className="h-8 w-8 text-emerald-500" />
                            </div>
                            <p className="text-3xl font-bold text-emerald-700">{plantCount}+</p>
                            <p className="text-sm text-gray-600">Verified Plants</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                            <div className="flex items-center justify-center mb-3">
                                <CheckCircle className="h-8 w-8 text-emerald-500" />
                            </div>
                            <p className="text-3xl font-bold text-emerald-700">100%</p>
                            <p className="text-sm text-gray-600">Expert Verified</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                            <div className="flex items-center justify-center mb-3">
                                <MapPin className="h-8 w-8 text-emerald-500" />
                            </div>
                            <p className="text-3xl font-bold text-emerald-700">Hill</p>
                            <p className="text-sm text-gray-600">Communities</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2 mb-16 border border-emerald-100">
                    <div className="flex flex-wrap justify-center gap-2">
                        {['overview', 'challenges', 'solution', 'technology', 'benefits'].map((section) => (
                            <button
                                key={section}
                                onClick={() => {
                                    setActiveSection(section);
                                    scrollToSection(section);
                                }}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                                    activeSection === section
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                                }`}
                            >
                                {section === 'overview' && 'Overview'}
                                {section === 'challenges' && 'Challenges'}
                                {section === 'solution' && 'Our Solution'}
                                {section === 'technology' && 'Technology'}
                                {section === 'benefits' && 'Benefits'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Section */}
                <div id="overview" className="mb-20 scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                The Challenge
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            Herbal plants are generally found in hill areas and forests, making these regions 
                            extremely important for sustaining traditional medicine systems. However, despite 
                            their rich presence, many valuable species remain undocumented or underutilized.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 shadow-lg border border-emerald-100">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-emerald-100 rounded-xl mr-4">
                                    <Leaf className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Rich Biodiversity</h3>
                            </div>
                            <p className="text-gray-600">
                                Hill regions possess extraordinary biodiversity with numerous medicinal 
                                plant species that have been used in Ayurveda, Siddha, and other traditional 
                                medicine systems for centuries.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border border-amber-100">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-amber-100 rounded-xl mr-4">
                                    <Target className="h-6 w-6 text-amber-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Knowledge Gap</h3>
                            </div>
                            <p className="text-gray-600">
                                Despite rich traditional knowledge, there are significant challenges in 
                                identifying, preserving, and utilizing rare species that affect communities, 
                                healthcare sectors, and conservation efforts.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Challenges Section */}
                <div id="challenges" className="mb-20 scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Problems Identified</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Our research reveals critical gaps affecting multiple stakeholders in medicinal plant conservation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Ayurvedic Experts & Researchers',
                                icon: BookOpen,
                                color: 'purple',
                                points: [
                                    'Lack awareness of exact availability in hill regions',
                                    'Limited discovery and validation of rare plants',
                                    'Difficulty accessing authentic medicinal sources'
                                ]
                            },
                            {
                                title: 'Local Hill Communities',
                                icon: Users,
                                color: 'blue',
                                points: [
                                    'Fail to recognize rare and valuable species',
                                    'Lack verified medicinal information',
                                    'Miss legal livelihood opportunities'
                                ]
                            },
                            {
                                title: 'Ayurvedic Industry',
                                icon: Database,
                                color: 'emerald',
                                points: [
                                    'Challenges in sourcing authentic plants',
                                    'Dependence on informal suppliers',
                                    'Risks of low-quality raw materials'
                                ]
                            },
                            {
                                title: 'Conservation Bodies',
                                icon: Shield,
                                color: 'red',
                                points: [
                                    'Absence of accurate distribution data',
                                    'Ineffective conservation regulation',
                                    'Illegal exploitation and biodiversity loss'
                                ]
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className={`flex items-center mb-4 p-3 bg-${item.color}-100 rounded-xl`}>
                                    <item.icon className={`h-6 w-6 text-${item.color}-600 mr-3`} />
                                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                </div>
                                <ul className="space-y-2">
                                    {item.points.map((point, idx) => (
                                        <li key={idx} className="flex items-start text-gray-600">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 mt-2 mr-3 flex-shrink-0`} />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Solution Section */}
                <div id="solution" className="mb-20 scroll-mt-20">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold mb-4">Our Integrated Solution</h2>
                            <p className="text-emerald-100 text-xl">
                                HillHerbs connects traditional knowledge with modern verification technology
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: '1',
                                    title: 'AI Identification',
                                    description: 'Locals capture plant images; AI compares them with expert-verified database',
                                    icon: Brain
                                },
                                {
                                    step: '2',
                                    title: 'Expert Validation',
                                    description: 'Ayurvedic experts confirm identity, ensuring scientific accuracy',
                                    icon: ShieldCheck
                                },
                                {
                                    step: '3',
                                    title: 'Knowledge Sharing',
                                    description: 'Locals gain awareness of medicinal uses and plant importance',
                                    icon: BookOpen
                                },
                                {
                                    step: '4',
                                    title: 'Geo-Tagging',
                                    description: 'Verified plants are added to a live availability atlas',
                                    icon: MapPin
                                },
                                {
                                    step: '5',
                                    title: 'Sustainable Use',
                                    description: 'Data shared only with authorized institutions to prevent exploitation',
                                    icon: Heart
                                },
                                {
                                    step: '6',
                                    title: 'Conservation',
                                    description: 'Helps preserve rare medicinal species through data-driven protection',
                                    icon: Shield
                                }
                            ].map((item) => (
                                <div key={item.step} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-white text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mr-4">
                                            {item.step}
                                        </div>
                                        <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                    <p className="text-emerald-100">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div id="technology" className="mb-20 scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Stack</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Powered by modern technologies for reliable plant identification and data management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                category: 'Front-End',
                                color: 'blue',
                                icon: Layers,
                                tech: ['React', 'Tailwind CSS', 'Responsive Design']
                            },
                            {
                                category: 'Back-End',
                                color: 'emerald',
                                icon: Server,
                                tech: ['Node.js', 'RESTful APIs', 'Cloud Hosting']
                            },
                            {
                                category: 'AI & Recognition',
                                color: 'purple',
                                icon: Cpu,
                                tech: ['TensorFlow', 'Image Processing', 'Deep Learning']
                            },
                            {
                                category: 'Database',
                                color: 'amber',
                                icon: Database,
                                tech: ['MongoDB', 'PostgreSQL', 'Real-time Sync']
                            },
                            {
                                category: 'Security',
                                color: 'red',
                                icon: Lock,
                                tech: ['SSL/TLS', 'OAuth 2.0', 'Data Encryption']
                            },
                            {
                                category: 'Geolocation',
                                color: 'green',
                                icon: Globe,
                                tech: ['GPS Integration', 'Mapping API', 'Location Services']
                            }
                        ].map((tech, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className={`flex items-center mb-4 p-3 bg-${tech.color}-100 rounded-xl`}>
                                    <tech.icon className={`h-6 w-6 text-${tech.color}-600 mr-3`} />
                                    <h3 className="text-xl font-bold text-gray-900">{tech.category}</h3>
                                </div>
                                <div className="space-y-2">
                                    {tech.tech.map((item, idx) => (
                                        <div key={idx} className="flex items-center text-gray-600">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-${tech.color}-500 mr-3`} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section */}
                <div id="benefits" className="mb-20 scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefits & Impact</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Creating sustainable value for all stakeholders in the medicinal plant ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 shadow-lg border border-emerald-100">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-emerald-100 rounded-xl mr-4">
                                    <Star className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">For Communities</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Learn about medicinal plants in your region</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Contribute local knowledge for verification</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Access sustainable harvesting guidelines</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Create economic opportunities through regulated trade</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg border border-blue-100">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">For Researchers</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Access verified plant location data</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Collaborate on biodiversity conservation</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Support sustainable development goals</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">Contribute to rare species preservation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mb-20">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Join the Movement: From Hills to Healing
                        </h2>
                        <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                            Be part of the solution that bridges traditional wisdom with modern verification 
                            to preserve medicinal plants and empower communities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                            >
                                Start Contributing
                            </button>
                            <button
                                onClick={() => navigate('/explore')}
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
                            >
                                Explore Database
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center py-8 border-t border-gray-200">
                    <div className="inline-flex items-center bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-600 mb-4">
                        <Shield className="h-4 w-4 mr-2" />
                        Protected Ecosystem
                    </div>
                    <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                        All plant information has been verified by certified experts. Location data is protected 
                        and available only to authorized research and conservation bodies to prevent overharvesting 
                        and promote sustainable practices.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HeroPage;