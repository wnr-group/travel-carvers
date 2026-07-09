'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl').then(mod => mod.default), { ssr: false }) as any;

interface TouristLocation {
  name: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  region: string;
  labelColor: string;
}

const touristLocations: TouristLocation[] = [
  // Seven Wonders of the World - Special highlighting
  { name: 'Great Wall of China ⭐', lat: 40.4319, lng: 116.5704, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },
  { name: 'Petra, Jordan ⭐', lat: 30.3285, lng: 35.4444, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },
  { name: 'Christ the Redeemer ⭐', lat: -22.9519, lng: -43.2105, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },
  { name: 'Machu Picchu ⭐', lat: -13.1631, lng: -72.5450, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },
  { name: 'Chichen Itza ⭐', lat: 20.6843, lng: -88.5678, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },
  { name: 'Colosseum, Rome ⭐', lat: 41.8902, lng: 12.4922, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },
  { name: 'Taj Mahal ⭐', lat: 27.1751, lng: 78.0421, size: 0.8, color: '#ffd700', region: 'Seven Wonders', labelColor: '#ffd700' },

  // Europe
  { name: 'Paris', lat: 48.8584, lng: 2.2945, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Barcelona', lat: 41.4036, lng: 2.1744, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'London', lat: 51.5007, lng: -0.1246, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Santorini', lat: 36.3932, lng: 25.4615, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Bavaria', lat: 47.5576, lng: 10.7498, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Amsterdam', lat: 52.3752, lng: 4.8840, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Prague', lat: 50.0865, lng: 14.4114, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Interlaken', lat: 46.8182, lng: 8.2275, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },
  { name: 'Athens', lat: 37.9715, lng: 23.7267, size: 0.5, color: '#ff8a80', region: 'Europe', labelColor: '#ffffff' },

  // Asia (Other Countries)
  { name: 'Fujinomiya', lat: 35.3606, lng: 138.7274, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Siem Reap', lat: 13.4125, lng: 103.8670, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Kuala Lumpur', lat: 3.1578, lng: 101.7117, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Singapore', lat: 1.2838, lng: 103.8607, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Dubai', lat: 25.1972, lng: 55.2744, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Bangkok', lat: 13.7500, lng: 100.4917, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Bali', lat: -8.5069, lng: 115.2625, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Ha Long Bay', lat: 20.9101, lng: 107.1839, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Tokyo', lat: 35.6586, lng: 139.7454, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },
  { name: 'Xicheng', lat: 39.9163, lng: 116.3972, size: 0.5, color: '#ff8a80', region: 'Asia', labelColor: '#ffffff' },

  // India - North
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Rishikesh', lat: 30.0869, lng: 78.2676, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Shimla', lat: 31.1048, lng: 77.1734, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Manali', lat: 32.2396, lng: 77.1887, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Leh', lat: 34.1526, lng: 77.5771, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Udaipur', lat: 24.5854, lng: 73.7125, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },

  // India - South
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Munnar', lat: 10.0889, lng: 77.0595, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Mysore', lat: 12.2958, lng: 76.6394, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Pondicherry', lat: 11.9416, lng: 79.8083, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Hampi', lat: 15.3350, lng: 76.4600, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Coorg', lat: 12.3375, lng: 75.8069, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },

  // India - West
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Goa', lat: 15.2993, lng: 74.1240, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Ajanta Caves', lat: 20.5519, lng: 75.7033, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Rann of Kutch', lat: 23.7337, lng: 69.8597, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },

  // India - East
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Darjeeling', lat: 27.0410, lng: 88.2663, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Puri', lat: 19.8135, lng: 85.8312, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Gangtok', lat: 27.3389, lng: 88.6065, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Kaziranga', lat: 26.5775, lng: 93.1711, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },

  // India - Central
  { name: 'Khajuraho', lat: 24.8318, lng: 79.9199, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, size: 0.5, color: '#ff8a80', region: 'India', labelColor: '#ffffff' },
];

