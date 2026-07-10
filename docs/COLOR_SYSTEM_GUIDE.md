# 🎨 COLOR SYSTEM GUIDE

**For**: Junior Developers  
**Purpose**: Learn how to use the centralized color system  
**Difficulty**: Beginner-Friendly  

---

## 🚨 GOLDEN RULE

### **NEVER HARDCODE HEX COLORS!**

❌ **WRONG**:
```tsx
<div className="bg-[#1B4D1B]">  // DON'T DO THIS!
```

✅ **CORRECT**:
```tsx
<div className="bg-brand-darkest">  // DO THIS!
```

---

## 🎨 WHY USE A CENTRALIZED COLOR SYSTEM?

### **The Problem**

Imagine you hardcode colors everywhere:

```tsx
// Component 1
<div className="bg-[#1B4D1B]">

// Component 2  
<div className="bg-[#1B4D1B]">

// Component 3
<div className="bg-[#1B4D1B]">

// ... 100 more components
```

**Client says**: "Change the green to blue!"

**You**: Have to find and change 100+ files 😰

### **The Solution**

Use centralized colors:

```tsx
// All components
<div className="bg-brand-darkest">
```

**Client says**: "Change the green to blue!"

**You**: Change 1 line in `globals.css` 😎

```css
/* Change this ONE line */
--logo-forest-dark: #1B4D4D;  /* Now it's blue! */

/* ALL components update automatically! ✨ */
```

---

## 📚 AVAILABLE COLOR CLASSES

### **Background Colors**

| Class | Color | When to Use |
|-------|-------|-------------|
| `bg-brand-darkest` | Very dark forest green | Navbar, footer, headers |
| `bg-brand-dark` | Dark forest green | Buttons, emphasis areas |
| `bg-brand-medium` | Sage green | Cards, secondary elements |
| `bg-brand-light` | Soft sage | Hover states, highlights |
| `bg-brand-lightest` | Pastel sage | Subtle backgrounds |

### **Text Colors**

| Class | When to Use |
|-------|-------------|
| `text-brand-darkest` | Main headings, important text |
| `text-brand-dark` | Subheadings, emphasis |
| `text-brand-medium` | Body text (if needed) |
| `text-brand-light` | Subtle text, hints |

### **Border Colors**

| Class | When to Use |
|-------|-------------|
| `border-brand-darkest` | Strong borders |
| `border-brand-dark` | Normal borders |
| `border-brand-medium` | Subtle borders |
| `border-brand-light` | Very subtle borders |

### **Gradient Backgrounds**

| Class | When to Use | Preview |
|-------|-------------|---------|
| `bg-gradient-brand-dark` | Buttons, CTAs | Dark → Forest |
| `bg-gradient-brand-navbar` | Navigation bars | Darkest → Sage |
| `bg-gradient-brand-primary` | Primary sections | Forest → Sage |
| `bg-gradient-brand-medium` | Cards, tiles | Sage → Sage Medium |
| `bg-gradient-brand-soft` | Subtle backgrounds | Light → Mint |

### **Background Tints**

| Class | When to Use | Effect |
|-------|-------------|--------|
| `bg-brand-tint-light` | Section backgrounds | Subtle green tint |
| `bg-brand-tint-subtle` | Alternating sections | Very subtle tint |

---

## 💡 PRACTICAL EXAMPLES

### **Example 1: Creating a Button**

❌ **Wrong Way**:
```tsx
<button className="bg-[#1B4D1B] text-white hover:bg-[#2D5F2D]">
  Click Me
</button>
```

✅ **Right Way**:
```tsx
<button className="bg-brand-darkest text-white hover:bg-brand-dark">
  Click Me
</button>
```

Or with gradient:
```tsx
<button className="bg-gradient-brand-dark text-white">
  Click Me
</button>
```

### **Example 2: Creating a Card**

❌ **Wrong Way**:
```tsx
<div className="bg-white border-2 border-[#6B8E6B]">
  <h3 className="text-[#1B4D1B]">Title</h3>
  <p className="text-[#2D5F2D]">Description</p>
</div>
```

✅ **Right Way**:
```tsx
<div className="bg-white border-2 border-brand-medium">
  <h3 className="text-brand-darkest">Title</h3>
  <p className="text-brand-dark">Description</p>
</div>
```

### **Example 3: Section with Background**

