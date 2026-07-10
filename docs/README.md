# 📚 Travel Carvers - Documentation

Welcome to the Travel Carvers documentation! Start here to understand the project and begin development.

---

## 🚀 QUICK START

**New to the project?** Read these files in order:

1. **[DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md)** 
   - Complete project setup guide
   - How to run locally
   - Understanding the codebase

2. **[COLOR_SYSTEM_GUIDE.md](./COLOR_SYSTEM_GUIDE.md)**
   - How to use the centralized color system
   - Examples and best practices
   - Common mistakes to avoid

3. **[DAY2_TASKS.md](./DAY2_TASKS.md)**
   - Day 2 task breakdown
   - Admin panel development
   - Code examples

---

## 📖 DOCUMENTATION INDEX

| File | Purpose | Audience |
|------|---------|----------|
| **DEVELOPER_ONBOARDING.md** | Complete onboarding guide | New developers |
| **COLOR_SYSTEM_GUIDE.md** | How to use colors | All developers |
| **DAY2_TASKS.md** | Admin panel tasks | Junior devs (Day 2) |

---

## 🎯 FOR JUNIOR DEVELOPERS

**Starting Day 2?** Follow this path:

```
Step 1: Setup Project
└─ Read: DEVELOPER_ONBOARDING.md (Section: Project Setup)

Step 2: Understand Colors  
└─ Read: COLOR_SYSTEM_GUIDE.md (Complete file)

Step 3: Start Building
└─ Read: DAY2_TASKS.md (Task breakdown)

Step 4: Code!
└─ Start with Task 1 (Package List)
```

---

## 🎨 COLOR SYSTEM TL;DR

**Golden Rule**: Never hardcode hex colors!

```tsx
// ❌ Wrong
<div className="bg-[#1B4D1B]">

// ✅ Right
<div className="bg-brand-darkest">
```

**Available Classes**:
- `bg-brand-darkest` / `text-brand-darkest` - Very dark forest
- `bg-brand-dark` / `text-brand-dark` - Dark forest
- `bg-brand-medium` / `text-brand-medium` - Sage green
- `bg-brand-light` / `text-brand-light` - Soft sage
- `bg-gradient-brand-dark` - Button gradient
- `bg-gradient-brand-navbar` - Navbar gradient

See [COLOR_SYSTEM_GUIDE.md](./COLOR_SYSTEM_GUIDE.md) for complete reference.

---

## 🏗️ PROJECT STRUCTURE

```
travel-globe-website/
├── app/                  # Next.js App Router
│   ├── (admin)/         # Admin routes
│   ├── (customer)/      # Customer routes
│   └── globals.css      # 🎨 COLOR SYSTEM (Important!)
│
├── components/          # React components
│   ├── customer/       # Customer-facing components
│   └── admin/          # Admin components (Day 2)
│
├── lib/                # Utilities
│   ├── api/           # 36 API functions ✅
│   ├── hooks/         # 11 React Query hooks ✅
│   ├── validations/   # Zod schemas ✅
│   ├── email/         # Email service ✅
│   └── supabase/      # Database clients ✅
│
├── supabase/          # Database
│   ├── migrations/    # 3 migration files ✅
│   └── seed.sql       # Initial data ✅
│
└── docs/              # 📚 YOU ARE HERE!
    ├── README.md                      # This file
    ├── DEVELOPER_ONBOARDING.md        # Setup guide
    ├── COLOR_SYSTEM_GUIDE.md          # Color usage
    └── DAY2_TASKS.md                  # Day 2 tasks
```

---

## ✅ WHAT'S DONE (Day 1)

- ✅ Database (21 tables + RLS + storage)
- ✅ API Functions (36 functions)
- ✅ React Query Hooks (11 hooks)
- ✅ Validation Schemas (Zod)
- ✅ Email Service (Mailgun)
- ✅ Color System (Centralized)
- ✅ Homepage UI
- ✅ Authentication

**You can use all of these!** Just import and use.

---

## 🎯 WHAT'S NEXT (Day 2)

Admin panel development:
1. Package management (CRUD)
2. Image upload components
3. Leads management
4. Reviews management

See [DAY2_TASKS.md](./DAY2_TASKS.md) for details.

---

## 🆘 NEED HELP?

### **Setup Issues?**
→ See [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md#troubleshooting)

### **Color Questions?**
→ See [COLOR_SYSTEM_GUIDE.md](./COLOR_SYSTEM_GUIDE.md)

### **Task Unclear?**
→ See [DAY2_TASKS.md](./DAY2_TASKS.md)

### **Still Stuck?**
→ Ask your senior developer!

---

## 📝 CHEAT SHEET

### **Start Development**
```bash
npx supabase start    # Start database
npm run dev           # Start Next.js
```

### **Common Commands**
```bash
npm run build         # Type check
npx supabase status   # Check database
git status            # Check changes
```

### **Color Classes**
```tsx
bg-brand-darkest      # Very dark
bg-brand-dark         # Dark
bg-brand-medium       # Medium
bg-brand-light        # Light
text-brand-darkest    # Dark text
bg-gradient-brand-dark # Gradient
```

### **Import Hooks**
```tsx
import { usePackages } from '@/lib/hooks/usePackages';
import { useCategories } from '@/lib/hooks/useCategories';
```

### **Import API**
```tsx
import { getPublishedPackages } from '@/lib/api/packages';
import { getAllLeads } from '@/lib/api/leads';
```

---

## 🎉 WELCOME TO THE TEAM!

**Remember**:
- Ask questions when stuck
- Use centralized colors
- Follow existing patterns
- Have fun coding!

**Let's build something amazing! 🚀**
