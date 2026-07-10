# 📋 DAY 2 TASKS - Admin Panel Development

**Goal**: Build a functional admin panel for Travel Carvers  
**Duration**: 1 Day  
**Difficulty**: Intermediate  

---

## 🎯 OVERVIEW

Day 2 focuses on building the admin panel where administrators can:
- Manage packages (Create, Read, Update, Delete)
- Manage categories
- View and respond to leads
- Approve/reject reviews
- Upload images

---

## ✅ WHAT'S ALREADY DONE (Day 1)

You don't need to build these:

- ✅ Database schema (21 tables)
- ✅ API functions (36 functions in `lib/api/`)
- ✅ React Query hooks (11 hooks in `lib/hooks/`)
- ✅ Validation schemas (Zod in `lib/validations/`)
- ✅ Storage buckets (4 buckets for images)
- ✅ Authentication (Supabase Auth)
- ✅ Color system (Centralized in `globals.css`)

**You can USE all of these!** Just import and use them.

---

## 📋 TASKS BREAKDOWN

### **Task 1: Admin Dashboard** 🏠

**File**: `app/(admin)/admin/dashboard/page.tsx`

**What to Build**:
- Overview stats (total packages, leads, reviews)
- Recent activity feed
- Quick actions (Create package, View leads)
- Charts (if time permits)

**Example Code**:
```tsx
'use client';

import { usePackages } from '@/lib/hooks/usePackages';

export default function AdminDashboard() {
  const { data: packages } = usePackages();
  
  return (
    <div className="p-8">
      <h1 className="text-brand-darkest text-3xl font-bold mb-8">
        Dashboard
      </h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-brand-dark text-sm font-semibold">Total Packages</h3>
          <p className="text-brand-darkest text-3xl font-bold mt-2">
            {packages?.length || 0}
          </p>
        </div>
        {/* More stats... */}
      </div>
    </div>
  );
}
```

**Time Estimate**: 2 hours

---

### **Task 2: Package List Page** 📦

**File**: `app/(admin)/admin/packages/page.tsx`

**What to Build**:
- Table showing all packages
- Columns: Image, Title, Status, Price, Actions
- Search/filter functionality
- Edit and Delete buttons

**Use**: `usePackages()` hook from Day 1

**Example Code**:
```tsx
'use client';

import { usePackages } from '@/lib/hooks/usePackages';

export default function PackagesPage() {
  const { data: packages, isLoading } = usePackages();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-brand-darkest text-3xl font-bold">Packages</h1>
        <button className="bg-gradient-brand-dark text-white px-6 py-3 rounded-lg">
          Create Package
        </button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-brand-darkest text-white">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages?.map(pkg => (
              <tr key={pkg.id} className="border-b">
                <td className="px-6 py-4">{pkg.title}</td>
                <td className="px-6 py-4">{pkg.status}</td>
                <td className="px-6 py-4">₹{pkg.price_adult}</td>
                <td className="px-6 py-4">
                  <button className="text-brand-dark hover:underline mr-4">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Time Estimate**: 3 hours

---

### **Task 3: Image Upload Component** 📸

**File**: `components/admin/ImageUpload.tsx`

**What to Build**:
- File input with drag-and-drop
- Image preview
- Upload to Supabase storage
- Progress indicator
- Error handling

**Use**: Supabase storage (already configured)

**Example Code**:
```tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ImageUpload({ bucket, onUpload }: { 
  bucket: string; 
  onUpload: (url: string) => void 
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="mb-4"
      />
      
      {preview && (
        <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
      )}
      
      {uploading && <p className="text-brand-dark">Uploading...</p>}
    </div>
  );
}
```

**Storage Buckets Available**:
- `package-images` - Main package images
- `itinerary-images` - Itinerary day images
- `hotel-images` - Hotel photos
- `category-images` - Category icons

**Time Estimate**: 2 hours

---

### **Task 4: Create Package Form** 📝

**File**: `app/(admin)/admin/packages/create/page.tsx`

**What to Build**:
- Multi-step form (9 tabs)
  1. Basic Info (title, slug, description)
  2. Pricing (adult, child, infant prices)
  3. Duration (days, nights)
  4. Gallery (images upload)
  5. Videos (video URLs)
  6. Itinerary (day-by-day plan)
  7. Inclusions (what's included)
  8. Stay Details (hotels)
  9. Additional Info (tips, best time)

**Use**:
- `packageSchema` from `lib/validations/package.schema.ts`
- API function (create one using server action)

**Example Structure**:
```tsx
'use client';

