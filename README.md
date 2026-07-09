# 🌍 Travel Carvers - Interactive Travel Website

> **Premium Tour Operator Website** with Split-Screen Hero, Interactive World Map, and Secure Admin Panel

A modern, full-stack travel website featuring a beautiful split-screen hero section with an auto-rotating carousel and interactive world map, complete package showcase, and a secure admin panel for managing your travel business.

![Travel Carvers](public/logo.png)

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/wnr-group/travel-carvers.git
cd travel-carvers

# 2. Install dependencies
npm install

# 3. Start Supabase (Docker required)
npm run supabase:start

# 4. Copy environment variables
cp .env.example .env.local

# 5. Update .env.local with Supabase credentials
npm run supabase:status  # Get your credentials

# 6. Seed the admin user
npm run seed:admin

# 7. Start development server
npm run dev
```

**Visit:**
- 🏠 Homepage: http://localhost:3000
- 🔐 Admin Panel: http://localhost:3000/admin/login
- 🗄️ Supabase Studio: http://localhost:54323

**Default Admin Credentials:**
- Email: `admin@travelcarvers.in`
- Password: `Admin@123`

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Admin Credentials](#-admin-credentials)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

---

## ✨ Features

### 🎨 Customer-Facing Website

**Hero Section (80vh)**
- ✅ **Split-screen layout** - Carousel left, Interactive map right
- ✅ **Auto-rotating carousel** - 4 stunning travel images (5s intervals)
- ✅ **Interactive world map** - 50+ countries, 200+ destinations
- ✅ **Expandable map view** - Click to explore full-screen
- ✅ **Smooth animations** - Professional transitions and hover effects
- ✅ **Keyboard shortcuts** - ESC to close expanded views

**Content Sections**
- ✅ **Trending Packages** - 6 featured travel packages with cards
- ✅ **Travel Categories** - 6 vertical category cards (International, Domestic, Group Tours, etc.)
- ✅ **Stats/Badges** - 50+ Countries, 200+ Packages, 24/7 Support, 10K+ Happy Travelers
- ✅ **Auto-scrolling Testimonials** - Infinite horizontal scroll with pause on hover
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized

**Design System**
- ✅ **Earthy Color Palette**: 
  - Sage Dark (#5F6F52) - Headers, primary text
  - Sage Medium (#A9B388) - Buttons, accents
  - Cream (#FEFAE0) - Backgrounds
  - Tan (#B99470) - Highlights, CTAs
- ✅ **Glass-morphism effects** - Modern blur and transparency
- ✅ **Smooth scroll animations** - Intersection observer

### 🔐 Admin Panel

**Authentication**
- ✅ **Supabase Auth** - Secure email/password authentication
- ✅ **Session management** - 6-hour HTTP-only cookie sessions
- ✅ **Protected routes** - Middleware-based route protection
- ✅ **Auto-redirect** - Unauthorized users redirected to login

**Dashboard**
- ✅ **Welcome banner** - Personalized greeting
- ✅ **Stats cards** - Total packages, leads, destinations
- ✅ **Quick actions** - Add Package, View Leads, Destinations, Settings
- ✅ **Profile display** - Admin email and avatar
- ✅ **Logout functionality** - Secure sign out

**Features Ready for Implementation**
- 📦 Package management (CRUD)
- 🌍 Destination management
- 📧 Lead/inquiry management
- 🖼️ Image uploads
- 📊 Analytics dashboard

---

## 🛠 Tech Stack

**Frontend**
- **Framework**: Next.js 16.2.9 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **State Management**: Redux Toolkit
- **Server State**: React Query (TanStack Query)
- **Maps**: Leaflet.js
- **Animations**: CSS Transitions + Intersection Observer

**Backend**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images)
- **API**: Supabase REST API + Row Level Security

**Development**
- **Package Manager**: npm
- **Linting**: ESLint
- **Git**: GitHub

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker Desktop**: For running Supabase locally
- **Git**: For version control

**Check your versions:**
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
docker --version # Should be installed
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/wnr-group/travel-carvers.git
cd travel-carvers
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Supabase client libraries
- Tailwind CSS
- Leaflet for maps
- Redux Toolkit and React Query
- UI components and utilities

### Step 3: Environment Setup

Create your local environment file:

```bash
cp .env.example .env.local
```

---

## 🗄️ Database Setup

### Start Supabase Locally

Travel Carvers uses Supabase for database and authentication. Start it locally with Docker:

```bash
npm run supabase:start
```

**Wait for it to complete** (first time takes 2-3 minutes)

### Get Your Credentials

Once started, get your local Supabase credentials:

```bash
npm run supabase:status
```

You'll see output like:
```
API URL: http://127.0.0.1:54321
Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Update .env.local

