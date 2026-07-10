/**
 * Seed Initial Data for Travel Carvers
 * Run with: npx tsx scripts/seed-initial.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding database...\n');

  // 1. Categories
  console.log('Creating categories...');
  const categories = [
    { name: 'Beach', slug: 'beach', description: 'Tropical beach destinations', icon_name: 'umbrella-beach', display_order: 1 },
    { name: 'Mountain', slug: 'mountain', description: 'Mountain and hill stations', icon_name: 'mountain', display_order: 2 },
    { name: 'Adventure', slug: 'adventure', description: 'Adventure and trekking tours', icon_name: 'hiking', display_order: 3 },
    { name: 'Cultural', slug: 'cultural', description: 'Cultural and heritage tours', icon_name: 'landmark', display_order: 4 },
    { name: 'Wildlife', slug: 'wildlife', description: 'Wildlife safaris and nature tours', icon_name: 'paw', display_order: 5 },
  ];

  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .insert(categories)
    .select();

  if (catError) {
    console.error('❌ Error creating categories:', catError);
  } else {
    console.log(`✅ Created ${insertedCategories.length} categories`);
  }

  // 2. Subcategories
  console.log('\nCreating subcategories...');
  const subcategories = [
    { name: 'Honeymoon', slug: 'honeymoon', icon_name: 'heart', display_order: 1 },
    { name: 'Family', slug: 'family', icon_name: 'users', display_order: 2 },
    { name: 'Budget', slug: 'budget', icon_name: 'dollar', display_order: 3 },
    { name: 'Luxury', slug: 'luxury', icon_name: 'crown', display_order: 4 },
    { name: 'Group', slug: 'group', icon_name: 'user-group', display_order: 5 },
  ];

  const { data: insertedSubcats, error: subcatError } = await supabase
    .from('subcategories')
    .insert(subcategories)
    .select();

  if (subcatError) {
    console.error('❌ Error creating subcategories:', subcatError);
  } else {
    console.log(`✅ Created ${insertedSubcats.length} subcategories`);
  }

  // 3. Homepage Sections
  console.log('\nCreating homepage sections...');
  const homepageData = {
    hero_title: 'Explore the World with Travel Carvers',
    hero_subtitle: 'Discover amazing destinations and create unforgettable memories',
    hero_cta_text: 'Browse Packages',
    featured_title: 'Featured Destinations',
    featured_description: 'Hand-picked destinations for an unforgettable experience',
    trending_title: 'Trending Now',
    trending_description: 'Most popular packages chosen by travelers',
  };

  const { error: homeError } = await supabase
    .from('homepage_sections')
    .insert(homepageData);

  if (homeError) {
    console.error('❌ Error creating homepage sections:', homeError);
  } else {
    console.log('✅ Created homepage sections');
  }

  // 4. Trust Badges
  console.log('\nCreating trust badges...');
  const trustBadges = [
    { text: '10,000+ Happy Travelers', icon: '😊', display_order: 1 },
    { text: '100+ Destinations', icon: '🌍', display_order: 2 },
    { text: '24/7 Support', icon: '💬', display_order: 3 },
    { text: 'Best Price Guarantee', icon: '💰', display_order: 4 },
  ];

  const { error: badgeError } = await supabase
    .from('trust_badges')
    .insert(trustBadges);

  if (badgeError) {
    console.error('❌ Error creating trust badges:', badgeError);
  } else {
    console.log(`✅ Created ${trustBadges.length} trust badges`);
  }

  // 5. Site Settings
  console.log('\nCreating site settings...');
  const siteSettings = {
    company_name: 'Travel Carvers',
    contact_email: 'info@travelcarvers.com',
    contact_phone: '+919876543210',
    address: '123 Travel Street, Adventure City, India',
    show_prices_globally: true,
    facebook_url: 'https://facebook.com/travelcarvers',
    instagram_url: 'https://instagram.com/travelcarvers',
    twitter_url: 'https://twitter.com/travelcarvers',
    linkedin_url: 'https://linkedin.com/company/travelcarvers',
  };

  const { error: settingsError } = await supabase
    .from('site_settings')
    .insert(siteSettings);

  if (settingsError) {
    console.error('❌ Error creating site settings:', settingsError);
  } else {
    console.log('✅ Created site settings');
  }

  // 6. Static Pages
  console.log('\nCreating static pages...');
  const staticPages = [
    {
      page_key: 'about',
      title: 'About Us',
      content: '<h1>About Travel Carvers</h1><p>We are passionate about creating unforgettable travel experiences...</p>',
      meta_title: 'About Us - Travel Carvers',
      meta_description: 'Learn more about Travel Carvers and our mission to create amazing travel experiences',
      is_active: true,
    },
    {
      page_key: 'contact',
      title: 'Contact Us',
      content: '<h1>Contact Us</h1><p>Get in touch with our travel experts...</p>',
      meta_title: 'Contact Us - Travel Carvers',
      meta_description: 'Contact Travel Carvers for inquiries and bookings',
      is_active: true,
    },
  ];

  const { error: pagesError } = await supabase
    .from('static_pages')
    .insert(staticPages);

  if (pagesError) {
    console.error('❌ Error creating static pages:', pagesError);
  } else {
    console.log(`✅ Created ${staticPages.length} static pages`);
  }

  console.log('\n✨ Seeding complete!');
  console.log('\n📊 Summary:');
  console.log('   - 5 Categories');
  console.log('   - 5 Subcategories');
  console.log('   - Homepage sections');
  console.log('   - 4 Trust badges');
  console.log('   - Site settings');
  console.log('   - 2 Static pages');
  console.log('\n✅ Database is ready for use!');
}

seed().catch((error) => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});
