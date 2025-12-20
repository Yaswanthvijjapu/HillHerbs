// client/src/pages/KnowledgeHubPage.jsx
import React, { useState, useEffect } from 'react';
import plantService from '../services/plantService';
import Spinner from '../components/shared/Spinner';
import PlantCard from '../components/knowledge-hub/PlantCard'; 
import { HelpCircle, Leaf } from 'lucide-react';

function KnowledgeHubPage() {
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVerifiedPlants = async () => {
            try {
                // You should have a getVerified function in your plantService
                const response = await plantService.getVerified(); 
                setPlants(response.data);
                setFilteredPlants(response.data);
            } catch (error) {
                console.error("Failed to fetch plants", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVerifiedPlants();
    }, []);
    
    // Filter plants based on search term
    useEffect(() => {
        const results = plants.filter(plant =>
            plant.finalPlantName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPlants(results);
    }, [searchTerm, plants]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Search Bar */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                        Explore Verified Medicinal Plants
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for a plant by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 border-2 border-green-300 rounded-full shadow-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 text-lg"
                        />
                        <p className="text-center text-sm text-gray-500 mt-3">
                            {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                </div>

                {/* Plant Grid */}
                {filteredPlants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredPlants.map(plant => (
                            <PlantCard key={plant._id} plant={plant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg mb-16">
                        <Leaf className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No plants found matching your search.</p>
                        <p className="text-gray-400 text-sm mt-2">Try different keywords or browse all plants.</p>
                    </div>
                )}

                {/* Contact Section */}
                <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 p-10 rounded-2xl shadow-2xl text-white">
                    <div className="text-center">
                        <HelpCircle className="mx-auto h-16 w-16 mb-4" />
                        <h3 className="text-3xl font-bold mb-3">Questions or Research Inquiries?</h3>
                        <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                            If you are a member of a licensed institution, researcher, or conservation organization 
                            and wish to inquire further about plant locations or collaborate on biodiversity projects, 
                            please contact our conservation team.
                        </p>
                        <a 
                            href="mailto:conservation@hillherbs.org" 
                            className="inline-block bg-white text-blue-700 font-bold py-4 px-8 rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Contact Conservation Team
                        </a>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-gray-600">
                    <p className="text-sm">
                        All plant information has been verified by certified experts. Location data is protected 
                        and available only to authorized research and conservation bodies to prevent overharvesting.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default KnowledgeHubPage;