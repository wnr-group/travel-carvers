# Implementation Guide: Adding City-Level Markers

This guide explains how to add tourist attractions and city markers that appear when users zoom into a country.

## Step 1: Create City/Attraction Data Structure

Add a new data structure to store cities and attractions for each country:

```typescript
interface Attraction {
  name: string;
  description: string;
  lat: number;
  lng: number;
  image?: string;
  type: 'city' | 'landmark' | 'beach' | 'mountain';
}

interface CountryWithAttractions extends Country {
  attractions: Attraction[];
}

const countriesData: CountryWithAttractions[] = [
  {
    name: 'France',
    lat: 46.2276,
    lng: 2.2137,
    attractions: [
      {
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower',
        lat: 48.8584,
        lng: 2.2945,
        type: 'landmark'
      },
      {
        name: 'Louvre Museum',
        description: 'World\'s largest art museum',
        lat: 48.8606,
        lng: 2.3376,
        type: 'landmark'
      },
      // Add more attractions...
    ]
  },
  // Add more countries...
];
```

## Step 2: Create Attraction Markers Component

Create a new component that shows attraction markers when zoomed in:

```typescript
function AttractionMarkers({ 
  country, 
  isVisible, 
  onAttractionClick 
}: { 
  country: CountryWithAttractions | null;
  isVisible: boolean;
  onAttractionClick: (attraction: Attraction) => void;
}) {
  if (!country || !isVisible) return null;

  return (
    <>
      {country.attractions.map((attraction) => {
        const position = latLngToVector3(attraction.lat, attraction.lng, 2.05);
        
        // Different colors for different types
        const colors = {
          city: '#4CAF50',
          landmark: '#FF9800',
          beach: '#03A9F4',
          mountain: '#9C27B0'
        };

        return (
          <mesh
            key={attraction.name}
            position={position}
            onClick={(e) => {
              e.stopPropagation();
              onAttractionClick(attraction);
            }}
          >
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial
              color={colors[attraction.type]}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </>
  );
}
```

## Step 3: Update Zoom Logic

Modify the Globe component to show/hide attraction markers based on zoom level:

```typescript
export default function Globe() {
  const [selectedCountry, setSelectedCountry] = useState<CountryWithAttractions | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showAttractions, setShowAttractions] = useState(false);
  const { camera } = useThree();

  useFrame(() => {
    // Show attractions when camera is close enough
    if (camera.position.z < 3.2 && selectedCountry) {
      setShowAttractions(true);
    } else {
      setShowAttractions(false);
    }
  });

  const handleCountryClick = (country: CountryWithAttractions) => {
    setSelectedCountry(country);
    setSelectedAttraction(null);
    setTimeout(() => {
      setSelectedCountry(null);
    }, 8000); // Longer timeout to explore attractions
  };

  const handleAttractionClick = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
  };

  return (
    // ... existing JSX
    <AttractionMarkers
      country={selectedCountry}
      isVisible={showAttractions}
      onAttractionClick={handleAttractionClick}
    />
  );
}
```

## Step 4: Create Attraction Info Card

Add a detailed info card when an attraction is selected:

```typescript
{selectedAttraction && (
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-10 py-6 rounded-xl shadow-2xl border border-gray-200 max-w-lg">
    <div className="flex items-start gap-4">
      {selectedAttraction.image && (
        <img 
          src={selectedAttraction.image} 
          alt={selectedAttraction.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
      )}
      <div>
        <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded-full mb-2">
          {selectedAttraction.type}
        </span>
        <h3 className="text-2xl font-bold text-gray-800">
          {selectedAttraction.name}
        </h3>
        <p className="text-gray-600 mt-1">
          {selectedAttraction.description}
        </p>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          View Packages
        </button>
      </div>
    </div>
  </div>
)}
```

## Step 5: Add Deeper Zoom for Attractions

Update the zoom logic to zoom even closer when an attraction is clicked:

```typescript
useEffect(() => {
  if (selectedAttraction) {
    const targetPosition = latLngToVector3(
      selectedAttraction.lat, 
      selectedAttraction.lng, 
      2
    );
    
    // Calculate rotation to face the attraction
    // ... rotation logic
    
    // Zoom to 2.2 (very close) for attraction view
    setTargetZoom(2.2);
  } else if (selectedCountry) {
    setTargetZoom(2.8); // Medium zoom for country
  } else {
    setTargetZoom(5); // Default zoom out
  }
}, [selectedAttraction, selectedCountry]);
```

## Step 6: Add Smooth Transitions

Use lerp for smooth camera and marker transitions:

```typescript
useFrame(() => {
  if (meshRef.current) {
    // Smooth zoom
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZoom,
      0.04
    );
    
    // Fade in attraction markers
    const attractionOpacity = THREE.MathUtils.lerp(
      currentOpacity,
      showAttractions ? 1 : 0,
      0.1
    );
  }
});
```

## Example: Complete France Data

```typescript
{
  name: 'France',
  lat: 46.2276,
  lng: 2.2137,
  attractions: [
    {
      name: 'Eiffel Tower',
      description: 'Iconic 324-meter iron tower, symbol of Paris',
      lat: 48.8584,
      lng: 2.2945,
      type: 'landmark',
      image: '/images/eiffel-tower.jpg'
    },
    {
      name: 'Louvre Museum',
      description: 'World\'s largest art museum and historic monument',
      lat: 48.8606,
      lng: 2.3376,
      type: 'landmark',
      image: '/images/louvre.jpg'
    },
    {
      name: 'Mont Saint-Michel',
      description: 'Tidal island with medieval abbey',
      lat: 48.6361,
      lng: -1.5115,
      type: 'landmark',
      image: '/images/mont-saint-michel.jpg'
    },
    {
      name: 'French Riviera',
      description: 'Beautiful Mediterranean coastline',
      lat: 43.7102,
      lng: 7.2620,
      type: 'beach',
      image: '/images/french-riviera.jpg'
    },
    {
      name: 'Paris',
      description: 'Capital city, center of culture and romance',
      lat: 48.8566,
      lng: 2.3522,
      type: 'city',
      image: '/images/paris.jpg'
    }
  ]
}
```

## Tips for Better UX

1. **Progressive Detail**: Show fewer details when far away, more when zoomed in
2. **Marker Clustering**: Group nearby attractions when zoomed out
3. **Filter Controls**: Add buttons to filter by attraction type (cities, landmarks, beaches, etc.)
4. **Search**: Add search bar to quickly find specific attractions
5. **Breadcrumbs**: Show navigation path (World > France > Paris > Eiffel Tower)
6. **Animation Timing**: Adjust delays so users have time to explore before auto zoom-out
7. **Loading States**: Show loading indicator while fetching attraction data
8. **Error Handling**: Graceful fallback if attraction images fail to load

## Performance Considerations

- Lazy load attraction data only when country is selected
- Use texture atlases for marker icons
- Implement marker LOD (Level of Detail) based on camera distance
- Debounce zoom calculations
- Use `useMemo` for complex calculations
- Consider virtualizing markers if there are hundreds per country
