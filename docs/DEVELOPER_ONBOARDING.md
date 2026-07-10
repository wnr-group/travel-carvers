# 👋 Welcome to Travel Carvers - Developer Onboarding

**Project**: Travel Carvers Website  
**Tech Stack**: Next.js 16, Supabase, Tailwind CSS v4, TypeScript  
**Your Role**: Junior Developer - Day 2 Implementation  

---

## 📋 TABLE OF CONTENTS

1. [Project Setup](#project-setup)
2. [Understanding the Codebase](#understanding-the-codebase)
3. [Color System Guide](#color-system-guide)
4. [Development Workflow](#development-workflow)
5. [Day 2 Tasks](#day-2-tasks)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)
8. [Resources](#resources)

---

## 🚀 PROJECT SETUP

### **Prerequisites**

Make sure you have these installed:
- **Node.js**: v18 or higher ([Download](https://nodejs.org))
- **npm**: v9 or higher (comes with Node.js)
- **Git**: Latest version
- **VS Code**: Recommended IDE
- **Supabase CLI**: For local development

### **Step 1: Clone the Repository**

```bash
# Clone the project
git clone https://github.com/wnr-group/travel-carvers.git
cd travel-carvers

# Or if already cloned, pull latest changes
git pull origin main
```

### **Step 2: Install Dependencies**

```bash
# Install all packages
npm install

# This will install:
# - Next.js 16
# - React 19
# - Supabase client
# - Tailwind CSS v4
# - React Query
# - Zod (validation)
# - And more...
```

### **Step 3: Set Up Environment Variables**

Create `.env.local` file in the root directory:

```bash
# Copy example file
cp .env.example .env.local

# Or create manually
touch .env.local
```

Add these variables to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mailgun (Optional - for email notifications)
# MAILGUN_API_KEY=your-mailgun-api-key
# MAILGUN_DOMAIN=your-domain.com
# MAILGUN_FROM_EMAIL=noreply@your-domain.com
# ADMIN_EMAIL=info@travelcarvers.com
```

**Where to get Supabase credentials?**
1. Login to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy the values

### **Step 4: Set Up Supabase (Local Development)**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Initialize Supabase
npx supabase init

# Start local Supabase
npx supabase start

# This will start:
# - PostgreSQL database (port 54322)
# - Studio UI (http://127.0.0.1:54323)
# - APIs and Auth

# Run migrations
npx supabase db reset --local
```

### **Step 5: Run Development Server**

```bash
# Start Next.js dev server
npm run dev

# Server will start at:
# http://localhost:3000
```

### **Step 6: Verify Everything Works**

Open your browser and check:
- ✅ Homepage: http://localhost:3000
- ✅ Supabase Studio: http://127.0.0.1:54323
- ✅ No console errors
- ✅ Colors look correct (muted sage greens)

---

## 📁 UNDERSTANDING THE CODEBASE

### **Project Structure**

```
travel-globe-website/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin routes
│   │   └── admin/
│   │       ├── dashboard/        # Admin dashboard
│   │       └── login/            # Admin login
│   ├── (customer)/               # Customer-facing routes
│   │   └── page.tsx              # Homepage
│   └── globals.css              # 🎨 GLOBAL STYLES (IMPORTANT!)
│
├── components/                   # React components
│   ├── customer/
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── HeroSection.tsx      # Homepage hero
│   ├── Globe.tsx                # 3D Globe component
│   └── WorldMap.tsx             # Interactive map
│
├── lib/                         # Utilities and configurations
│   ├── api/                     # 🔥 API functions (Day 1)
│   │   ├── packages.ts          # 36 API functions
│   │   ├── categories.ts
│   │   ├── leads.ts
│   │   └── reviews.ts
│   ├── hooks/                   # 🔥 React Query hooks (Day 1)
│   │   ├── usePackages.ts       # 11 hooks
│   │   ├── useCategories.ts
│   │   ├── useLeads.ts
│   │   └── useReviews.ts
│   ├── validations/             # 🔥 Zod schemas (Day 1)
│   │   ├── package.schema.ts
│   │   ├── lead.schema.ts
│   │   ├── review.schema.ts
│   │   └── category.schema.ts
│   ├── email/                   # Email service
│   │   └── mailgun.ts
│   ├── supabase/                # Supabase clients
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server client
│   └── redux/                   # State management (if needed)
│
├── supabase/                    # 🔥 Database (Day 1)
│   ├── migrations/              # Database migrations
│   │   ├── 20240711000001_initial_schema.sql    (21 tables)
│   │   ├── 20240711000002_enable_rls.sql        (Security)
│   │   └── 20240711000003_create_storage_buckets.sql (Storage)
│   └── seed.sql                 # Initial data (18 rows)
│
├── public/                      # Static assets
│   └── logo.png                 # 🎨 Brand logo (color reference)
│
├── docs/                        # 📚 Documentation (YOU ARE HERE!)
│   ├── DEVELOPER_ONBOARDING.md  # This file
│   ├── COLOR_SYSTEM_GUIDE.md    # How to use colors
│   └── DAY2_TASKS.md            # Day 2 task breakdown
│
├── .env.local                   # Environment variables (DO NOT COMMIT)
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
└── next.config.js              # Next.js config
```

### **Key Concepts**

#### **1. Next.js 16 App Router**
- File-based routing
- Server Components by default
- Client Components with `'use client'`

#### **2. Supabase**
- PostgreSQL database
- Built-in authentication
- Row Level Security (RLS)
- Storage buckets for images

#### **3. Tailwind CSS v4**
- Utility-first CSS
- No config file (uses CSS)
- Custom utilities in `globals.css`

#### **4. TypeScript**
- Type-safe code
- Better IDE support
- Fewer bugs

---

## 🎨 COLOR SYSTEM GUIDE

### **🚨 IMPORTANT: CENTRALIZED COLOR SYSTEM**

**This is the MOST IMPORTANT thing to understand!**

All colors are managed in **ONE FILE**: `app/globals.css`

### **Why This Matters**

❌ **DON'T DO THIS** (hardcoded colors):
```tsx
<div className="bg-[#1B4D1B] text-[#FFFFFF]">
  <h1 className="text-[#2D5F2D]">Title</h1>
</div>
```

✅ **DO THIS** (centralized colors):
```tsx
<div className="bg-brand-darkest text-white">
  <h1 className="text-brand-dark">Title</h1>
</div>
```

### **Available Color Classes**

#### **Background Colors**
```tsx
<div className="bg-brand-darkest">   // Very dark forest green
<div className="bg-brand-dark">      // Dark forest green
<div className="bg-brand-medium">    // Sage green
<div className="bg-brand-light">     // Soft sage
<div className="bg-brand-lightest">  // Pastel sage
```

#### **Text Colors**
```tsx
<h1 className="text-brand-darkest">  // Very dark text
<h2 className="text-brand-dark">     // Dark text
<p className="text-brand-medium">    // Medium text
<span className="text-brand-light">  // Light text
```

#### **Gradient Backgrounds**
```tsx
<nav className="bg-gradient-brand-navbar">    // Navbar gradient
<button className="bg-gradient-brand-dark">   // Dark button gradient
<div className="bg-gradient-brand-primary">   // Primary gradient
```

#### **Subtle Background Tints**
```tsx
<section className="bg-brand-tint-light">    // Light green tint
<section className="bg-brand-tint-subtle">   // Very subtle tint
```

### **Using CSS Variables**

For custom cases (like opacity):
```tsx
// 80% opacity dark forest
<div className="bg-[var(--logo-forest-dark)]/80">

// Gradient with variables
<div className="bg-gradient-to-r from-[var(--logo-forest-dark)] to-[var(--logo-sage)]">
```

### **Available CSS Variables**

```css
var(--logo-forest-dark)   // #1B4D1B - Darkest
var(--logo-forest)        // #2D5F2D - Dark
var(--logo-sage)          // #5F7A5F - Medium sage
var(--logo-sage-medium)   // #6B8E6B - Sage
var(--logo-sage-light)    // #8FA88F - Light sage
var(--logo-sage-soft)     // #9DB89D - Soft sage
var(--logo-mint)          // #B8D4B8 - Mint
var(--logo-pastel)        // #C8E6C8 - Pastel
```

### **Quick Reference Card**

```
QUICK COLOR REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 BRAND COLORS (Muted Sage Greens)
━━━━━━━━━━━━━━━━━━━━━━━━━━

.bg-brand-darkest     → Very dark forest (#1B4D1B)
.bg-brand-dark        → Dark forest (#2D5F2D)
.bg-brand-medium      → Sage green (#6B8E6B)
.bg-brand-light       → Soft sage (#9DB89D)
.bg-brand-lightest    → Pastel (#C8E6C8)

GRADIENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━

.bg-gradient-brand-dark      → Dark gradient
.bg-gradient-brand-navbar    → Navbar gradient
.bg-gradient-brand-primary   → Primary gradient

REMEMBER: Never hardcode hex values!
         Always use utility classes or CSS variables
```

### **Examples from Existing Code**

**Navbar**:
```tsx
<nav className="bg-gradient-brand-navbar">
  <button className="text-brand-darkest">Contact</button>
</nav>
```

**Hero Section**:
```tsx
<button className="bg-gradient-brand-dark text-white">
  Explore Packages
</button>
```

**Package Cards**:
```tsx
<div className="bg-white">
  <h3 className="text-brand-darkest">Bali Paradise</h3>
  <span className="bg-brand-darkest/50 text-white">
    Beach
  </span>
</div>
```

---

## 🔄 DEVELOPMENT WORKFLOW

### **Daily Workflow**

1. **Start Local Services**
```bash
# Terminal 1: Start Supabase
npx supabase start

# Terminal 2: Start Next.js
npm run dev
```

2. **Make Changes**
- Edit components
- Test in browser
- Check console for errors

3. **Test Your Changes**
```bash
# Type check
npm run build

# Check formatting (if eslint configured)
npm run lint
```

4. **Commit Your Work**
```bash
git add .
git commit -m "feat: Add admin dashboard"
git push origin your-branch
```

### **Branch Strategy**

```bash
# Create feature branch
git checkout -b feature/admin-dashboard

# Work on your branch
# ... make changes ...

# Push to remote
git push origin feature/admin-dashboard

# Create PR on GitHub
```

### **Code Style**

- Use TypeScript
- Use functional components
- Use Tailwind classes (no inline styles)
- Use centralized colors
- Comment complex logic
- Keep components small

---

## 📋 DAY 2 TASKS

### **What's Already Done (Day 1)** ✅

1. ✅ Database schema (21 tables)
2. ✅ RLS security policies
3. ✅ Storage buckets (4 buckets)
4. ✅ API functions (36 functions)
5. ✅ React Query hooks (11 hooks)
6. ✅ Validation schemas (Zod)
7. ✅ Email service setup
8. ✅ Seed data
9. ✅ Homepage UI
10. ✅ Centralized color system

### **Day 2: Admin Panel Development** 🚀

Your tasks for Day 2:

#### **Task 1: Admin Authentication UI**
- Login page improvements
- Protected route middleware
- Session management
- Logout functionality

#### **Task 2: Package Management**
- Package list page
- Create package form (9 tabs)
- Edit package form
- Delete package with confirmation

#### **Task 3: Image Upload Components**
- Single image uploader
- Multiple image uploader
- Image preview
- Upload to Supabase storage

#### **Task 4: Form Components**
- Text input
- Textarea
- Select dropdown
- Date picker
- Rich text editor (for descriptions)

#### **Task 5: Data Tables**
- Packages table
- Categories table
- Leads table
- Reviews table
- Sorting and filtering

See `docs/DAY2_TASKS.md` for detailed breakdown!

---

## 🎯 COMMON PATTERNS

### **1. Creating a New Component**

```tsx
// components/admin/PackageCard.tsx
'use client';

export default function PackageCard({ title, price }: { title: string; price: number }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-brand-darkest font-bold text-xl">{title}</h3>
      <p className="text-brand-dark mt-2">₹{price}</p>
    </div>
  );
}
```

### **2. Using API Functions**

```tsx
// In a Server Component (no 'use client')
import { getPublishedPackages } from '@/lib/api/packages';

export default async function PackagesPage() {
  const packages = await getPublishedPackages();
  
  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>{pkg.title}</div>
      ))}
    </div>
  );
}
```

### **3. Using React Query Hooks**

```tsx
// In a Client Component ('use client')
'use client';

import { usePackages } from '@/lib/hooks/usePackages';

export default function PackagesList() {
  const { data: packages, isLoading, error } = usePackages();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading packages</div>;

  return (
    <div>
      {packages?.map(pkg => (
        <div key={pkg.id}>{pkg.title}</div>
      ))}
    </div>
  );
}
```

### **4. Form with Validation**

```tsx
'use client';

import { packageSchema } from '@/lib/validations/package.schema';
import { useState } from 'react';

export default function PackageForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate with Zod
      const validated = packageSchema.parse(formData);
      // Submit validated data
      console.log('Valid data:', validated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors);
      }
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### **5. Image Upload**

```tsx
'use client';

import { supabase } from '@/lib/supabase/client';

async function uploadImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `packages/${fileName}`;

  const { data, error } = await supabase
    .storage
    .from('package-images')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('package-images')
    .getPublicUrl(filePath);

  return publicUrl;
}
```

---

## 🐛 TROUBLESHOOTING

### **Server Won't Start**

```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start again
npm run dev
```

### **Supabase Connection Issues**

```bash
# Check if Supabase is running
npx supabase status

# Restart if needed
npx supabase stop
npx supabase start
```

### **Environment Variables Not Working**

```bash
# Make sure .env.local exists
ls -la .env.local

# Restart dev server after changing .env.local
# Stop with Ctrl+C, then:
npm run dev
```

### **TypeScript Errors**

```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### **Database Migration Issues**

```bash
# Reset local database
npx supabase db reset --local

# This will:
# - Drop all tables
# - Re-run all migrations
# - Run seed data
```

### **Colors Not Working**

Check:
1. Are you using utility classes? (`bg-brand-darkest`)
2. Or CSS variables? (`var(--logo-forest-dark)`)
3. NOT hardcoded hex? (NO `#1B4D1B`)

---

## 📚 RESOURCES

### **Official Docs**
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)

### **Project Docs**
- `docs/COLOR_SYSTEM_GUIDE.md` - Complete color guide
- `docs/DAY2_TASKS.md` - Detailed task breakdown
- `CENTRALIZED_COLOR_SYSTEM.md` - Color system architecture
- `LOGO_COLOR_ANALYSIS.md` - Logo color reference

### **Code Examples**
- `components/customer/Navbar.tsx` - Example component
- `components/customer/HeroSection.tsx` - Complex component
- `lib/api/packages.ts` - API functions example
- `lib/hooks/usePackages.ts` - React Query example

### **Helpful Commands**

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Supabase
npx supabase start      # Start local Supabase
npx supabase stop       # Stop local Supabase
npx supabase status     # Check status
npx supabase db reset   # Reset database

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to remote

# Debugging
npm run build           # Type check
npx tsc --noEmit       # Type check only
```

---

## 🎯 YOUR FIRST TASK

### **Get Started in 5 Minutes**

1. **Setup Project** (follow steps above)
2. **Run Locally** (`npm run dev`)
3. **Explore Code** (check `components/` folder)
4. **Read** `docs/COLOR_SYSTEM_GUIDE.md`
5. **Read** `docs/DAY2_TASKS.md`
6. **Start** with Task 1 (Admin UI improvements)

### **Questions?**

- Check docs first
- Ask senior developer
- Search codebase for examples
- Use TypeScript hints in VS Code

---

## ✅ CHECKLIST

Before starting Day 2:

- [ ] Project cloned and setup
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] Supabase running (`npx supabase start`)
- [ ] Dev server running (`npm run dev`)
- [ ] Homepage loads at http://localhost:3000
- [ ] Colors look correct (muted sage greens)
- [ ] Read `COLOR_SYSTEM_GUIDE.md`
- [ ] Read `DAY2_TASKS.md`
- [ ] Understand folder structure
- [ ] Know how to use color classes
- [ ] Know how to use API functions
- [ ] Know how to use React Query hooks

---

**Welcome to the team! Let's build something amazing! 🚀**

**Questions?** Ask anytime!  
**Stuck?** Check the docs or ask for help!  
**Ready?** Let's start Day 2! 🎉
