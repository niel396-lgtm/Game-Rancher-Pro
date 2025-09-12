
import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { StarIcon } from './ui/Icons';
import { RanchProfile, EcologicalRating, ClientReview } from '../types';

interface RanchDiscoveryProps {
  ranchProfiles: RanchProfile[];
  ecologicalRatings: EcologicalRating[];
  clientReviews: ClientReview[];
}

interface EnrichedRanch {
  profile: RanchProfile;
  avgClientRating: number;
  clientReviewCount: number;
  avgEcoRating: number;
  ecoRatingCount: number;
}

const StarRating: React.FC<{ rating: number; reviewCount?: number }> = ({ rating, reviewCount }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
        {reviewCount !== undefined && (
            <span className="text-xs text-gray-500 ml-2">({reviewCount} reviews)</span>
        )}
    </div>
);

const RanchCard: React.FC<{ ranch: EnrichedRanch }> = ({ ranch }) => (
    <Card className="flex flex-col h-full">
        <div className="flex-grow">
            <h3 className="text-2xl font-bold text-brand-dark">{ranch.profile.publicName}</h3>
            <p className="text-sm font-medium text-gray-500 mb-2">{ranch.profile.province}</p>
            <p className="text-sm text-gray-700 mb-4">{ranch.profile.shortDescription}</p>
            <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Species Offered</p>
                <div className="flex flex-wrap gap-2">
                    {ranch.profile.speciesOffered.map(s => (
                        <span key={s} className="px-2 py-1 text-xs bg-brand-light text-brand-dark rounded-full">{s}</span>
                    ))}
                </div>
            </div>
        </div>
        <div className="mt-auto pt-4 border-t space-y-2">
            <div>
                <p className="text-sm font-semibold text-gray-600">Client Rating</p>
                <StarRating rating={ranch.avgClientRating} reviewCount={ranch.clientReviewCount} />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-600">Ecological Health Score</p>
                <StarRating rating={ranch.avgEcoRating} />
            </div>
        </div>
    </Card>
);

export const RanchDiscovery: React.FC<RanchDiscoveryProps> = ({ ranchProfiles, ecologicalRatings, clientReviews }) => {
    const [filters, setFilters] = useState({
        province: 'All',
        species: [] as string[],
        minClientRating: 0,
        minEcoRating: 0,
    });
    const [sortBy, setSortBy] = useState('eco');

    const publicRanches = useMemo(() => ranchProfiles.filter(r => r.isPublic), [ranchProfiles]);
    
    const enrichedRanches = useMemo((): EnrichedRanch[] => {
        return publicRanches.map(profile => {
            const ranchEcoRatings = ecologicalRatings.filter(r => r.ranchId === profile.ranchId);
            const ranchClientReviews = clientReviews.filter(r => r.ranchId === profile.ranchId);

            let avgEcoRating = 0;
            if (ranchEcoRatings.length > 0) {
                const totalEcoScore = ranchEcoRatings.reduce((sum, r) => sum + r.animalHealth + r.habitatCondition + r.managementPractices, 0);
                avgEcoRating = totalEcoScore / (ranchEcoRatings.length * 3);
            }

            let avgClientRating = 0;
            if (ranchClientReviews.length > 0) {
                avgClientRating = ranchClientReviews.reduce((sum, r) => sum + r.overallRating, 0) / ranchClientReviews.length;
            }

            return {
                profile,
                avgClientRating,
                clientReviewCount: ranchClientReviews.length,
                avgEcoRating,
                ecoRatingCount: ranchEcoRatings.length,
            };
        });
    }, [publicRanches, ecologicalRatings, clientReviews]);

    const { availableProvinces, availableSpecies } = useMemo(() => {
        const provinces = new Set<string>();
        const species = new Set<string>();
        publicRanches.forEach(r => {
            provinces.add(r.province);
            r.speciesOffered.forEach(s => species.add(s));
        });
        return {
            availableProvinces: Array.from(provinces).sort(),
            availableSpecies: Array.from(species).sort(),
        };
    }, [publicRanches]);

    const handleSpeciesChange = (species: string) => {
        setFilters(prev => ({
            ...prev,
            species: prev.species.includes(species)
                ? prev.species.filter(s => s !== species)
                : [...prev.species, species]
        }));
    };

    const filteredAndSortedRanches = useMemo(() => {
        return enrichedRanches
            .filter(ranch => {
                if (filters.province !== 'All' && ranch.profile.province !== filters.province) return false;
                if (filters.species.length > 0 && !filters.species.every(s => ranch.profile.speciesOffered.includes(s))) return false;
                if (ranch.avgClientRating < filters.minClientRating) return false;
                if (ranch.avgEcoRating < filters.minEcoRating) return false;
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'client': return b.avgClientRating - a.avgClientRating;
                    case 'name': return a.profile.publicName.localeCompare(b.profile.publicName);
                    case 'eco':
                    default: return b.avgEcoRating - a.avgEcoRating;
                }
            });
    }, [enrichedRanches, filters, sortBy]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-2">Find a Ranch</h2>
            <p className="text-gray-600 mb-6">Discover and compare ranches based on verified client reviews and independent ecological ratings.</p>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters */}
                <aside className="lg:w-1/4">
                    <Card title="Filter & Sort" className="sticky top-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sort By</label>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="eco">Ecological Health (High to Low)</option>
                                    <option value="client">Client Rating (High to Low)</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Province</label>
                                <select value={filters.province} onChange={e => setFilters(f => ({...f, province: e.target.value}))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="All">All Provinces</option>
                                    {availableProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Species</label>
                                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                    {availableSpecies.map(s => (
                                        <label key={s} className="flex items-center">
                                            <input type="checkbox" checked={filters.species.includes(s)} onChange={() => handleSpeciesChange(s)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"/>
                                            <span className="ml-2 text-sm text-gray-600">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Minimum Client Rating</label>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Any</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                                </div>
                                <input type="range" min="0" max="4.5" step="0.5" value={filters.minClientRating} onChange={e => setFilters(f => ({...f, minClientRating: parseFloat(e.target.value)}))} className="w-full" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Minimum Ecological Score</label>
                                <div className="flex justify-between text-xs text-gray-500">
                                     <span>Any</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                                </div>
                                <input type="range" min="0" max="4.5" step="0.5" value={filters.minEcoRating} onChange={e => setFilters(f => ({...f, minEcoRating: parseFloat(e.target.value)}))} className="w-full" />
                            </div>
                        </div>
                    </Card>
                </aside>
                {/* Results */}
                <main className="lg:w-3/4">
                    {filteredAndSortedRanches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredAndSortedRanches.map(ranch => (
                                <RanchCard key={ranch.profile.id} ranch={ranch} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-gray-700">No Ranches Found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your filters to find more results.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
