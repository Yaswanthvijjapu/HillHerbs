// client/src/pages/RejectedApplicationPage.jsx
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight, ShieldAlert } from 'lucide-react';

function RejectedApplicationPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-lg mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-red-100 text-center">
                <div className="mx-auto h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border-2 border-red-100">
                    <XCircle className="h-10 w-10 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Expert Application Status
                </h2>
                
                <div className="bg-red-50 p-4 rounded-xl mb-6 text-left">
                    <div className="flex items-start">
                        <ShieldAlert className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm">
                            Thank you for your interest in becoming a verified expert. Unfortunately, after reviewing your credentials, our administrators were unable to approve your expert account at this time.
                        </p>
                    </div>
                </div>

                <p className="text-gray-600 mb-8 text-sm">
                    However, you can still contribute! You have been granted standard community access. You can explore the Knowledge Hub and submit plants for our verified experts to review.
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg transform hover:-translate-y-0.5"
                >
                    Continue to Community Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default RejectedApplicationPage;