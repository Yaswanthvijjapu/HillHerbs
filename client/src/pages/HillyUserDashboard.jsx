import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/shared/Spinner';

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
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Submit a Plant for Verification</h2>
            <p className="text-gray-600 mb-8">Upload a clear photo of a plant. Your current location will be tagged automatically.</p>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plant Photo
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {preview ? (
                                    <img src={preview} alt="Plant preview" className="mx-auto h-48 w-auto rounded-md" />
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {location ? (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
                            <p className="text-sm font-medium text-green-800">Location captured successfully!</p>
                            <p className="text-xs text-green-700">Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}</p>
                        </div>
                    ) : (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-center">
                             <p className="text-sm font-medium text-yellow-800">Capturing your location...</p>
                        </div>
                    )}

                    {message && <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm text-center">{message}</p>}
                    {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={!file || !location || loading}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {loading && <Spinner />}
                            {loading ? 'Submitting...' : 'Submit for Verification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HillyUserDashboard;