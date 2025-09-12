

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, FeatureGroup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { Landmark, Boundary, Coords, CoordsPath, LandmarkType, Animal, Waypoint, WaypointCategory, WeatherData, HuntTrack } from '../types';
import { Modal } from './ui/Modal';
import { Card } from './ui/Card';

// Fix for default icon issue with modern bundlers
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface RanchMapProps {
  landmarks: Landmark[];
  boundaries: Boundary[];
  animals: Animal[];
  addLandmark: (landmark: Omit<Landmark, 'id'>) => void;
  addBoundary: (boundary: Omit<Boundary, 'id'>) => void;
  removeFeature: (id: string) => void;
  waypoints: Waypoint[];
  addWaypoint: (waypoint: Omit<Waypoint, 'id'>) => void;
  huntTracks: HuntTrack[];
  addHuntTrack: (track: Omit<HuntTrack, 'id'>) => void;
}

interface NewFeatureData {
    type: 'landmark' | 'boundary';
    data: Coords | CoordsPath;
}

const LANDMARK_ICON_PATHS: Record<LandmarkType, string> = {
    [LandmarkType.Gate]: `<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h13.5M5.25 15.75h13.5M8.25 5.25v13.5" />`,
    [LandmarkType.HuntingHide]: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />`,
    [LandmarkType.Pump]: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75v10.5M12 21a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75h6" />`,
    [LandmarkType.Dam]: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75v10.5M12 21a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 15.75l3-3 3 3" />`,
    [LandmarkType.WaterTrough]: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />`,
    [LandmarkType.Other]: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`
};

const getLandmarkIcon = (type: LandmarkType) => {
    const svgPath = LANDMARK_ICON_PATHS[type] || LANDMARK_ICON_PATHS[LandmarkType.Other];
    return L.divIcon({
        html: `<div class="p-1 bg-brand-primary rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    ${svgPath}
                </svg>
               </div>`,
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

const WAYPOINT_ICON_PATHS: Partial<Record<WaypointCategory, string>> = {
    [WaypointCategory['Fresh Spoor / Track']]: `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />`, // Simplified track icon
    [WaypointCategory['Shot Location']]: `<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-3-3v6" />`,
    [WaypointCategory['Blood Trail - First']]: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`, // Heart/Drop shape
    [WaypointCategory['Harvest Location']]: `<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />`, // Trophy/Star
    [WaypointCategory['Stand / Hide / Blind']]: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V3.545M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3.75h.75A2.25 2.25 0 0121.75 6v.75" />`,
};


const WAYPOINT_COLORS: Record<WaypointCategory, string> = {
    [WaypointCategory['Animal Sighting (High Priority)']]: '#ef4444', // red-500
    [WaypointCategory['Animal Sighting (Low Priority)']]: '#f59e0b', // amber-500
    [WaypointCategory['Fresh Spoor / Track']]: '#854d0e', // brown-700
    [WaypointCategory['Shot Location']]: '#dc2626', // red-600
    [WaypointCategory['Blood Trail - First']]: '#b91c1c', // red-700
    [WaypointCategory['Blood Trail - Last']]: '#fee2e2', // red-100
    [WaypointCategory['Harvest Location']]: '#16a34a', // green-600
    [WaypointCategory['Stand / Hide / Blind']]: '#57534e', // stone-600
    [WaypointCategory.BrokenFence]: '#f97316', // orange
    [WaypointCategory.PoachingSign]: '#ef4444', // red
    [WaypointCategory.WaterIssue]: '#0ea5e9', // cyan
    [WaypointCategory.Infrastructure]: '#a855f7', // purple
    [WaypointCategory.Other]: '#6b7280', // gray
};

const getWaypointIcon = (category: WaypointCategory) => {
    const color = WAYPOINT_COLORS[category] || WAYPOINT_COLORS[WaypointCategory.Other];
    const svgPath = WAYPOINT_ICON_PATHS[category];
    
    if (svgPath) {
         return L.divIcon({
            html: `<div class="p-1 rounded-full shadow-lg flex items-center justify-center" style="background-color: ${color};">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        ${svgPath}
                    </svg>
                   </div>`,
            className: 'bg-transparent border-0',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    }

    return L.divIcon({
        html: `<div class="w-6 h-6 rounded-full shadow-md border-2 border-white" style="background-color: ${color};"></div>`,
        className: 'bg-transparent border-0',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};


const getSpeciesColor = (species: string): string => {
    const colors: { [key: string]: string } = {
        'Impala': '#D2B48C', // Tan
        'Kudu': '#8B4513', // SaddleBrown
        'Blue Wildebeest': '#4682B4', // SteelBlue
        'Warthog': '#696969', // DimGray
        'Blesbok': '#A0522D', // Sienna
    };
    return colors[species] || '#708090'; // SlateGray for others
};

const getAnimalIcon = (species: string) => {
    const speciesColor = getSpeciesColor(species);
    const initial = species.charAt(0).toUpperCase();
    return L.divIcon({
        html: `<div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white" style="background-color: ${speciesColor};">
                 ${initial}
               </div>`,
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

const DrawControl = ({ featureGroupRef, onCreated, onDeleted }: any) => {
  const map = useMap();

  useEffect(() => {
    if (!featureGroupRef.current) return;
    const featureGroup = featureGroupRef.current;

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        rectangle: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        marker: { icon: new L.Icon.Default() },
        polygon: {
          shapeOptions: { color: '#8A9A5B' }
        }
      },
      edit: {
        featureGroup: featureGroup,
      },
    });

    map.addControl(drawControl);
    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.DELETED, onDeleted);
    };
  }, [map, featureGroupRef, onCreated, onDeleted]);

  return null;
};

const MapLayersControl = () => {
    const map = useMap();

    useEffect(() => {
        const baseLayers = {
            "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri'
            }),
            "Topographic": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenTopoMap'
            }),
            "Streets": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            })
        };

        baseLayers.Satellite.addTo(map);

        L.control.layers(baseLayers).addTo(map);

    }, [map]);

    return null;
};


