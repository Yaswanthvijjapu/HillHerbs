// client/src/pages/KnowledgeHubPage.jsx
import React, { useState, useEffect } from 'react';
import plantService from '../services/plantService';
import PlantCard from '../components/knowledge-hub/PlantCard';
import PlantMapModal from '../components/knowledge-hub/PlantMapModal'; // Import the Map Modal
import { 
  HelpCircle, Leaf, Search, Filter, Shield, 
  Database, TrendingUp, Globe, Award, Hash, Eye 
} from 'lucide-react';

function KnowledgeHubPage() {
    // --- Data State ---
    const [plants, setPlants] = useState([]);
    const [filteredPlants, setFilteredPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Search & Filter State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // --- Map Modal State ---
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [selectedPlantForMap, setSelectedPlantForMap] = useState(null);

    // --- Handlers for Map ---
    const handleOpenMap = (plant) => {
        setSelectedPlantForMap(plant);
        setIsMapOpen(true);
    };

    const handleCloseMap = () => {
        setIsMapOpen(false);
        setSelectedPlantForMap(null);
    };

    // --- Fetch Data ---
    useEffect(() => {
        const fetchVerifiedPlants = async () => {
            try {
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
    
    // --- Filter Logic ---
    useEffect(() => {
        let results = plants.filter(plant =>
            plant.finalPlantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (plant.medicinalUses && plant.medicinalUses.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        // Placeholder for future category filtering logic
        if (activeFilter !== 'all') {
            // If you add categories to your DB later, filter here.
            // Example: results = results.filter(p => p.category === activeFilter);
        }
        
        setFilteredPlants(results);
    }, [searchTerm, plants, activeFilter]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg animate-pulse">
                        <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Loading Plant Database...</p>
                    <p className="text-sm text-gray-500 mt-2">Fetching verified medicinal plants</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* --- Header Section --- */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <Database className="h-4 w-4 mr-2" />
                        Expert-Verified Database
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Medicinal Plant Knowledge Hub
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Explore our collection of verified medicinal plants from hill regions, 
                        complete with expert insights and conservation data.
                    </p>
                </div>

                {/* --- Stats Banner --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-emerald-100 rounded-xl mr-4">
                                <Leaf className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-700">{plants.length}</p>
                                <p className="text-sm text-gray-600">Total Plants</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-700">100%</p>
                                <p className="text-sm text-gray-600">Expert Verified</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-xl mr-4">
                                <Globe className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-700">Hill</p>
                                <p className="text-sm text-gray-600">Regions</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="p-3 bg-amber-100 rounded-xl mr-4">
                                <TrendingUp className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-700">Growing</p>
                                <p className="text-sm text-gray-600">Database</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Search and Filter Section --- */}
                <div className="mb-12">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search plants by name, medicinal properties, or region..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-lg outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all"
                            >
                                <Filter className="h-5 w-5 mr-2" />
                                Filters
                            </button>
                        </div>

                        {/* Filter Options (Expandable) */}
                        {showFilters && (
                            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 animate-fadeIn">
                                <div className="flex items-center mb-4">
                                    <Filter className="h-5 w-5 text-emerald-600 mr-2" />
                                    <h4 className="font-bold text-gray-900">Filter Options</h4>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['all', 'rare', 'common', 'herbs', 'trees', 'shrubs'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                activeFilter === filter
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                                    : 'bg-white text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 border border-gray-200'
                                            }`}
                                        >
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center text-gray-600">
                                <Hash className="h-5 w-5 mr-2" />
                                <span className="font-medium">
                                    Showing {filteredPlants.length} of {plants.length} plants
                                </span>
                            </div>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Plant Grid --- */}
                {filteredPlants.length > 0 ? (
                    <div className="mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPlants.map(plant => (
                                <PlantCard 
                                    key={plant._id} 
                                    plant={plant} 
                                    onMapClick={handleOpenMap} // PASSING THE MAP HANDLER
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100 mb-16">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                            <Search className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No plants found</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            We couldn't find any plants matching "{searchTerm}". Try a different search term or browse all plants.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setActiveFilter('all');
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg"
                        >
                            <Eye className="h-5 w-5 mr-2" />
                            View All Plants
                        </button>
                    </div>
                )}

                {/* --- Conservation Contact Section --- */}
                <div className="mb-16">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-10 md:p-16 text-center text-white">
                            <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
                                <HelpCircle className="h-10 w-10 text-white" />
                            </div>
                            
                            <h2 className="text-3xl font-bold mb-6">
                                Research & Conservation Partnerships
                            </h2>
                            
                            <div className="max-w-3xl mx-auto mb-10">
                                <p className="text-xl text-blue-100 mb-6">
                                    If you represent a licensed institution, research organization, or conservation body 
                                    and require detailed plant location data for biodiversity projects or conservation efforts:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                        <Award className="h-8 w-8 text-white mb-4 mx-auto" />
                                        <h4 className="font-bold text-lg mb-2">Authorized Access</h4>
                                        <p className="text-blue-100 text-sm">
                                            Location data available to verified research and conservation organizations
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                        <Shield className="h-8 w-8 text-white mb-4 mx-auto" />
                                        <h4 className="font-bold text-lg mb-2">Protected Data</h4>
                                        <p className="text-blue-100 text-sm">
                                            Strict protocols prevent overharvesting and ensure sustainable use
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <a 
                                href="mailto:conservation@hillherbs.org" 
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                            >
                                Contact Conservation Team
                                <HelpCircle className="ml-3 h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- Protection Notice --- */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <Shield className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Data Protection & Ethics</h3>
                            <p className="text-gray-700">
                                All plant information in this database has been rigorously verified by certified botanical 
                                and Ayurvedic experts. To protect vulnerable species and prevent overharvesting, precise 
                                location data is accessible only to authorized research institutions, conservation bodies, 
                                and government agencies through verified partnerships.
                            </p>
                            <p className="text-sm text-gray-600 mt-4">
                                Our commitment to sustainable conservation ensures traditional knowledge is preserved 
                                while protecting biodiversity for future generations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAP MODAL COMPONENT --- */}
            {selectedPlantForMap && (
                <PlantMapModal 
                    isOpen={isMapOpen} 
                    onClose={handleCloseMap} 
                    plant={selectedPlantForMap} 
                />
            )}
        </div>
    );
}

export default KnowledgeHubPage;