// client/src/pages/KnowledgeHubPage.jsx
import React, { useState, useEffect } from 'react';
import plantService from '../services/plantService';
import Spinner from '../components/shared/Spinner';
import PlantCard from '../components/knowledge-hub/PlantCard'; 
import { HelpCircle } from 'lucide-react';

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
        <div className="bg-green-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-green-800 sm:text-5xl">
                        Medicinal Plant Knowledge Hub
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        An open atlas of expert-verified medicinal plants from our community.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for a plant by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                {/* Plant Grid */}
                {filteredPlants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlants.map(plant => (
                            <PlantCard key={plant._id} plant={plant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No plants found matching your search.</p>
                    </div>
                )}

                {/* Doubts/Contact Section */}
                <div className="mt-20 text-center bg-white p-8 rounded-lg shadow-md">
                     <HelpCircle className="mx-auto h-12 w-12 text-blue-500" />
                     <h3 className="mt-4 text-2xl font-bold text-gray-800">Have Questions?</h3>
                     <p className="mt-2 text-gray-600">
                        If you are a member of a licensed institution and wish to inquire further, please contact our conservation team.
                     </p>
                     <a href="mailto:conservation@hillherbs.org" className="mt-6 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Contact Us
                     </a>
                </div>
            </div>
        </div>
    );
}

export default KnowledgeHubPage;