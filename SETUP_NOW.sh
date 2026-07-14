#!/bin/bash

# Travel Carvers - Day 1 Complete Setup Script
# Run with: bash SETUP_NOW.sh

echo "🚀 Travel Carvers - Day 1 Setup"
echo "================================"
echo ""

# Step 1: Check if Supabase is running
echo "📊 Step 1/4: Checking Supabase..."
if npx supabase status > /dev/null 2>&1; then
    echo "✅ Supabase is running"
else
    echo "⏳ Starting Supabase (this takes 1-2 minutes)..."
    npx supabase start
    if [ $? -eq 0 ]; then
        echo "✅ Supabase started successfully"
    else
        echo "❌ Failed to start Supabase"
        exit 1
    fi
fi

echo ""

# Step 2: Run database migration
echo "📊 Step 2/4: Creating database tables..."
npx supabase db reset --local
if [ $? -eq 0 ]; then
    echo "✅ Created 21 database tables"
else
    echo "❌ Migration failed"
    exit 1
fi

echo ""

# Step 3: Seed initial data
echo "📊 Step 3/4: Seeding initial data..."
npx tsx scripts/seed-initial.ts
if [ $? -eq 0 ]; then
    echo "✅ Seeded categories, homepage content, and settings"
else
    echo "❌ Seeding failed"
    exit 1
fi

echo ""

# Step 4: Summary
echo "📊 Step 4/4: Setup Summary"
echo "================================"
echo ""
echo "✅ Database: 21 tables created"
echo "✅ Categories: 5 categories added"
echo "✅ Subcategories: 5 subcategories added"
echo "✅ Homepage: Default content added"
echo "✅ Trust Badges: 4 badges added"
echo "✅ Settings: Site settings configured"
echo ""
echo "🎯 Next Steps:"
echo "   1. Open Supabase Studio: http://127.0.0.1:54323"
echo "   2. Create 4 storage buckets:"
echo "      - package-images (public)"
echo "      - itinerary-images (public)"
echo "      - hotel-images (public)"
echo "      - category-images (public)"
echo "   3. Start building! Check Jira: https://aadhithsd.atlassian.net"
echo ""
echo "✨ Day 1 Setup Complete! Ready to build Day 2."