export default function GlobeComponent() {
  const globeEl = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<TouristLocation | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (globeEl.current) {
      // Start with very close view (small globe) - centered on India
      globeEl.current.pointOfView({ altitude: 0.5, lat: 20.5937, lng: 78.9629 });

      // Enable auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;

      // Brighten the scene significantly
      const scene = globeEl.current.scene();
      if (scene) {
        scene.children.forEach((child: any) => {
          if (child.type === 'DirectionalLight') {
            child.intensity = 2.5;
          }
          if (child.type === 'AmbientLight') {
            child.intensity = 2.0;
          }
        });

        // Find and brighten the globe material
        scene.traverse((object: any) => {
          if (object.isMesh && object.material) {
            if (object.material.map) {
              // Increase emissive light to brighten oceans
              object.material.emissive = { r: 0.3, g: 0.3, b: 0.4 };
              object.material.emissiveIntensity = 0.3;
              object.material.needsUpdate = true;
            }
          }
        });
      }

      // Animate to normal view (growing effect) - keeping India centered
      setTimeout(() => {
        globeEl.current.pointOfView(
          { altitude: 2.5, lat: 20.5937, lng: 78.9629 },
          2000 // 2 second animation
        );
        setIsLoaded(true);
      }, 100);

      // Center the globe properly
      const handleResize = () => {
        if (globeEl.current) {
          globeEl.current.camera().aspect = window.innerWidth / window.innerHeight;
          globeEl.current.camera().updateProjectionMatrix();
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;

    const controls = globeEl.current.controls();

    const handleInteractionStart = () => {
      controls.autoRotate = false;
      setAutoRotate(false);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };

    const handleInteractionEnd = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      inactivityTimer.current = setTimeout(() => {
        if (!selectedLocation) {
          controls.autoRotate = true;
          setAutoRotate(true);
        }
      }, 5000);
    };

    controls.addEventListener('start', handleInteractionStart);
    controls.addEventListener('end', handleInteractionEnd);

    return () => {
      controls.removeEventListener('start', handleInteractionStart);
      controls.removeEventListener('end', handleInteractionEnd);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [selectedLocation]);

  const handlePointClick = (point: TouristLocation) => {
    setSelectedLocation(point);

    // Zoom to location
    if (globeEl.current) {
      globeEl.current.pointOfView(
        {
          lat: point.lat,
          lng: point.lng,
          altitude: 0.8,
        },
        2000 // Animation duration in ms
      );

      // Disable auto-rotate during zoom
      globeEl.current.controls().autoRotate = false;
      setAutoRotate(false);

      // Clear selected location after 8 seconds but don't zoom out
      // User can manually zoom out or click elsewhere
      setTimeout(() => {
        setSelectedLocation(null);
      }, 8000);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-white text-xl">Loading Globe...</div>
        </div>
      )}
      <div className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-30'}`}>
        <Globe
          ref={globeEl}
          globeImageUrl="https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png"
          atmosphereColor="#88ccff"
          atmosphereAltitude={0.15}
          backgroundColor="rgba(255,255,255,0)"
          pointsData={touristLocations}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.01}
          pointRadius="size"
          pointLabel="name"
          onPointClick={handlePointClick}
          pointsMerge={false}
          labelsData={selectedLocation ? [selectedLocation] : touristLocations}
          labelLat="lat"
          labelLng="lng"
          labelText="name"
          labelSize={selectedLocation ? 1.2 : 0.5}
          labelDotRadius={0.3}
          labelColor={(d: any) => d.labelColor}
          labelResolution={2}
          width={typeof window !== 'undefined' ? window.innerWidth : 1200}
          height={typeof window !== 'undefined' ? window.innerHeight : 800}
        />
      </div>

      {selectedLocation && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-10 py-5 rounded-xl shadow-2xl border border-orange-200 z-20">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900">{selectedLocation.name}</h2>
          <p className="text-orange-700 mt-2 text-base md:text-lg font-medium">{selectedLocation.region}</p>
        </div>
      )}

      {/* Tagline at top center */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10 px-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
          Discover Your Next Adventure
        </h1>
      </div>

      {/* Logo */}
      <div className="absolute top-20 left-6 z-20">
        <div className="relative">
          {/* Main Logo Text */}
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-4xl font-black italic bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent tracking-tight leading-none">
              Travel
            </h2>
            <div className="flex items-center gap-2 -mt-1">
              <div className="h-0.5 w-8 bg-gradient-to-r from-amber-400 to-transparent"></div>
              <h3 className="text-2xl md:text-3xl font-light text-white tracking-[0.2em] uppercase">
                CARVERS
              </h3>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 blur-xl bg-amber-400/20 -z-10 scale-110"></div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10 px-4">
        <p className="text-base md:text-xl text-purple-200 font-medium drop-shadow-lg">
          Explore destinations around the world
        </p>
      </div>
    </div>
  );
}