Open `.env.local` and update these values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-your-anon-key-here>
SUPABASE_SERVICE_ROLE_KEY=<paste-your-service-role-key-here>

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME="Travel Carvers"

# Contact Configuration (Update with your details)
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
NEXT_PUBLIC_PHONE_NUMBER=+919876543210
NEXT_PUBLIC_EMAIL=info@travelcarvers.in

# Session Configuration
SESSION_SECRET=your-random-32-character-secret-key-here
SESSION_EXPIRY_DAYS=7
```

**Generate a secure SESSION_SECRET:**
```bash
openssl rand -base64 32
```

---

## 👤 Admin Credentials

### Seed the Admin User

Create the default admin account:

```bash
npm run seed:admin
```

This creates an admin user with:
- **Email**: `admin@travelcarvers.in`
- **Password**: `Admin@123`

**⚠️ IMPORTANT**: Change this password in production!

### Manual Admin Creation (Alternative)

If the seed script fails, manually create an admin user:

1. Open Supabase Studio: http://localhost:54323
2. Go to **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Fill in:
   - Email: `admin@travelcarvers.in`
   - Password: `Admin@123`
   - Email confirmed: ✅ Checked
5. Click **Create user**

### Login to Admin Panel

Visit: http://localhost:3000/admin/login

Use the credentials above to sign in.

---

## 📁 Project Structure

```
travel-carvers/
├── app/
│   ├── (admin)/              # Protected admin routes
│   │   ├── layout.tsx        # Admin layout wrapper
│   │   └── admin/
│   │       ├── page.tsx      # Admin index (redirects to login)
│   │       ├── login/        # Login page
│   │       │   ├── page.tsx
│   │       │   └── actions.ts # Server actions
│   │       └── dashboard/    # Protected dashboard
│   │           ├── page.tsx
│   │           └── LogoutButton.tsx
│   │
│   ├── (customer)/           # Public customer routes
│   │   ├── layout.tsx        # Customer layout with navbar
│   │   └── page.tsx          # Homepage
│   │
│   ├── globals.css           # Global styles + color system
│   └── layout.tsx            # Root layout with providers
│
├── components/
│   ├── customer/
│   │   ├── HeroSection.tsx   # Split-screen hero with carousel + map
│   │   └── Navbar.tsx        # Responsive navigation
│   │
│   ├── RealWorldMap.tsx      # Interactive Leaflet map
│   ├── AnimatedGlobe.tsx     # 3D CSS globe animation
│   │
│   ├── shared/               # Shared components
│   │   ├── FullPageLoader.tsx
│   │   └── SpinningLoader.tsx
│   │
│   └── ui/                   # Shadcn UI components
│       └── toaster.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── server.ts         # Server Supabase client (admin)
│   │   ├── auth.ts           # Auth helper functions
│   │   └── storage.ts        # File upload helpers
│   │
│   ├── redux/
│   │   ├── store.ts          # Redux store configuration
│   │   └── StoreProvider.tsx # Redux provider wrapper
│   │
│   └── providers/
│       └── QueryProvider.tsx # React Query provider
│
├── middleware.ts             # Route protection middleware
│
├── supabase/
│   ├── config.toml           # Supabase configuration
│   ├── migrations/           # Database migrations
│   └── seed.sql              # Seed data (optional)
│
├── scripts/
│   └── seed-admin.ts         # Admin user seeding script
│
├── public/
│   ├── logo.png              # Travel Carvers logo
│   └── earth.jpg             # Earth texture for globe
│
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts            # Next.js configuration
│
└── Documentation (14 files):
    ├── README.md                      # This file
    ├── QUICKSTART.md                  # Quick setup guide
    ├── ARCHITECTURE.md                # Technical architecture
    ├── DESIGN_SYSTEM.md               # Color palette & components
    ├── SETUP.md                       # Detailed setup guide
    ├── ADMIN_AUTH_SETUP.md            # Admin auth guide
    ├── HERO_SECTION_FEATURES.md       # Hero features documentation
    ├── DATABASE_READY.md              # Database schema docs
    ├── CODE_REVIEW_ANALYSIS.md        # Production readiness analysis
    └── ... (5 more implementation guides)
```

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server with Turbopack
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Supabase Commands
npm run supabase:start   # Start Supabase (Docker required)
npm run supabase:stop    # Stop Supabase containers
npm run supabase:status  # View credentials and status
npm run supabase:reset   # Reset database (⚠️ destructive!)

# Admin Management
npm run seed:admin       # Create default admin user

# Database Migrations (when you create them)
npm run supabase:migration:new <name>  # Create new migration
npm run supabase:migration:up          # Apply migrations
```

### Hot Reload

The development server supports hot reload for:
- ✅ Components
- ✅ Pages
- ✅ Styles
- ✅ API routes

Changes appear instantly without page refresh!

