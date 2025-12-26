import React from 'react';
import { Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

function PendingApprovalPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg text-center">
                <div className="mx-auto h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <Clock className="h-10 w-10 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Pending</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for registering as an expert! Your profile and ID proof are currently under review by our administrators.
                </p>
                <p className="text-sm text-gray-500">
                    You will gain access to the Expert Dashboard once your account is approved.
                </p>
            </div>
        </div>
    );
}

export default PendingApprovalPage;