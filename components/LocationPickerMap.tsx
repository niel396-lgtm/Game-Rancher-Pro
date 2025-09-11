import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Coords } from '../types';
import { Modal } from './ui/Modal';

interface LocationPickerMapProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (coords: Coords) => void;
    initialCenter: Coords;
}

const LocationMarker = ({ position, setPosition }: { position: Coords | null, setPosition: (pos: Coords) => void }) => {
    const map = useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    useEffect(() => {
        if (!position) {
            map.locate().on("locationfound", function (e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                map.flyTo(e.latlng, map.getZoom());
            });
        }
    }, [map, position, setPosition]);


    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ isOpen, onClose, onLocationSelect, initialCenter }) => {
    const [position, setPosition] = useState<Coords | null>(null);

    const handleConfirm = () => {
        if (position) {
            onLocationSelect(position);
            onClose();
        } else {
            alert("Please click on the map to select a location.");
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            setPosition(null);
        }
    }, [isOpen]);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Harvest Location">
            <div className="h-96 w-full mb-4">
                 <MapContainer center={initialCenter} zoom={14} style={{ height: '100%', width: '100%' }} className="rounded-md">
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
             <div className="flex justify-between items-center">
                 <p className="text-sm text-gray-600">
                    {position ? `Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}` : "Click on the map to place a marker."}
                 </p>
                <div className="flex gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button type="button" onClick={handleConfirm} className="px-4 py-2 bg-brand-primary text-white rounded-lg">Confirm Location</button>
                </div>
             </div>
        </Modal>
    );
};
