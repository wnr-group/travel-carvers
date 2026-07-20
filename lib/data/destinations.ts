import type { TravelPackage } from '@/lib/packageList';

export interface DestinationDetail {
  name: string;
  slug: string;
  country: string;
  timezone: string;
  currency: string;
  languages: string;
  description: string;
  packages: [TravelPackage, TravelPackage];
}

const CREATED_AT = Date.UTC(2024, 0, 1);

function demoPackage(
  partial: Partial<TravelPackage> & Pick<TravelPackage, 'id' | 'name' | 'slug' | 'location'>,
): TravelPackage {
  return {
    description: '',
    categories: [],
    price: 0,
    durationDays: 0,
    difficulty: null,
    rating: 0,
    popularity: 0,
    image: `https://picsum.photos/seed/${partial.slug}/480/320`,
    createdAt: CREATED_AT,
    ...partial,
  };
}

export const DESTINATION_DETAILS: Record<string, DestinationDetail> = {
  Dubai: {
    name: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    timezone: 'GST · UTC+4',
    currency: 'UAE Dirham (AED)',
    languages: 'Arabic · English',
    description:
      'A dazzling city where futuristic skyscrapers meet golden desert dunes. From the top of the Burj Khalifa to a sunset dune-bashing safari, Dubai pairs luxury with unforgettable adventure.',
    packages: [
      demoPackage({
        id: 'dxb-1',
        name: 'Dubai City & Desert Escape',
        slug: 'dubai-city-desert-escape',
        location: 'Dubai',
        description: 'Burj Khalifa, a desert safari with BBQ dinner, and a Dhow cruise on the Marina.',
        categories: ['International'],
        price: 54999,
        durationDays: 5,
        difficulty: 'Easy',
        rating: 4.7,
      }),
      demoPackage({
        id: 'dxb-2',
        name: 'Dubai & Abu Dhabi Luxury',
        slug: 'dubai-abu-dhabi-luxury',
        location: 'Dubai',
        description: 'Sheikh Zayed Grand Mosque, Ferrari World and a stay on Palm Jumeirah.',
        categories: ['International'],
        price: 78999,
        durationDays: 7,
        difficulty: 'Easy',
        rating: 4.8,
      }),
    ],
  },

  Bali: {
    name: 'Bali',
    slug: 'bali',
    country: 'Indonesia',
    timezone: 'WITA · UTC+8',
    currency: 'Indonesian Rupiah (IDR)',
    languages: 'Indonesian · Balinese',
    description:
      'The Island of the Gods blends emerald rice terraces, surf beaches and clifftop temples. Bali is equal parts serene retreat and tropical playground.',
    packages: [
      demoPackage({
        id: 'bali-1',
        name: 'Bali Honeymoon Retreat',
        slug: 'bali-honeymoon-retreat',
        location: 'Bali',
        description: 'Private pool villa in Ubud, a floating breakfast and a sunset at Tanah Lot.',
        categories: ['International'],
        price: 61999,
        durationDays: 6,
        difficulty: 'Easy',
        rating: 4.9,
      }),
      demoPackage({
        id: 'bali-2',
        name: 'Bali Adventure & Islands',
        slug: 'bali-adventure-islands',
        location: 'Bali',
        description: 'Nusa Penida day trip, Mount Batur sunrise trek and Ubud waterfalls.',
        categories: ['International'],
        price: 49999,
        durationDays: 7,
        difficulty: 'Moderate',
        rating: 4.6,
      }),
    ],
  },

  Singapore: {
    name: 'Singapore',
    slug: 'singapore',
    country: 'Singapore',
    timezone: 'SGT · UTC+8',
    currency: 'Singapore Dollar (SGD)',
    languages: 'English · Malay · Mandarin',
    description:
      'A gleaming city-state of supertree gardens, hawker feasts and island theme parks. Singapore is clean, compact and endlessly family-friendly.',
    packages: [
      // Real published package — its "View" link resolves to a live detail page.
      demoPackage({
        id: 'sg-real',
        name: 'Singapore',
        slug: 'singapore',
        location: 'Singapore',
        description: 'A curated 10-day Singapore experience across the city and Sentosa island.',
        categories: ['International'],
        price: 10998,
        durationDays: 10,
        difficulty: 'Moderate',
        rating: 4.5,
      }),
      demoPackage({
        id: 'sg-2',
        name: 'Singapore Family Fun',
        slug: 'singapore-family-fun',
        location: 'Singapore',
        description: 'Universal Studios, the S.E.A. Aquarium and a night at Gardens by the Bay.',
        categories: ['International'],
        price: 58999,
        durationDays: 5,
        difficulty: 'Easy',
        rating: 4.7,
      }),
    ],
  },

  Bangkok: {
    name: 'Bangkok',
    slug: 'bangkok',
    country: 'Thailand',
    timezone: 'ICT · UTC+7',
    currency: 'Thai Baht (THB)',
    languages: 'Thai',
    description:
      'Thailand’s electric capital layers gilded temples over floating markets and buzzing street-food lanes. Bangkok is a feast for every sense.',
    packages: [
      demoPackage({
        id: 'bkk-1',
        name: 'Bangkok & Pattaya Getaway',
        slug: 'bangkok-pattaya-getaway',
        location: 'Bangkok',
        description: 'Grand Palace, a Chao Phraya dinner cruise and Coral Island by speedboat.',
        categories: ['International'],
        price: 42999,
        durationDays: 5,
        difficulty: 'Easy',
        rating: 4.4,
      }),
      demoPackage({
        id: 'bkk-2',
        name: 'Bangkok & Phuket Beaches',
        slug: 'bangkok-phuket-beaches',
        location: 'Bangkok',
        description: 'City temples plus Phi Phi islands and James Bond Island from Phuket.',
        categories: ['International'],
        price: 55999,
        durationDays: 7,
        difficulty: 'Moderate',
        rating: 4.6,
      }),
    ],
  },

  Paris: {
    name: 'Paris',
    slug: 'paris',
    country: 'France',
    timezone: 'CET · UTC+1',
    currency: 'Euro (EUR)',
    languages: 'French',
    description:
      'The City of Light charms with grand boulevards, world-class art and riverside cafés. Paris turns every stroll into a postcard.',
    packages: [
      demoPackage({
        id: 'par-1',
        name: 'Romantic Paris',
        slug: 'romantic-paris',
        location: 'Paris',
        description: 'Eiffel Tower summit, a Seine river cruise and a day at the Louvre.',
        categories: ['International'],
        price: 89999,
        durationDays: 6,
        difficulty: 'Easy',
        rating: 4.8,
      }),
      demoPackage({
        id: 'par-2',
        name: 'Paris & Disneyland',
        slug: 'paris-disneyland',
        location: 'Paris',
        description: 'Classic city highlights plus two magical days at Disneyland Paris.',
        categories: ['International'],
        price: 99999,
        durationDays: 7,
        difficulty: 'Easy',
        rating: 4.7,
      }),
    ],
  },

  Tokyo: {
    name: 'Tokyo',
    slug: 'tokyo',
    country: 'Japan',
    timezone: 'JST · UTC+9',
    currency: 'Japanese Yen (JPY)',
    languages: 'Japanese',
    description:
      'A mesmerising mix of neon-lit districts, serene shrines and cutting-edge culture. Tokyo moves fast yet always finds room for tradition.',
    packages: [
      demoPackage({
        id: 'tyo-1',
        name: 'Tokyo Highlights',
        slug: 'tokyo-highlights',
        location: 'Tokyo',
        description: 'Shibuya, Senso-ji temple, teamLab digital art and a Mt. Fuji day trip.',
        categories: ['International'],
        price: 94999,
        durationDays: 6,
        difficulty: 'Moderate',
        rating: 4.8,
      }),
      demoPackage({
        id: 'tyo-2',
        name: 'Japan Golden Route',
        slug: 'japan-golden-route',
        location: 'Tokyo',
        description: 'Tokyo, Hakone and Kyoto by bullet train, with a ryokan onsen stay.',
        categories: ['International'],
        price: 129999,
        durationDays: 9,
        difficulty: 'Moderate',
        rating: 4.9,
      }),
    ],
  },
};

/** Look up hardcoded details for a marker name (undefined when there's no entry). */
export function getDestinationDetail(name: string): DestinationDetail | undefined {
  return DESTINATION_DETAILS[name];
}
