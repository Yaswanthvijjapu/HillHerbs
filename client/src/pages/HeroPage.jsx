// client/src/pages/HeroPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, Shield, ArrowRight, TrendingUp } from 'lucide-react';
import plantService from '../services/plantService';
import Navbar from '../components/layout/Navbar';

function HeroPage() {
    const navigate = useNavigate();
    const [plantCount, setPlantCount] = useState(0);

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

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16 py-8">
                    <h1 className="text-5xl font-extrabold text-green-800 sm:text-6xl mb-4">
                        Medicinal Plant Knowledge Hub
                    </h1>
                    <p className="mt-4 text-2xl text-gray-700 max-w-3xl mx-auto">
                        Empowering communities through verified medicinal plant knowledge
                    </p>
                    <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
                        An open atlas of expert-verified medicinal plants from our hill communities, 
                        promoting biodiversity conservation and sustainable livelihoods.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/explore')}
                            className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Explore Plants
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center px-8 py-4 border-2 border-green-600 text-green-700 text-lg font-bold rounded-full hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            Join as Expert
                        </button>
                    </div>
                </div>

                {/* Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                            <Leaf className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Local Awareness</h3>
                        <p className="text-gray-600">
                            Locals gain knowledge of medicinal uses and importance of plants, 
                            preserving traditional wisdom for future generations.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Community Empowerment</h3>
                        <p className="text-gray-600">
                            Creates livelihood opportunities for hill residents via safe, 
                            regulated herbal trade and sustainable harvesting practices.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-600 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                            <Shield className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Biodiversity Conservation</h3>
                        <p className="text-gray-600">
                            Helps governments and researchers in preserving rare medicinal species 
                            and protecting endangered plant populations.
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 mb-16 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="h-8 w-8 mr-2" />
                                <p className="text-5xl font-bold">{plantCount}</p>
                            </div>
                            <p className="text-green-100 text-lg">Verified Plants</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Shield className="h-8 w-8 mr-2" />
                                <p className="text-5xl font-bold">100%</p>
                            </div>
                            <p className="text-green-100 text-lg">Expert Verified</p>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-2">
                                <Users className="h-8 w-8 mr-2" />
                                <p className="text-5xl font-bold">Community</p>
                            </div>
                            <p className="text-green-100 text-lg">Driven Knowledge</p>
                        </div>
                    </div>
                </div>

                {/* Why HillHerbs Section */}
                <div className="bg-white rounded-2xl shadow-xl p-10 mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                        Why HillHerbs?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-green-700 mb-3">For Communities</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Learn about medicinal plants in your region
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Contribute local knowledge for verification
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Access sustainable harvesting guidelines
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">✓</span>
                                    Create economic opportunities through regulated trade
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-blue-700 mb-3">For Researchers & Conservationists</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">✓</span>
                                    Access verified plant location data
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">✓</span>
                                    Collaborate on biodiversity conservation
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">✓</span>
                                    Support sustainable development goals
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">✓</span>
                                    Contribute to rare species preservation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center text-gray-600">
                    <p className="text-sm">
                        All plant information has been verified by certified experts. Location data is protected 
                        and available only to authorized research and conservation bodies to prevent overharvesting.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HeroPage;