❌ **Wrong Way**:
```tsx
<section className="bg-[#C8E6C8] py-20">
  <h2 className="text-[#1B4D1B]">Featured Packages</h2>
</section>
```

✅ **Right Way**:
```tsx
<section className="bg-brand-tint-light py-20">
  <h2 className="text-brand-darkest">Featured Packages</h2>
</section>
```

### **Example 4: Navbar**

✅ **Perfect Example** (see `components/customer/Navbar.tsx`):
```tsx
<nav className="bg-gradient-brand-navbar">
  <div className="flex items-center gap-4">
    <Link href="/" className="text-white">Home</Link>
    <Link href="/packages" className="text-white">Packages</Link>
  </div>
  
  <button className="bg-white text-brand-darkest hover:bg-white/95">
    Contact Us
  </button>
</nav>
```

### **Example 5: Package Card with Overlay**

```tsx
<div className="relative h-72 rounded-2xl overflow-hidden">
  {/* Background Image */}
  <img src={packageImage} className="absolute inset-0 w-full h-full object-cover" />
  
  {/* Gradient Overlay - Use CSS variable for opacity */}
  <div className="absolute inset-0 bg-gradient-to-t from-[var(--logo-sage-medium)]/70 via-[var(--logo-sage-medium)]/30 to-transparent" />
  
  {/* Content */}
  <div className="relative z-10 p-6">
    <h3 className="text-white font-bold">Bali Paradise</h3>
    <span className="bg-brand-darkest/50 text-white px-3 py-1 rounded-full">
      Beach
    </span>
  </div>
</div>
```

---

## 🔧 ADVANCED: USING CSS VARIABLES

### **When to Use CSS Variables**

Use CSS variables when you need:
- Custom opacity
- Gradient with specific values
- Dynamic calculations

### **Available Variables**

```css
var(--logo-forest-dark)   // #1B4D1B
var(--logo-forest)        // #2D5F2D
var(--logo-sage)          // #5F7A5F
var(--logo-sage-medium)   // #6B8E6B
var(--logo-sage-light)    // #8FA88F
var(--logo-sage-soft)     // #9DB89D
var(--logo-mint)          // #B8D4B8
var(--logo-pastel)        // #C8E6C8
```

### **Example: Custom Opacity**

```tsx
// 50% opacity background
<div className="bg-[var(--logo-forest-dark)]/50">

// 80% opacity text
<p className="text-[var(--logo-sage)]/80">

// 30% opacity border
<div className="border-2 border-[var(--logo-sage-medium)]/30">
```

### **Example: Custom Gradient**

```tsx
<div className="bg-gradient-to-br from-[var(--logo-forest-dark)]/60 via-[var(--logo-sage)]/40 to-transparent">
  Content here
</div>
```

---

## 📋 DECISION FLOWCHART

```
Need to add a color?
│
├─ Simple background/text/border?
│  └─ ✅ Use utility class (.bg-brand-darkest)
│
├─ Pre-made gradient?
│  └─ ✅ Use gradient class (.bg-gradient-brand-dark)
│
├─ Need custom opacity?
│  └─ ✅ Use CSS variable (var(--logo-forest-dark)/80)
│
├─ Complex gradient?
│  └─ ✅ Use CSS variables in gradient
│
└─ Totally custom?
   └─ Ask: "Is this a pattern I'll reuse?"
      ├─ Yes → Add utility class to globals.css
      └─ No → Use CSS variables
```

---

## 🎓 EXERCISES

Try these to practice:

### **Exercise 1: Create a Hero Button**

Requirements:
- Dark gradient background
- White text
- Rounded corners
- Shadow on hover

<details>
<summary>Show Solution</summary>

```tsx
<button className="bg-gradient-brand-dark text-white rounded-full px-8 py-4 font-bold hover:shadow-2xl hover:scale-105 transition-all">
  Explore Packages
</button>
```
</details>

### **Exercise 2: Create a Feature Card**

Requirements:
- White background
- Medium sage border
- Darkest text for heading
- Dark text for description
- Light background tint

<details>
<summary>Show Solution</summary>

```tsx
<div className="bg-white border-2 border-brand-medium rounded-lg p-6 hover:shadow-lg transition-all">
  <h3 className="text-brand-darkest font-bold text-xl mb-2">
    Amazing Feature
  </h3>
  <p className="text-brand-dark">
    This is a description of the feature that uses our brand colors.
  </p>
</div>
```
</details>

