import React from 'react';
import { Clock, Shield, Mail, Phone, CheckCircle, ArrowRight, Users, Leaf } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

function PendingApprovalPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <Navbar />
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <Shield className="h-4 w-4 mr-2" />
                        Expert Application Status
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Verification In Progress
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your journey to becoming a certified plant expert has begun
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 mb-12">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col items-center text-center">
                            {/* Animated Icon */}
                            <div className="relative mb-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                                    <Clock className="h-16 w-16 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Leaf className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* Status Message */}
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Your Application is Under Review
                                </h2>
                                
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200 mb-8">
                                    <p className="text-lg text-amber-800 font-medium mb-4">
                                        Thank you for registering as an expert! Your profile and ID proof are currently being reviewed by our verification team.
                                    </p>
                                    <p className="text-gray-700">
                                        This process ensures the highest quality standards for our expert community and maintains trust in our medicinal plant database.
                                    </p>
                                </div>

                                {/* Timeline */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                                        What happens next?
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                                            <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                                                1
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">Document Review</h4>
                                            <p className="text-sm text-gray-600">
                                                Our team verifies your credentials and ID proof
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                                            <div className="w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                                                2
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">Background Check</h4>
                                            <p className="text-sm text-gray-600">
                                                Verification of expertise and professional background
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                                            <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                                                3
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-2">Approval</h4>
                                            <p className="text-sm text-gray-600">
                                                Access to expert dashboard upon successful verification
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Estimated Timeline */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 mb-8">
                                    <div className="flex items-center justify-center mb-4">
                                        <Clock className="h-6 w-6 text-blue-600 mr-3" />
                                        <h4 className="text-lg font-bold text-gray-900">Processing Time</h4>
                                    </div>
                                    <p className="text-gray-700">
                                        Verification typically takes <span className="font-bold text-blue-700">24-48 hours</span>. 
                                        You'll receive an email notification as soon as your account is approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* While You Wait Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200 mb-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">While You Wait...</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore our platform and prepare for your expert journey
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <Users className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-center mb-3">Community Guidelines</h4>
                            <p className="text-sm text-gray-600 text-center">
                                Review our expert community guidelines and verification standards
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <Leaf className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-center mb-3">Explore Database</h4>
                            <p className="text-sm text-gray-600 text-center">
                                Browse verified medicinal plants and understand our verification process
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <Mail className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-center mb-3">Check Email</h4>
                            <p className="text-sm text-gray-600 text-center">
                                Keep an eye on your inbox for verification updates and next steps
                            </p>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="text-center">
                    <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-lg border border-gray-200 mb-6">
                        <Phone className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                            Need assistance? Contact our support team at{' '}
                            <span className="font-semibold text-emerald-600">support@hillherbs.org</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Thank you for your patience and interest in contributing to our mission of preserving medicinal plant knowledge.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PendingApprovalPage;