import { useState } from 'react';
import { packageSchema } from '@/lib/validations/package.schema';

export default function CreatePackagePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const tabs = [
    'Basic Info',
    'Pricing',
    'Duration',
    'Gallery',
    'Videos',
    'Itinerary',
    'Inclusions',
    'Stay Details',
    'Additional Info'
  ];

  const handleSubmit = async () => {
    try {
      // Validate with Zod
      const validated = packageSchema.parse(formData);
      
      // Submit to API
      const response = await fetch('/api/packages', {
        method: 'POST',
        body: JSON.stringify(validated),
      });
      
      if (response.ok) {
        alert('Package created!');
        // Redirect to packages list
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(err.flatten().fieldErrors);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-brand-darkest text-3xl font-bold mb-8">
        Create Package
      </h1>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
              activeTab === index
                ? 'bg-brand-darkest text-white'
                : 'bg-white text-brand-dark border-2 border-brand-medium'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Form Content */}
      <div className="bg-white rounded-lg p-8 shadow-lg">
        {activeTab === 0 && <BasicInfoTab formData={formData} setFormData={setFormData} />}
        {activeTab === 1 && <PricingTab formData={formData} setFormData={setFormData} />}
        {/* ... other tabs */}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className="bg-brand-medium text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        
        {activeTab < tabs.length - 1 ? (
          <button
            onClick={() => setActiveTab(activeTab + 1)}
            className="bg-brand-darkest text-white px-6 py-3 rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-gradient-brand-dark text-white px-8 py-3 rounded-lg font-bold"
          >
            Create Package
          </button>
        )}
      </div>
    </div>
  );
}

function BasicInfoTab({ formData, setFormData }) {
  return (
    <div>
      <div className="mb-6">
        <label className="block text-brand-darkest font-semibold mb-2">
          Package Title *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border-2 border-brand-medium rounded-lg focus:border-brand-dark outline-none"
          placeholder="e.g., Bali Paradise - 7 Days"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-brand-darkest font-semibold mb-2">
          Slug *
        </label>
        <input
          type="text"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-3 border-2 border-brand-medium rounded-lg focus:border-brand-dark outline-none"
          placeholder="bali-paradise-7-days"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-brand-darkest font-semibold mb-2">
          Short Description *
        </label>
        <textarea
          value={formData.short_description || ''}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border-2 border-brand-medium rounded-lg focus:border-brand-dark outline-none"
          placeholder="A brief description (max 200 characters)"
        />
      </div>
      
      {/* More fields... */}
    </div>
  );
}
```

**Time Estimate**: 6-8 hours (largest task)

---

### **Task 5: Leads Management** 📧

**File**: `app/(admin)/admin/leads/page.tsx`

**What to Build**:
- Table of all leads
- Filter by status (new, contacted, converted)
- View lead details
- Update status
- Send email (if Mailgun configured)

**Use**: Create API functions for leads

**Example**:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllLeads } from '@/lib/api/leads';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const data = await getAllLeads();
    setLeads(data);
  }

  const filteredLeads = filter === 'all'
    ? leads
    : leads.filter(lead => lead.status === filter);

  return (
    <div className="p-8">
      <h1 className="text-brand-darkest text-3xl font-bold mb-8">
        Leads
      </h1>
      
      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-brand-darkest text-white'
              : 'bg-white text-brand-dark border-2 border-brand-medium'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-6 py-2 rounded-lg ${
            filter === 'new'
              ? 'bg-brand-darkest text-white'
              : 'bg-white text-brand-dark border-2 border-brand-medium'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setFilter('contacted')}
          className={`px-6 py-2 rounded-lg ${
            filter === 'contacted'
              ? 'bg-brand-darkest text-white'
              : 'bg-white text-brand-dark border-2 border-brand-medium'
          }`}
        >
          Contacted
        </button>
      </div>
      
      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-brand-darkest text-white">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Package</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="border-b hover:bg-brand-tint-subtle">
                <td className="px-6 py-4">{lead.name}</td>
                <td className="px-6 py-4">{lead.email}</td>
                <td className="px-6 py-4">{lead.packages?.title || 'General'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-brand-dark hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Time Estimate**: 2-3 hours

---

### **Task 6: Reviews Management** ⭐

**File**: `app/(admin)/admin/reviews/page.tsx`

**What to Build**:
- List of all reviews
- Filter by approved/pending/rejected
- Approve/reject buttons
- Delete review

**Use**: Create API functions for reviews

**Similar to Leads page** - table with actions

**Time Estimate**: 2 hours

---

## 🛠️ RECOMMENDED COMPONENT STRUCTURE

Create these reusable components:

```
components/admin/
├── Layout.tsx                # Admin layout with sidebar
├── Sidebar.tsx              # Navigation sidebar
├── DataTable.tsx            # Reusable table component
├── ImageUpload.tsx          # Image upload component
├── FormInput.tsx            # Styled input
├── FormTextarea.tsx         # Styled textarea
├── FormSelect.tsx           # Styled select
├── Button.tsx               # Styled button
├── Modal.tsx                # Modal dialog
├── ConfirmDialog.tsx        # Confirmation dialog
└── StatusBadge.tsx          # Status badge component
```

---

## 📝 TIPS & BEST PRACTICES

### **1. Use Existing Hooks**

Don't fetch data manually. Use the hooks:
```tsx
// ✅ Good
import { usePackages } from '@/lib/hooks/usePackages';
const { data, isLoading, error } = usePackages();

