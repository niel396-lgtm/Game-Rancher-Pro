

import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { StarIcon } from './ui/Icons';
import { RanchProfile, EcologicalRating, ClientReview, PHProfile, ProfessionalHunter, Hunt } from '../types';

// DEMO NOTE: Top Rated criteria have been lowered to work with sample data.
// Ranch: 3+ reviews, >= 4.5 client avg, >= 4.0 eco avg.
// PH: 4+ reviews, >= 4.8 client avg.
const TOP_RATED_MIN_REVIEWS_RANCH = 3;
const TOP_RATED_MIN_REVIEWS_PH = 4;


interface EnrichedRanch {
  profile: RanchProfile;
  avgClientRating: number;
  clientReviewCount: number;
  avgEcoRating: number;
  ecoRatingCount: number;
}

interface EnrichedPH {
  profile: PHProfile;
  details: ProfessionalHunter;
  avgClientRating: number;
  clientReviewCount: number;
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

const RanchCard: React.FC<{ ranch: EnrichedRanch, isTopRated?: boolean }> = ({ ranch, isTopRated }) => (
    <Card className={`flex flex-col h-full transition-shadow hover:shadow-xl ${isTopRated ? 'border-2 border-yellow-400' : ''}`}>
        {isTopRated && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md">Top Rated</div>}
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

const PHCard: React.FC<{ ph: EnrichedPH, isTopRated?: boolean }> = ({ ph, isTopRated }) => (
     <Card className={`flex flex-col h-full transition-shadow hover:shadow-xl ${isTopRated ? 'border-2 border-yellow-400' : ''}`}>
        {isTopRated && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md">Top Rated</div>}
        <div className="flex items-start gap-4 mb-4">
            <img src={ph.profile.photoUrl} alt={ph.details.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"/>
            <div className="flex-grow">
                 <h3 className="text-2xl font-bold text-brand-dark">{ph.details.name}</h3>
                 <p className="text-sm font-medium text-gray-500">{ph.profile.yearsOfExperience} years of experience</p>
                 <div className="mt-2">
                    <StarRating rating={ph.avgClientRating} reviewCount={ph.clientReviewCount} />
                 </div>
            </div>
        </div>
        <div className="flex-grow">
            <p className="text-sm text-gray-700 mb-4">{ph.profile.biography}</p>
             <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Specializations</p>
                <div className="flex flex-wrap gap-2">
                    {ph.profile.specializations.map(s => (
                        <span key={s} className="px-2 py-1 text-xs bg-brand-light text-brand-dark rounded-full">{s}</span>
                    ))}
                </div>
            </div>
        </div>
         <div className="mt-auto pt-4 border-t text-sm text-gray-500">
            <p><strong>Languages:</strong> {ph.profile.languages.join(', ')}</p>
            <p><strong>Provinces:</strong> {ph.details.provincialEndorsements.join(', ')}</p>
        </div>
    </Card>
);

interface DiscoveryPortalProps {
  ranchProfiles: RanchProfile[];
  ecologicalRatings: EcologicalRating[];
  clientReviews: ClientReview[];
  phProfiles: PHProfile[];
  professionalHunters: ProfessionalHunter[];
  hunts: Hunt[];
}


export const RanchDiscovery: React.FC<DiscoveryPortalProps> = ({ ranchProfiles, ecologicalRatings, clientReviews, phProfiles, professionalHunters, hunts }) => {
    const [discoveryMode, setDiscoveryMode] = useState<'ranch' | 'ph'>('ranch');
    const [ranchFilters, setRanchFilters] = useState({ province: 'All', species: [] as string[], minClientRating: 0, minEcoRating: 0 });
    const [phFilters, setPhFilters] = useState({ minExperience: 0, specializations: [] as string[], languages: [] as string[] });
    const [sortBy, setSortBy] = useState('eco');
    
    // --- Data Enrichment ---
    const enrichedRanches = useMemo((): EnrichedRanch[] => {
        return ranchProfiles.filter(r => r.isPublic).map(profile => {
            const ranchEcoRatings = ecologicalRatings.filter(r => r.ranchId === profile.ranchId);
            const ranchClientReviews = clientReviews.filter(r => r.ranchId === profile.ranchId);

            const avgEcoRating = ranchEcoRatings.length > 0
                ? ranchEcoRatings.reduce((sum, r) => sum + r.animalHealth + r.habitatCondition + r.managementPractices, 0) / (ranchEcoRatings.length * 3)
                : 0;

            const avgClientRating = ranchClientReviews.length > 0
                ? ranchClientReviews.reduce((sum, r) => sum + r.overallRating, 0) / ranchClientReviews.length
                : 0;

            return { profile, avgClientRating, clientReviewCount: ranchClientReviews.length, avgEcoRating, ecoRatingCount: ranchEcoRatings.length };
        });
    }, [ranchProfiles, ecologicalRatings, clientReviews]);
    
    const enrichedPHs = useMemo((): EnrichedPH[] => {
        const phMap = new Map(professionalHunters.map(ph => [ph.id, ph]));
        const huntToPhMap = new Map(hunts.map(h => [h.id, h.professionalHunterId]));
        
        const reviewsByPh = new Map<string, number[]>();
        clientReviews.forEach(review => {
            if (review.phRating !== undefined) {
                const phId = huntToPhMap.get(review.huntId);
                if (phId) {
                    if (!reviewsByPh.has(phId)) reviewsByPh.set(phId, []);
                    reviewsByPh.get(phId)!.push(review.phRating);
                }
            }
        });

        return phProfiles.filter(p => p.isPublic).map(profile => {
            const details = phMap.get(profile.phId);
            if (!details) return null;
            
            const phReviews = reviewsByPh.get(profile.phId) || [];
            const avgClientRating = phReviews.length > 0 ? phReviews.reduce((sum, r) => sum + r, 0) / phReviews.length : 0;
            
            return { profile, details, avgClientRating, clientReviewCount: phReviews.length };
        }).filter((p): p is EnrichedPH => p !== null);
    }, [phProfiles, professionalHunters, hunts, clientReviews]);

    // --- Filtering and Sorting ---
    const { availableProvinces, availableSpecies } = useMemo(() => {
        const provinces = new Set<string>(enrichedRanches.map(r => r.profile.province));
        const species = new Set<string>(enrichedRanches.flatMap(r => r.profile.speciesOffered));
        return { availableProvinces: Array.from(provinces).sort(), availableSpecies: Array.from(species).sort() };
    }, [enrichedRanches]);
    
    const { availableSpecializations, availableLanguages } = useMemo(() => {
        const specializations = new Set<string>(enrichedPHs.flatMap(ph => ph.profile.specializations));
        const languages = new Set<string>(enrichedPHs.flatMap(ph => ph.profile.languages));
        return { availableSpecializations: Array.from(specializations).sort(), availableLanguages: Array.from(languages).sort() };
    }, [enrichedPHs]);

    const filteredAndSortedRanches = useMemo(() => {
        return enrichedRanches
            .filter(ranch => {
                if (ranchFilters.province !== 'All' && ranch.profile.province !== ranchFilters.province) return false;
                if (ranchFilters.species.length > 0 && !ranchFilters.species.every(s => ranch.profile.speciesOffered.includes(s))) return false;
                if (ranch.avgClientRating < ranchFilters.minClientRating) return false;
                if (ranch.avgEcoRating < ranchFilters.minEcoRating) return false;
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'client': return b.avgClientRating - a.avgClientRating;
                    case 'name': return a.profile.publicName.localeCompare(b.profile.publicName);
                    case 'eco': default: return b.avgEcoRating - a.avgEcoRating;
                }
            });
    }, [enrichedRanches, ranchFilters, sortBy]);

    const filteredAndSortedPHs = useMemo(() => {
        return enrichedPHs
            .filter(ph => {
                if (ph.profile.yearsOfExperience < phFilters.minExperience) return false;
                if (phFilters.specializations.length > 0 && !phFilters.specializations.every(s => ph.profile.specializations.includes(s))) return false;
                if (phFilters.languages.length > 0 && !phFilters.languages.every(l => ph.profile.languages.includes(l))) return false;
                return true;
            })
            .sort((a,b) => b.avgClientRating - a.avgClientRating);
    }, [enrichedPHs, phFilters]);

    // --- "Top Rated" Logic ---
    const { topRatedRanches, otherRanches } = useMemo(() => {
        const top: EnrichedRanch[] = [];
        const other: EnrichedRanch[] = [];
        filteredAndSortedRanches.forEach(r => {
            if (r.avgEcoRating >= 4.0 && r.avgClientRating >= 4.5 && r.clientReviewCount >= TOP_RATED_MIN_REVIEWS_RANCH) {
                top.push(r);
            } else {
                other.push(r);
            }
        });
        return { topRatedRanches: top, otherRanches: other };
    }, [filteredAndSortedRanches]);
    
    const { topRatedPHs, otherPHs } = useMemo(() => {
        const top: EnrichedPH[] = [];
        const other: EnrichedPH[] = [];
        filteredAndSortedPHs.forEach(ph => {
            if (ph.avgClientRating >= 4.8 && ph.clientReviewCount >= TOP_RATED_MIN_REVIEWS_PH) {
                top.push(ph);
            } else {
                other.push(ph);
            }
        });
        return { topRatedPHs: top, otherPHs: other };
    }, [filteredAndSortedPHs]);
    
    // --- Handlers ---
    const handleCheckboxChange = (filterKey: 'species' | 'specializations' | 'languages', value: string) => {
        const setFn = discoveryMode === 'ranch' ? setRanchFilters : setPhFilters;
        setFn((prev: any) => ({
            ...prev,
            [filterKey]: prev[filterKey].includes(value)
                ? prev[filterKey].filter((i: string) => i !== value)
                : [...prev[filterKey], value]
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-3xl font-bold text-brand-dark mb-2">Discovery Portal</h2>
                    <p className="text-gray-600 mb-6">Find verified ranches and professional hunters.</p>
                 </div>
                 <div className="flex bg-gray-200 rounded-lg p-1">
                    <button onClick={() => setDiscoveryMode('ranch')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${discoveryMode === 'ranch' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>Find a Ranch</button>
                    <button onClick={() => setDiscoveryMode('ph')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${discoveryMode === 'ph' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>Find a PH</button>
                 </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4">
                    <Card title="Filter & Sort" className="sticky top-10">
                        {discoveryMode === 'ranch' ? (
                            <div className="space-y-6">
                                <div><label className="block text-sm font-medium">Sort By</label><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"><option value="eco">Ecological Health</option><option value="client">Client Rating</option><option value="name">Name (A-Z)</option></select></div>
                                <div><label className="block text-sm font-medium">Province</label><select value={ranchFilters.province} onChange={e => setRanchFilters(f => ({...f, province: e.target.value}))} className="mt-1 block w-full rounded-md border-gray-300"><option value="All">All Provinces</option>{availableProvinces.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                <div><label className="block text-sm font-medium">Species</label><div className="mt-2 space-y-2 max-h-40 overflow-y-auto">{availableSpecies.map(s => (<label key={s} className="flex items-center"><input type="checkbox" checked={ranchFilters.species.includes(s)} onChange={() => handleCheckboxChange('species', s)} className="h-4 w-4 rounded border-gray-300 text-brand-primary"/> <span className="ml-2 text-sm">{s}</span></label>))}</div></div>
                                <div><label className="block text-sm font-medium">Min. Client Rating</label><div className="flex justify-between text-xs text-gray-500"><span>Any</span><span>5</span></div><input type="range" min="0" max="4.5" step="0.5" value={ranchFilters.minClientRating} onChange={e => setRanchFilters(f => ({...f, minClientRating: parseFloat(e.target.value)}))} className="w-full" /></div>
                                <div><label className="block text-sm font-medium">Min. Ecological Score</label><div className="flex justify-between text-xs text-gray-500"><span>Any</span><span>5</span></div><input type="range" min="0" max="4.5" step="0.5" value={ranchFilters.minEcoRating} onChange={e => setRanchFilters(f => ({...f, minEcoRating: parseFloat(e.target.value)}))} className="w-full" /></div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div><label className="block text-sm font-medium">Min. Years of Experience</label><div className="flex justify-between text-xs text-gray-500"><span>{phFilters.minExperience} yrs</span><span>30+ yrs</span></div><input type="range" min="0" max="30" step="1" value={phFilters.minExperience} onChange={e => setPhFilters(f => ({...f, minExperience: parseInt(e.target.value)}))} className="w-full" /></div>
                                <div><label className="block text-sm font-medium">Specializations</label><div className="mt-2 space-y-2 max-h-40 overflow-y-auto">{availableSpecializations.map(s => (<label key={s} className="flex items-center"><input type="checkbox" checked={phFilters.specializations.includes(s)} onChange={() => handleCheckboxChange('specializations', s)} className="h-4 w-4 rounded border-gray-300 text-brand-primary"/> <span className="ml-2 text-sm">{s}</span></label>))}</div></div>
                                <div><label className="block text-sm font-medium">Languages</label><div className="mt-2 space-y-2 max-h-40 overflow-y-auto">{availableLanguages.map(l => (<label key={l} className="flex items-center"><input type="checkbox" checked={phFilters.languages.includes(l)} onChange={() => handleCheckboxChange('languages', l)} className="h-4 w-4 rounded border-gray-300 text-brand-primary"/> <span className="ml-2 text-sm">{l}</span></label>))}</div></div>
                            </div>
                        )}
                    </Card>
                </aside>
                <main className="lg:w-3/4 space-y-8">
                    {discoveryMode === 'ranch' ? (
                        <>
                            {topRatedRanches.length > 0 && (
                                <div><h3 className="text-2xl font-bold text-yellow-600 mb-4 border-b-2 border-yellow-200 pb-2">Top Rated Ranches</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{topRatedRanches.map(ranch => <RanchCard key={ranch.profile.id} ranch={ranch} isTopRated />)}</div></div>
                            )}
                            <div>{topRatedRanches.length > 0 && <h3 className="text-xl font-semibold text-brand-dark mb-4 border-b pb-2">All Ranches</h3>}<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{otherRanches.map(ranch => <RanchCard key={ranch.profile.id} ranch={ranch} />)}</div></div>
                            {otherRanches.length === 0 && topRatedRanches.length === 0 && <div className="text-center py-20"><h3 className="text-xl font-semibold">No Ranches Found</h3><p className="text-gray-500 mt-2">Try adjusting your filters.</p></div>}
                        </>
                    ) : (
                         <>
                            {topRatedPHs.length > 0 && (
                                <div><h3 className="text-2xl font-bold text-yellow-600 mb-4 border-b-2 border-yellow-200 pb-2">Top Rated Professional Hunters</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{topRatedPHs.map(ph => <PHCard key={ph.profile.id} ph={ph} isTopRated />)}</div></div>
                            )}
                            <div>{topRatedPHs.length > 0 && <h3 className="text-xl font-semibold text-brand-dark mb-4 border-b pb-2">All Professional Hunters</h3>}<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{otherPHs.map(ph => <PHCard key={ph.profile.id} ph={ph} />)}</div></div>
                            {otherPHs.length === 0 && topRatedPHs.length === 0 && <div className="text-center py-20"><h3 className="text-xl font-semibold">No Professional Hunters Found</h3><p className="text-gray-500 mt-2">Try adjusting your filters.</p></div>}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};
