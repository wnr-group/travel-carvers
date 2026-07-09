# Travel Carvers - Design System

## Color Palette

Our brand colors create an earthy, natural feel that represents adventure and exploration.

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Sage Dark** | `#5F6F52` | Primary dark green - Headers, important text, dark backgrounds |
| **Sage Medium** | `#A9B388` | Primary medium green - Buttons, accents, cards |
| **Cream** | `#FEFAE0` | Light cream - Main backgrounds, light sections |
| **Tan** | `#B99470` | Warm tan/brown - Accents, highlights, CTAs |

### Color Variables (CSS)

```css
:root {
  /* Brand Colors */
  --color-sage-dark: #5F6F52;
  --color-sage-medium: #A9B388;
  --color-cream: #FEFAE0;
  --color-tan: #B99470;
  
  /* Semantic Colors */
  --background: #FEFAE0;
  --foreground: #171717;
  --primary: #5F6F52;
  --secondary: #A9B388;
  --accent: #B99470;
}
```

### Tailwind CSS Classes

Use these utility classes throughout the application:

#### Backgrounds
- `bg-[#5F6F52]` - Sage dark background
- `bg-[#A9B388]` - Sage medium background
- `bg-[#FEFAE0]` - Cream background
- `bg-[#B99470]` - Tan background

#### Gradients
- `from-[#5F6F52] to-[#A9B388]` - Primary gradient
- `from-[#A9B388] to-[#5F6F52]` - Reverse primary gradient
- `from-[#B99470] to-[#A9B388]` - Warm accent gradient

#### Text
- `text-[#5F6F52]` - Sage dark text
- `text-[#A9B388]` - Sage medium text
- `text-[#B99470]` - Tan text

#### Borders
- `border-[#5F6F52]` - Sage dark border
- `border-[#A9B388]` - Sage medium border
- `border-[#B99470]` - Tan border

## Typography

- **Headlines**: Bold, clear, using Sage Dark (#5F6F52)
- **Body Text**: Standard weight, dark gray (#171717)
- **Accents**: Tan (#B99470) for important highlights

## Component Examples

### Buttons
```tsx
// Primary Button
<button className="bg-gradient-to-r from-[#5F6F52] to-[#A9B388] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
  Get Started
</button>

// Secondary Button
<button className="bg-[#B99470] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
  Learn More
</button>
```

### Cards
```tsx
<div className="bg-white border-2 border-[#A9B388]/20 rounded-2xl p-6 hover:shadow-xl transition-all">
  <h3 className="text-2xl font-bold text-[#5F6F52] mb-4">Card Title</h3>
  <p className="text-gray-700">Card content goes here</p>
</div>
```

### Navigation
```tsx
<nav className="bg-gradient-to-r from-[#5F6F52] to-[#A9B388] shadow-lg">
  <Link className="text-white hover:text-white/80 transition-colors">
    Menu Item
  </Link>
</nav>
```

## Usage Guidelines

1. **Primary Actions**: Use Sage Dark (#5F6F52) or gradients with Sage Medium
2. **Backgrounds**: Default to Cream (#FEFAE0) for main sections
3. **Accents & Highlights**: Use Tan (#B99470) sparingly for important elements
4. **Hover States**: Add opacity or darken by 10-15%
5. **Shadows**: Use colored shadows with low opacity for depth

## Accessibility

- All color combinations meet WCAG AA standards for contrast
- Text on Sage Dark uses white (#FFFFFF) for maximum readability
- Text on Cream uses dark gray (#171717) for comfortable reading