// ❌ Bad
const [data, setData] = useState([]);
useEffect(() => { fetch(...) }, []);
```

### **2. Use Color System**

Always use centralized colors:
```tsx
// ✅ Good
<button className="bg-brand-darkest text-white">

// ❌ Bad
<button className="bg-[#1B4D1B] text-white">
```

### **3. Handle Loading States**

```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

### **4. Use TypeScript**

```tsx
interface Package {
  id: string;
  title: string;
  price_adult: number;
}

function PackageCard({ package: pkg }: { package: Package }) {
  // TypeScript ensures safety
}
```

### **5. Validate Forms**

```tsx
import { packageSchema } from '@/lib/validations/package.schema';

try {
  const validated = packageSchema.parse(formData);
  // Safe to submit
} catch (err) {
  // Handle validation errors
}
```

---

## ⏱️ TIME ESTIMATES

| Task | Time | Priority |
|------|------|----------|
| Dashboard | 2h | Medium |
| Package List | 3h | High |
| Image Upload | 2h | High |
| Create Package Form | 6-8h | High |
| Leads Management | 2-3h | Medium |
| Reviews Management | 2h | Low |
| **Total** | **17-20 hours** | **~3 work days** |

**Realistic Day 2**: Focus on high-priority tasks first:
1. Package List (3h)
2. Image Upload (2h)
3. Start Create Package Form (3-4h)

---

## ✅ DEFINITION OF DONE

For each task, it's complete when:

- [ ] Component renders without errors
- [ ] Uses centralized colors
- [ ] TypeScript has no errors
- [ ] Data loads correctly
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Responsive (works on mobile)
- [ ] Tested in browser
- [ ] Code is clean and commented

---

## 🐛 COMMON ISSUES

### **Issue 1: Data Not Loading**

```tsx
// Check:
1. Is Supabase running? (npx supabase status)
2. Are you using the right hook?
3. Is the data in the database? (Check Supabase Studio)
```

### **Issue 2: Form Not Submitting**

```tsx
// Check:
1. Is validation passing? (console.log errors)
2. Are you preventing default? (e.preventDefault())
3. Is the API route correct?
```

### **Issue 3: Images Not Uploading**

```tsx
// Check:
1. Is the bucket name correct?
2. Do you have write permissions? (Check RLS policies)
3. Is the file size under 5MB?
4. Is the file type allowed? (jpg, png, webp)
```

---

## 📚 RESOURCES

**Code Examples**:
- See `components/customer/` for component patterns
- See `lib/api/` for API usage
- See `lib/hooks/` for React Query patterns

**Documentation**:
- `docs/COLOR_SYSTEM_GUIDE.md` - Color usage
- `docs/DEVELOPER_ONBOARDING.md` - Setup guide
- `CENTRALIZED_COLOR_SYSTEM.md` - Color architecture

**Official Docs**:
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## 🎯 START HERE

**Step 1**: Read this file completely  
**Step 2**: Read `COLOR_SYSTEM_GUIDE.md`  
**Step 3**: Explore existing components  
**Step 4**: Start with Package List (easiest)  
**Step 5**: Build Image Upload  
**Step 6**: Tackle Create Package Form  

**Questions?** Ask your senior developer!

**Good luck! You've got this! 💪🚀**