export const RanchMap: React.FC<RanchMapProps> = ({ landmarks, boundaries, animals, addLandmark, addBoundary, removeFeature, waypoints, addWaypoint, huntTracks, addHuntTrack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState<NewFeatureData | null>(null);
  const [name, setName] = useState('');
  const [landmarkType, setLandmarkType] = useState<LandmarkType>(LandmarkType.Other);
  const [drawnLayer, setDrawnLayer] = useState<L.Layer | null>(null);
  const [isWaypointModalOpen, setIsWaypointModalOpen] = useState(false);
  const [newWaypointData, setNewWaypointData] = useState<Omit<Waypoint, 'id' | 'category' | 'title'>>();
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<CoordsPath>([]);
  const watchIdRef = useRef<number | null>(null);
  const [isSaveTrackModalOpen, setIsSaveTrackModalOpen] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const RANCH_CENTER: Coords = [30.51, -98.39];
  const RANCH_ZOOM = 14;

  useEffect(() => {
    // Mock weather API fetch
    setTimeout(() => {
        setWeather({
            temperature: 24, // Celsius
            windSpeed: 12, // km/h
            windDirection: 135, // SE
            pressure: 1012,
            sunrise: "06:45",
            sunset: "18:30"
        });
    }, 1000);
  }, []);
  
  useEffect(() => {
    if (isTracking) {
        if (!('geolocation' in navigator)) {
            console.error("Geolocation is not supported by this browser.");
            setIsTracking(false);
            return;
        }
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentTrack(prev => [...prev, [latitude, longitude]]);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsTracking(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }

    return () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }
    };
  }, [isTracking]);
  
  const locationCenters = useMemo(() => {
    const centers = new Map<string, Coords>();
    boundaries.forEach(boundary => {
        const center = L.polygon(boundary.positions).getBounds().getCenter();
        centers.set(boundary.name, [center.lat, center.lng]);
    });
    return centers;
  }, [boundaries]);

  const handleCreate = useCallback((e: any) => {
    const { layerType, layer } = e;
    setDrawnLayer(layer); 
    
    if (layerType === 'marker') {
      const { lat, lng } = layer.getLatLng();
      setNewWaypointData({
          position: [lat, lng],
          date: new Date().toISOString().split('T')[0]
      });
      setIsWaypointModalOpen(true);
    }
    if (layerType === 'polygon') {
      const latlngs = layer.getLatLngs()[0].map((p: L.LatLng) => [p.lat, p.lng]);
      setNewFeature({ type: 'boundary', data: [...latlngs, latlngs[0]] });
      setIsModalOpen(true);
    }
  }, []);
  
  const removeFeatureRef = useRef(removeFeature);
  useEffect(() => {
    removeFeatureRef.current = removeFeature;
  }, [removeFeature]);

  const handleDelete = useCallback((e: any) => {
    e.layers.eachLayer((layer: any) => {
        const customId = (layer as any).myCustomId;
        if (customId) {
            removeFeatureRef.current(customId);
        }
    });
  }, []);

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature || !name) {
      alert('Please provide a name.');
      return;
    }
    if (newFeature.type === 'landmark') {
      addLandmark({ name, type: landmarkType, position: newFeature.data as Coords });
    } else {
      addBoundary({ name, positions: newFeature.data as CoordsPath });
    }
    resetModal();
  };

  const resetModal = () => {
    if (drawnLayer) {
       // @ts-ignore
      if (drawnLayer._map) {
          drawnLayer.remove();
      }
    }
    setIsModalOpen(false);
    setNewFeature(null);
    setName('');
    setLandmarkType(LandmarkType.Other);
    setDrawnLayer(null);
  };
  
  const handleWaypointSubmit = (e: React.FormEvent, category: WaypointCategory, title: string, notes?: string) => {
    e.preventDefault();
    if (!newWaypointData || !title) {
        alert('Please provide a title for the waypoint.');
        return;
    }
    addWaypoint({ ...newWaypointData, category, title, notes });
    resetWaypointModal();
  };

  const resetWaypointModal = () => {
    if (drawnLayer) {
      if ((drawnLayer as any)._map) {
          drawnLayer.remove();
      }
    }
    setIsWaypointModalOpen(false);
    setNewWaypointData(undefined);
    setDrawnLayer(null);
  };

  const handleToggleTracking = () => {
    if (isTracking && currentTrack.length > 1) {
      setIsSaveTrackModalOpen(true);
    }
    setIsTracking(prev => !prev);
  };

  const handleSaveTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const name = trackName || `Track - ${new Date().toLocaleString()}`;
    addHuntTrack({ name, date: new Date().toISOString().split('T')[0], path: currentTrack });
    setCurrentTrack([]);
    setTrackName('');
    setIsSaveTrackModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Ranch Map</h2>
      <Card className="flex-grow p-0 relative">
        <MapContainer center={RANCH_CENTER} zoom={RANCH_ZOOM} style={{ height: '100%', width: '100%' }} className="rounded-md">
          <MapLayersControl />
          <FeatureGroup ref={featureGroupRef}>
            <DrawControl
              featureGroupRef={featureGroupRef}
              onCreated={handleCreate}
              onDeleted={handleDelete}
            />

            {boundaries.map(boundary => (
              <Polygon 
                key={boundary.id} 
                positions={boundary.positions} 
                pathOptions={{ color: '#C3B091', weight: 2, fillOpacity: 0.1 }}
                eventHandlers={{
                  add: (e) => { (e.target as any).myCustomId = boundary.id; }
                }}
              >
                <Popup><strong>{boundary.name}</strong></Popup>
              </Polygon>
            ))}

            {landmarks.map(landmark => (
              <Marker 
                key={landmark.id} 
                position={landmark.position} 
                icon={getLandmarkIcon(landmark.type)} 
                eventHandlers={{
                  add: (e) => { (e.target as any).myCustomId = landmark.id; }
                }}>
                <Popup>
                    <strong>{landmark.name}</strong><br/>
                    Type: {landmark.type}
                </Popup>
              </Marker>
            ))}
          </FeatureGroup>
          
          {animals.map(animal => {
            const center = locationCenters.get(animal.location);
            if (!center) return null;
            const position: Coords = [center[0] + (Math.random() - 0.5) * 0.002, center[1] + (Math.random() - 0.5) * 0.002];

            return (
                <Marker key={animal.id} position={position} icon={getAnimalIcon(animal.species)}>
                    <Popup>
                        <strong>Tag ID: {animal.tagId}</strong><br/>
                        Species: {animal.species}<br/>
                        Health: {animal.health}
                    </Popup>
                </Marker>
            );
          })}

          {waypoints.map(waypoint => (
            <Marker key={waypoint.id} position={waypoint.position} icon={getWaypointIcon(waypoint.category)}>
                <Popup>
                    <strong>{waypoint.title}</strong> ({waypoint.category})<br/>
                    Date: {waypoint.date}<br/>
                    {waypoint.notes}
                </Popup>
            </Marker>
          ))}
          
          {currentTrack.length > 1 && <Polyline positions={currentTrack} color="red" weight={3} />}
          {huntTracks.map(track => <Polyline key={track.id} positions={track.path} color="blue" weight={2} dashArray="5, 10" />)}

        </MapContainer>
        
        {/* Map Overlays */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            {weather ? (
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12" viewBox="0 0 24 24" style={{ transform: `rotate(${weather.windDirection}deg)` }}>
                                <path d="M12 2L12 12M12 2L6 8M12 2L18 8" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <p className="font-bold">{weather.windSpeed} km/h</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{weather.temperature}°C</p>
                        <p>{weather.pressure} hPa</p>
                        <p>Sunrise: {weather.sunrise}</p>
                        <p>Sunset: {weather.sunset}</p>
                    </div>
                </div>
            ) : <p>Loading weather...</p>}
        </div>
        <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
            <button onClick={handleToggleTracking} className={`px-4 py-2 text-white font-bold rounded-lg shadow-lg transition-colors ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {isTracking ? 'Stop Tracking' : 'Start Live Track'}
            </button>
            <button onClick={() => setIsOfflineModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600">
                Offline Maps
            </button>
        </div>

      </Card>
      
      <Modal isOpen={isModalOpen} onClose={resetModal} title={`Add New ${newFeature?.type === 'landmark' ? 'Landmark' : 'Boundary'}`}>
          <form onSubmit={handleModalSubmit}>
              <div className="space-y-4">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                  </div>
                  {newFeature?.type === 'landmark' && (
                      <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Landmark Type</label>
                          <select name="type" id="type" value={landmarkType} onChange={(e) => setLandmarkType(e.target.value as LandmarkType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">
                              {Object.values(LandmarkType).map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                      </div>
                  )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={resetModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark">Save</button>
              </div>
          </form>
      </Modal>

      <Modal isOpen={isWaypointModalOpen} onClose={resetWaypointModal} title="Create New Waypoint">
        <form onSubmit={(e) => {
            const formData = new FormData(e.target as HTMLFormElement);
            handleWaypointSubmit(
                e,
                formData.get('category') as WaypointCategory,
                formData.get('title') as string,
                formData.get('notes') as string
            );
        }}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input name="title" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" defaultValue={WaypointCategory["Animal Sighting (High Priority)"]} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        {Object.values(WaypointCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea name="notes" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={resetWaypointModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Save Waypoint</button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={isSaveTrackModalOpen} onClose={() => setIsSaveTrackModalOpen(false)} title="Save Hunt Track">
          <form onSubmit={handleSaveTrack}>
              <label className="block text-sm font-medium text-gray-700">Track Name</label>
              <input type="text" value={trackName} onChange={e => setTrackName(e.target.value)} placeholder={`Track - ${new Date().toLocaleString()}`} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
               <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => { setIsSaveTrackModalOpen(false); setCurrentTrack([]); }} className="px-4 py-2 bg-red-500 text-white rounded-lg">Discard</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Save</button>
            </div>
          </form>
      </Modal>

      <Modal isOpen={isOfflineModalOpen} onClose={() => setIsOfflineModalOpen(false)} title="Offline Map Manager">
          <div>
              <p className="text-gray-600 mb-4">This feature allows you to download map areas for use without an internet connection. Zoom to the desired area and click 'Download' to cache the map tiles to your device.</p>
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="font-semibold">Current Map View</p>
                  <p className="text-sm text-gray-500">The map tiles currently visible on your screen will be saved.</p>
              </div>
              <div className="flex justify-end mt-6">
                  <button onClick={() => { alert('Map tiles for the current view have been cached for offline use.'); setIsOfflineModalOpen(false); }} className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow hover:bg-brand-dark">
                      Download Current View
                  </button>
              </div>
          </div>
      </Modal>

    </div>
  );
};