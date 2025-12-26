import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Camera, Upload, MapPin, Leaf, CheckCircle, AlertCircle, Loader } from 'lucide-react';

function HillyUserDashboard() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                setError('Unable to retrieve your location. Please enable location services in your browser settings.');
            }
        );
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (!file || !location) {
            setError('Please select an image and ensure your location is enabled.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);

        try {
            const response = await api.post('/plants/submit', formData);
            setMessage(response.data.message);
            setFile(null);
            setPreview(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg">
                        <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Plant Identification Portal
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload a clear photo of a plant found in hilly regions. Your current location will be automatically tagged for expert verification.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12">
                        {/* Progress Indicator */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between max-w-xl mx-auto">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${file ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {file ? <CheckCircle className="h-6 w-6" /> : <span className="font-semibold">1</span>}
                                    </div>
                                    <span className="mt-2 text-sm font-medium text-gray-700">Upload Photo</span>
                                </div>
                                
                                <div className="flex-1 h-1 mx-4 bg-gray-200">
                                    <div className={`h-full ${location ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${location ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {location ? <CheckCircle className="h-6 w-6" /> : <span className="font-semibold">2</span>}
                                    </div>
                                    <span className="mt-2 text-sm font-medium text-gray-700">Location</span>
                                </div>
                                
                                <div className="flex-1 h-1 mx-4 bg-gray-200">
                                    <div className={`h-full ${file && location ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${file && location ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <span className="font-semibold">3</span>
                                    </div>
                                    <span className="mt-2 text-sm font-medium text-gray-700">Submit</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* File Upload Section */}
                            <div className="space-y-4">
                                <label className="block text-lg font-semibold text-gray-900">
                                    <Camera className="inline h-6 w-6 mr-2 text-emerald-600" />
                                    Plant Photo
                                </label>
                                
                                <div className={`border-3 border-dashed rounded-2xl transition-all duration-300 ${preview ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'}`}>
                                    <div className="p-8 text-center">
                                        {preview ? (
                                            <div className="space-y-6">
                                                <div className="relative inline-block">
                                                    <img 
                                                        src={preview} 
                                                        alt="Plant preview" 
                                                        className="mx-auto h-64 w-auto rounded-xl shadow-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFile(null);
                                                            setPreview(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        ×
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600">{file.name}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                                                    <Upload className="h-12 w-12 text-emerald-600" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label htmlFor="file-upload" className="cursor-pointer">
                                                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                                                            <Camera className="h-5 w-5 mr-2" />
                                                            Choose Photo
                                                        </span>
                                                        <input 
                                                            id="file-upload" 
                                                            name="file-upload" 
                                                            type="file" 
                                                            className="sr-only" 
                                                            onChange={handleFileChange} 
                                                            accept="image/*" 
                                                        />
                                                    </label>
                                                    <p className="text-sm text-gray-500">or drag and drop your image here</p>
                                                    <p className="text-xs text-gray-400">
                                                        PNG, JPG, GIF up to 10MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Status */}
                            <div className="space-y-4">
                                <label className="block text-lg font-semibold text-gray-900">
                                    <MapPin className="inline h-6 w-6 mr-2 text-emerald-600" />
                                    Location Information
                                </label>
                                
                                {location ? (
                                    <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <MapPin className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-emerald-800">Location captured successfully!</p>
                                                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                                        <span className="text-gray-500">Latitude:</span>
                                                        <span className="ml-2 font-mono font-medium text-gray-900">{location.latitude.toFixed(6)}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                                        <span className="text-gray-500">Longitude:</span>
                                                        <span className="ml-2 font-mono font-medium text-gray-900">{location.longitude.toFixed(6)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl animate-pulse">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <Loader className="h-8 w-8 text-amber-500 animate-spin" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-amber-800">Capturing your location...</p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    Please ensure location services are enabled in your browser settings.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Messages */}
                            {message && (
                                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-green-800">Submission Successful!</p>
                                            <p className="text-green-700 mt-1">{message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                                    <div className="flex items-center space-x-3">
                                        <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-red-800">Submission Error</p>
                                            <p className="text-red-700 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={!file || !location || loading}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader className="animate-spin h-5 w-5 mr-3" />
                                            Processing Submission...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <Upload className="h-5 w-5 mr-2" />
                                            Submit for Expert Verification
                                        </span>
                                    )}
                                </button>
                                
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    Your submission will be reviewed by our plant experts within 24-48 hours.
                                </p>
                            </div>
                        </form>

                        {/* Tips Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Leaf className="h-5 w-5 mr-2 text-emerald-600" />
                                Tips for Best Results
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-emerald-600 font-semibold mb-2">Clear Photos</div>
                                    <p className="text-sm text-gray-600">Take photos in good lighting, focusing on leaves, flowers, and stems.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-emerald-600 font-semibold mb-2">Multiple Angles</div>
                                    <p className="text-sm text-gray-600">Include photos from different angles for better identification.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-emerald-600 font-semibold mb-2">Location Accuracy</div>
                                    <p className="text-sm text-gray-600">Ensure GPS is enabled for precise location tagging.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HillyUserDashboard;