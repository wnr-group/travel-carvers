# Hero Section - Interactive Features

## 🎨 Design Overview

The hero section is a full-screen split-view design that combines a stunning image carousel with an interactive map experience.

---

## 📱 Layout

### Default View (Split Screen)

**Left Half - Image Carousel**
- Auto-rotating image carousel (changes every 5 seconds)
- 4 stunning travel destination images
- Brand logo and tagline prominently displayed
- Current slide title and subtitle
- Two CTA buttons: "Explore Packages" and "Get Quote"
- Navigation arrows (appear on hover)
- Slide indicator dots at bottom
- Responsive design (stacks vertically on mobile)

**Right Half - Interactive Map Preview**
- Decorative preview of the world map
- Central call-to-action card with:
  - 🗺️ Map icon
  - "Interactive Map" heading
  - Description text
  - **"Tap to Interact"** button
  - Helper text
- Feature badges showing "50+ Countries" and "200+ Destinations"
- Cream background with earthy color accents

---

## ✨ Interactive Features

### 1. **Carousel Auto-Advance**
- Slides change automatically every 5 seconds
- Smooth fade transitions between images
- Pauses when user hovers over navigation

### 2. **Manual Navigation**
- **Arrow buttons**: Click left/right arrows to navigate
- **Dot indicators**: Click any dot to jump to that slide
- **Keyboard support**: Arrow keys work (optional enhancement)

### 3. **"Tap to Interact" - Map Expansion**
When user clicks the "Tap to Interact" button:
- Entire hero section transitions to show the **full interactive map**
- Smooth 700ms animation
- Map becomes full-screen
- User can:
  - Click on destination markers
  - Search for locations
  - Zoom and pan the map
  - Explore travel destinations worldwide

### 4. **Map Controls**
- **Close button**: Top-right corner (X button) to exit map view
- **ESC key**: Press Escape to close map and return to split view
- **Instruction overlay**: Animated hint showing how to interact

---

## 🎯 User Flow

1. **Landing**: User sees beautiful split-screen hero
2. **Carousel**: Images rotate automatically, showcasing destinations
3. **Curiosity**: User notices "Tap to Interact" button on right
4. **Interaction**: User clicks button
5. **Expansion**: Map smoothly expands to full screen
6. **Exploration**: User explores destinations on interactive map
7. **Return**: User clicks X or presses ESC to return to carousel view

---

## 🎨 Color Palette Used

- **Sage Dark** (#5F6F52): Primary overlays, close button
- **Sage Medium** (#A9B388): Accents, borders, CTA buttons
- **Cream** (#FEFAE0): Background for map preview section
- **Tan** (#B99470): Primary CTA button gradient
- White overlays with transparency for glass-morphism effects

---

## 📐 Responsive Design

### Desktop (md and above)
- Side-by-side split view (50/50)
- Full navigation controls visible
- Hover effects on arrows

### Tablet
- Side-by-side maintained
- Slightly smaller text and buttons

### Mobile (< md)
- Vertical stack layout
- Carousel on top (50% height)
- Map preview on bottom (50% height)
- Touch-friendly button sizes
- Simplified navigation

---

## 🔧 Technical Implementation

### Components
- **HeroSection.tsx**: Main component with state management
- **RealWorldMap**: Dynamic imported map component (client-side only)

### State Management
- `currentSlide`: Tracks active carousel slide (0-3)
- `isMapExpanded`: Boolean for map full-screen state

### Effects
1. **Auto-advance**: `useEffect` with 5-second interval
2. **Keyboard listener**: `useEffect` for ESC key detection

### Animations
- CSS transitions for smooth view changes
- Opacity and transform animations
- 700ms duration for major transitions
- Hover effects on interactive elements

---

## 🚀 Future Enhancements

1. **Carousel pause on hover**: Stop auto-advance when user hovers
2. **Touch swipe**: Swipe gestures for mobile carousel navigation
3. **Video backgrounds**: Optional video instead of static images
4. **Parallax effect**: Subtle parallax on carousel images
5. **Progress bar**: Visual timer showing slide duration
6. **Deep linking**: Share specific map destinations via URL

---

## 📝 Content Customization

### Carousel Images
Edit the `heroImages` array in `HeroSection.tsx`:

```typescript
const heroImages = [
  {
    url: 'image-url.jpg',
    title: 'Destination Name',
    subtitle: 'Short description',
  },
  // Add more slides...
];
```

### CTA Button Actions
Connect button click handlers:

```typescript
<button onClick={() => router.push('/packages')}>
  Explore Packages
</button>
```

---

## ✅ Accessibility

- Alt text on all images
- Keyboard navigation support (ESC to close)
- Clear focus indicators
- Semantic HTML structure
- ARIA labels on interactive elements
- High contrast text on images

---

## 🎬 Animation Timing

- **Carousel fade**: 1000ms
- **View transition**: 700ms
- **Button hover**: 300ms
- **Scale effects**: 200ms
- **Auto-advance interval**: 5000ms (5 seconds)

---

Visit **http://localhost:3000** to see the hero section in action!