### **Exercise 3: Create a Section**

Requirements:
- Subtle green tinted background
- Dark heading
- White cards inside

<details>
<summary>Show Solution</summary>

```tsx
<section className="bg-brand-tint-subtle py-20">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-brand-darkest text-4xl font-bold mb-12">
      Featured Packages
    </h2>
    
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        Card 1
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        Card 2
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        Card 3
      </div>
    </div>
  </div>
</section>
```
</details>

---

## 🐛 COMMON MISTAKES

### **Mistake 1: Hardcoding Hex**

❌ **Wrong**:
```tsx
<div className="bg-[#1B4D1B]">
```

✅ **Right**:
```tsx
<div className="bg-brand-darkest">
```

### **Mistake 2: Using Wrong Shade**

❌ **Wrong** (too light for header):
```tsx
<h1 className="text-brand-light">Main Title</h1>
```

✅ **Right**:
```tsx
<h1 className="text-brand-darkest">Main Title</h1>
```

### **Mistake 3: Not Using Gradients**

❌ **OK but not ideal**:
```tsx
<nav className="bg-brand-darkest">
```

✅ **Better** (matches design):
```tsx
<nav className="bg-gradient-brand-navbar">
```

### **Mistake 4: Inconsistent Colors**

❌ **Wrong** (mixing shades randomly):
```tsx
<div className="bg-white">
  <h2 className="text-brand-light">Title</h2>  {/* Too light! */}
  <p className="text-brand-darkest">Text</p>   {/* Too dark! */}
</div>
```

✅ **Right** (consistent hierarchy):
```tsx
<div className="bg-white">
  <h2 className="text-brand-darkest">Title</h2>  {/* Dark for heading */}
  <p className="text-brand-dark">Text</p>        {/* Slightly lighter for body */}
</div>
```

---

## 📖 REFERENCE CARD

Print this and keep at your desk!

```
┌─────────────────────────────────────────┐
│  TRAVEL CARVERS - COLOR QUICK REFERENCE │
└─────────────────────────────────────────┘

🎨 BACKGROUNDS
──────────────────────────────────────────
.bg-brand-darkest     → Very dark forest
.bg-brand-dark        → Dark forest
.bg-brand-medium      → Sage green
.bg-brand-light       → Soft sage
.bg-brand-lightest    → Pastel sage

📝 TEXT
──────────────────────────────────────────
.text-brand-darkest   → Main headings
.text-brand-dark      → Subheadings
.text-brand-medium    → Body (optional)
.text-brand-light     → Subtle text

🎨 GRADIENTS
──────────────────────────────────────────
.bg-gradient-brand-dark     → Buttons/CTAs
.bg-gradient-brand-navbar   → Navigation
.bg-gradient-brand-primary  → Sections

🌈 SUBTLE TINTS
──────────────────────────────────────────
.bg-brand-tint-light        → Section BG
.bg-brand-tint-subtle       → Alternate

🔧 CSS VARIABLES (Advanced)
──────────────────────────────────────────
var(--logo-forest-dark)     → #1B4D1B
var(--logo-forest)          → #2D5F2D
var(--logo-sage)            → #5F7A5F
var(--logo-sage-medium)     → #6B8E6B
var(--logo-sage-light)      → #8FA88F
var(--logo-sage-soft)       → #9DB89D
var(--logo-mint)            → #B8D4B8
var(--logo-pastel)          → #C8E6C8

GOLDEN RULE: Never hardcode hex colors!
            Always use utility classes or CSS variables.
```

---

## ✅ CHECKLIST

Before pushing code:

- [ ] No hardcoded hex colors (no `#1B4D1B`)
- [ ] Using utility classes where possible
- [ ] Using CSS variables for custom cases
- [ ] Colors match the design (muted sage greens)
- [ ] Tested in browser
- [ ] Colors look consistent

---

## 🆘 NEED HELP?

### **Can't find the right class?**
Check `app/globals.css` for all available classes

### **Need a custom color?**
Ask: "Will I reuse this pattern?"
- Yes → Ask senior dev to add utility class
- No → Use CSS variable

### **Colors look wrong?**
1. Check if you're using the right shade
2. View logo (`public/logo.png`) for reference
3. Compare with existing components

### **Want to add a new color?**
Don't! We only use logo colors. Talk to senior dev first.

---

**Happy coding! Remember: centralized colors = happy developers! 🎨✨**
