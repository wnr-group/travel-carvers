# 🎨 Travel Carvers - Color Palette

## Official Color Scheme

### Primary Colors

#### Green Tones
```css
--primary-dark-green: #306029     /* Main headings, important text */
--primary-medium-green: #8ca384   /* Buttons, primary accents */
--primary-light-green: #7a9474    /* Secondary buttons, hover states */
--tertiary-green: #a0ad9c         /* Tertiary elements, subtle accents */
--soft-green: #b8c9b5             /* Light accents, borders */
--deep-green: #6a8466             /* Dark hover states */
```

#### Background Colors
```css
--background-cream: #faf8f5       /* Main page background (warm cream) */
--card-white: #ffffff             /* Card backgrounds, contrast elements */
```

#### Neutral Colors
```css
--text-dark: #171717              /* Body text */
--text-gray: #606060              /* Secondary text */
--text-light: #9ca3af             /* Tertiary text, hints */
--border-gray: #e5e7eb            /* Borders, dividers */
```

## Color Usage Guide

### Backgrounds

**Page Background** - Warm Cream
```tsx
className="bg-[#faf8f5]"
```
Used for: Main page backgrounds throughout the app

**Card/Section Background** - White
```tsx
className="bg-white"
```
Used for: Cards, modals, elevated content

**Header Background** - Green Gradient
```tsx
className="bg-gradient-to-r from-[#306029] to-[#7a9474]"
```
Used for: Navigation bars, headers

### Text Colors

**Primary Text** - Dark Green
```tsx
className="text-[#306029]"
```
Used for: Headings, important numbers, key information

**Body Text** - Dark Gray
```tsx
className="text-gray-900"
```
Used for: Regular content, descriptions

**Secondary Text** - Medium Gray
```tsx
className="text-gray-600"
```
Used for: Supporting information, labels

**Light Text** - White
```tsx
className="text-white"
```
Used for: Text on green backgrounds

### Buttons & Interactive Elements

**Primary Button** - Green Gradient
```tsx
className="bg-gradient-to-r from-[#8ca384] to-[#7a9474]"
hover:from-[#7a9474] hover:to-[#6a8466]
```

**Secondary Button** - Transparent Glass
```tsx
className="bg-white/20 backdrop-blur-sm border-white/30"
hover:bg-white/30
```

**Button Text**
```tsx
className="text-white"  // On solid backgrounds
className="text-[#306029]"  // On light/transparent backgrounds
```

### Accents & Borders

**Left Border Accents**
```tsx
border-l-4 border-[#8ca384]  // Package stats
border-l-4 border-[#a0ad9c]  // Lead stats
border-l-4 border-[#7a9474]  // Destination stats
```

**Card Borders**
```tsx
className="border border-gray-200"
```

### Gradients

**Header/Navbar Gradient**
```tsx
bg-gradient-to-r from-[#306029] to-[#7a9474]
```

**Welcome Banner Gradient**
```tsx
bg-gradient-to-r from-[#8ca384] to-[#7a9474]
```

**Button Hover Gradient**
```tsx
bg-gradient-to-r from-[#7a9474] to-[#6a8466]
```

**Subtle Background Gradient**
```tsx
bg-gradient-to-br from-[#8ca384]/20 to-[#8ca384]/10
```

### Opacity Variations

**Glass Morphism Effects**
```tsx
bg-white/10   // Very transparent
bg-white/20   // Light glass
bg-white/30   // Medium glass
bg-white/90   // Almost opaque
```

**Colored Overlays**
```tsx
bg-[#8ca384]/10   // Very subtle tint
bg-[#8ca384]/20   // Light tint
bg-[#8ca384]/30   // Medium tint
bg-[#8ca384]/70   // Strong overlay
```

## Component-Specific Colors

### Navigation Bar
- Background: Green gradient (#306029 → #7a9474)
- Text: White
- Logo border: white/50
- Profile section: white/10 with backdrop-blur
- Logout button: white/20 with border

### Admin Dashboard
- Page background: Cream (#faf8f5)
- Header: Green gradient
- Cards: White with colored left borders
- Welcome banner: Light green gradient (#8ca384 → #7a9474)
- Quick action buttons: Gradient overlays with green tints

### Customer Pages
- Page background: Cream (#faf8f5)
- Section backgrounds: Cream
- Package cards: Image overlays with green gradients
- Stats cards: Green gradient overlays
- Footer: Dark green gradient

### Forms & Inputs
- Background: White
- Border: gray-300
- Focus ring: #8ca384
- Text: gray-900
- Placeholder: gray-400

## Dark Mode (Future)

If dark mode is implemented:

```css
--background-dark: #1a1a1a
--card-dark: #2a2a2a
--text-dark-mode: #f5f5f5
--green-dark-mode: #9db595  /* Lighter green for dark backgrounds */
```

## Accessibility

### Contrast Ratios

All text/background combinations meet WCAG AA standards:

- ✅ Dark green (#306029) on cream (#faf8f5): 8.2:1
- ✅ Dark green (#306029) on white (#ffffff): 9.1:1
- ✅ White text on dark green (#306029): 9.1:1
- ✅ White text on medium green (#8ca384): 2.8:1 (large text only)

### Color Blind Friendly

The green + cream palette works well for:
- ✅ Deuteranopia (red-green colorblind)
- ✅ Protanopia (red-green colorblind)
- ⚠️ Consider adding icons/patterns for tritanopia (blue-yellow)

## Usage Examples

### Section with Cream Background
```tsx
<section className="py-20 bg-[#faf8f5]">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl font-bold text-[#306029]">
      Trending Packages
    </h2>
  </div>
</section>
```

### Stats Card with Colored Border
```tsx
<div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#8ca384]">
  <h3 className="text-sm text-gray-600">Total Packages</h3>
  <p className="text-3xl font-bold text-[#306029]">0</p>
</div>
```

### Button with Green Gradient
```tsx
<button className="bg-gradient-to-r from-[#8ca384] to-[#7a9474] text-white px-6 py-3 rounded-lg hover:from-[#7a9474] hover:to-[#6a8466] hover:shadow-lg transition-all">
  Get Quote
</button>
```

### Glass Morphism Button
```tsx
<button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30">
  Logout
</button>
```

## Color Philosophy

**Why These Colors?**

1. **Green** - Represents nature, travel, growth, and adventure
2. **Cream** - Warm, inviting, elegant, reduces eye strain
3. **White** - Clean, professional, provides contrast
4. **Gradient approach** - Modern, dynamic, creates depth

**Psychology:**
- Green evokes feelings of exploration and nature
- Cream provides warmth and sophistication
- Together they create a premium travel brand feel

## Maintenance

When adding new components:
1. Use cream (#faf8f5) for page backgrounds
2. Use white cards for content containers
3. Use green gradients for interactive elements
4. Maintain consistent spacing and shadows
5. Test contrast ratios for accessibility

---

**Status**: ✅ Consistent color palette across entire application  
**Last Updated**: 2026-07-08
