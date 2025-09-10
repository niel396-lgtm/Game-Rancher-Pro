
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { Landmark, Boundary, Coords, CoordsPath, LandmarkType, Animal } from '../types';
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

// This component manages the Leaflet Draw control lifecycle.
// It is defined outside the main component to prevent re-creation on every render.
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


export const RanchMap: React.FC<RanchMapProps> = ({ landmarks, boundaries, animals, addLandmark, addBoundary, removeFeature }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState<NewFeatureData | null>(null);
  const [name, setName] = useState('');
  const [landmarkType, setLandmarkType] = useState<LandmarkType>(LandmarkType.Other);
  const [drawnLayer, setDrawnLayer] = useState<L.Layer | null>(null);
  
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const RANCH_CENTER: Coords = [30.51, -98.39];
  const RANCH_ZOOM = 14;
  
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
      setNewFeature({ type: 'landmark', data: [lat, lng] });
    }
    if (layerType === 'polygon') {
      const latlngs = layer.getLatLngs()[0].map((p: L.LatLng) => [p.lat, p.lng]);
      setNewFeature({ type: 'boundary', data: [...latlngs, latlngs[0]] });
    }
    setIsModalOpen(true);
  }, []);
  
  // Use a ref to hold the latest removeFeature function.
  // This allows handleDelete to be stable (memoized with an empty dependency array),
  // which in turn stabilizes the onDeleted prop for DrawControl, preventing the effect from re-running.
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
  }, []); // Empty dependency array makes this callback stable.


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
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold text-brand-dark mb-6">Ranch Map</h2>
      <Card className="flex-grow p-2">
        <MapContainer center={RANCH_CENTER} zoom={RANCH_ZOOM} style={{ height: '100%', width: '100%' }} className="rounded-md">
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
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
          
          {/* Animal Markers */}
          {animals.map(animal => {
            const center = locationCenters.get(animal.location);
            if (!center) return null;

            // Add a small random offset to avoid perfect overlap
            const position: Coords = [center[0] + (Math.random() - 0.5) * 0.002, center[1] + (Math.random() - 0.5) * 0.002];

            return (
                <Marker
                    key={animal.id}
                    position={position}
                    icon={getAnimalIcon(animal.species)}
                >
                    <Popup>
                        <strong>Tag ID: {animal.tagId}</strong><br/>
                        Species: {animal.species}<br/>
                        Health: {animal.health}
                    </Popup>
                </Marker>
            );
          })}

        </MapContainer>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={resetModal} title={`Add New ${newFeature?.type === 'landmark' ? 'Landmark' : 'Boundary'}`}>
          <form onSubmit={handleModalSubmit}>
              <div className="space-y-4">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm" required />
                  </div>
                  {newFeature?.type === 'landmark' && (
                      <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Landmark Type</label>
                          <select name="type" id="type" value={landmarkType} onChange={(e) => setLandmarkType(e.target.value as LandmarkType)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-secondary focus:ring-brand-secondary sm:text-sm">
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
    </div>
  );
};