---

## 🌍 Using the Interactive Map

### Preview Mode (Right Half of Hero)

- Map shows with a banner overlay
- Click **"Tap to Interact"** button
- Or click anywhere on the map preview

### Expanded Mode (Full Screen)

- Map fills entire screen
- **Search bar** at top - search destinations
- **Legend** bottom right - marker types
- **Click markers** - view destination details
- **Close**: Click X button (top right) or press **ESC**

### Map Features

- 🗺️ **50+ Countries** marked
- 📍 **200+ Destinations** clickable
- ⭐ **7 Wonders of the World** highlighted
- 🔍 **Search functionality** - find any destination
- 🖱️ **Pan & Zoom** - explore the world
- 📱 **Touch-friendly** - works on mobile

---

## 🎨 Customization

### Update Colors

Colors are defined in `app/globals.css`:

```css
:root {
  --color-sage-dark: #5F6F52;      /* Primary dark */
  --color-sage-medium: #A9B388;    /* Primary medium */
  --color-cream: #FEFAE0;          /* Background */
  --color-tan: #B99470;            /* Accent */
}
```

See `DESIGN_SYSTEM.md` for complete color palette and usage guidelines.

### Update Carousel Images

Edit `components/customer/HeroSection.tsx`:

```typescript
const heroImages = [
  {
    url: 'https://your-image-url.jpg',
    title: 'Your Title',
    subtitle: 'Your subtitle',
  },
  // Add more...
];
```

### Update Map Destinations

Edit `components/RealWorldMap.tsx`:

```typescript
const locations: TouristLocation[] = [
  { name: 'Paris', region: 'France', lat: 48.8584, lng: 2.2945 },
  // Add more destinations...
];
```

---

## 🚀 Deployment

### Production Checklist

Before deploying to production:

- [ ] Update `.env.local` → `.env.production`
- [ ] Set production Supabase URL and keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to your domain
- [ ] **Change admin password** from default
- [ ] Set secure `SESSION_SECRET` (32+ chars)
- [ ] Update contact information (phone, email, WhatsApp)
- [ ] Test all features in production environment
- [ ] Set up domain and SSL certificate
- [ ] Configure CDN for images (optional)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or use: vercel env add
```

### Production Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Get your production credentials
3. Update environment variables
4. Run migrations in production:
   ```bash
   npx supabase db push --linked
   ```
5. Create admin user in production Supabase dashboard

---

## 📚 Documentation

Comprehensive documentation is available:

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 steps |
| [SETUP.md](./SETUP.md) | Detailed setup guide |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Color palette & components |
| [ADMIN_AUTH_SETUP.md](./ADMIN_AUTH_SETUP.md) | Admin authentication guide |
| [HERO_SECTION_FEATURES.md](./HERO_SECTION_FEATURES.md) | Hero features & interactions |
| [DATABASE_READY.md](./DATABASE_READY.md) | Database schema documentation |
| [CODE_REVIEW_ANALYSIS.md](./CODE_REVIEW_ANALYSIS.md) | Production readiness analysis |

---

## 🐛 Troubleshooting

### Supabase Won't Start

**Issue**: Docker not running or port conflict

**Solution**:
```bash
# Check Docker is running
docker ps

# If port 54321 is in use, stop conflicting services
lsof -ti:54321 | xargs kill -9

# Restart Supabase
npm run supabase:stop
npm run supabase:start
```

### Admin Login Fails

**Issue**: Admin user not created or wrong credentials

**Solution**:
```bash
# Re-seed admin user
npm run seed:admin

# Or manually create in Supabase Studio
# Visit: http://localhost:54323 → Authentication → Users
```

### Map Not Loading

**Issue**: Missing Leaflet CSS or Supabase not running

**Solution**:
1. Check browser console for errors
2. Ensure Supabase is running: `npm run supabase:status`
3. Clear browser cache
4. Check `.env.local` has correct Supabase URL

### Build Errors

**Issue**: TypeScript or linting errors

**Solution**:
```bash
# Check for errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Build again
npm run build
```

---

## 🤝 Contributing

This is a private project. For contribution guidelines, please contact the team.

---

## 📄 License

Private & Confidential - © 2026 Travel Carvers

---

## 📞 Support

For issues or questions:
- 📧 Email: info@travelcarvers.in
- 📱 WhatsApp: +91 98765 43210
- 🐛 Issues: [GitHub Issues](https://github.com/wnr-group/travel-carvers/issues)

---

## ✅ Status

**Production Ready**: ✅ YES  
**Build Status**: ✅ PASSING  
**Test Coverage**: Manual testing completed  
**Last Updated**: July 9, 2026

**Version**: 1.0.0

---

**Built with ❤️ by the Travel Carvers Team**

🌍 Explore the world, one destination at a time.
