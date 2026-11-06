import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding YaatraSangi database...');

  // 1. Comprehensive Destinations List
  const destinations = [
    {
      id: 'goa', name: 'Goa', state: 'Goa', country: 'India',
      description: "Experience the vibrant nightlife, pristine beaches, and Portuguese heritage of Goa.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      type: "Beach & Nightlife",
      latitude: 15.2993, longitude: 74.1240,
      places: [
        { name: 'Baga Beach', description: 'Famous for water sports, beach shacks, and vibrant nightlife.' },
        { name: 'Dudhsagar Waterfalls', description: 'A majestic four-tiered waterfall on the Mandovi River.' },
        { name: 'Fort Aguada', description: '17th-century Portuguese lighthouse and fortress.' }
      ],
      hotels: [
        { name: 'Taj Exotica Resort & Spa', price: 18000, rating: 4.8, latOffset: 0.012, lngOffset: -0.015 },
        { name: 'W Goa', price: 15500, rating: 4.6, latOffset: -0.008, lngOffset: 0.011 }
      ],
      tours: [
        { name: 'South Goa Sightseeing Tour', price: 1200, duration: 'Full Day' },
        { name: 'Mandovi Sunset River Cruise', price: 850, duration: '2 Hours' }
      ]
    },
    {
      id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', country: 'India',
      description: "The City of Lakes, known for royal palaces, heritage architecture, and romantic boat rides.",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
      type: "Heritage & Royalty",
      latitude: 24.5854, longitude: 73.7125,
      places: [
        { name: 'City Palace', description: 'A monumental complex overlooking Lake Pichola.' },
        { name: 'Lake Pichola', description: 'Picturesque freshwater lake with boat cruises.' },
        { name: 'Jag Mandir', description: 'Island palace palace on Lake Pichola.' }
      ],
      hotels: [
        { name: 'Taj Lake Palace', price: 45000, rating: 4.9, latOffset: 0.005, lngOffset: -0.003 },
        { name: 'The Leela Palace Udaipur', price: 38000, rating: 4.8, latOffset: -0.004, lngOffset: 0.006 }
      ],
      tours: [
        { name: 'City Palace & Heritage Walk', price: 2500, duration: 'Half Day' }
      ]
    },
    {
      id: 'manali', name: 'Manali', state: 'Himachal Pradesh', country: 'India',
      description: "A high-altitude Himalayan valley town famous for snow peaks, adventure sports, and scenic rivers.",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
      type: "Hill Station & Adventure",
      latitude: 32.2432, longitude: 77.1892,
      places: [
        { name: 'Solang Valley', description: 'Hub for paragliding, zorbing, and skiing.' },
        { name: 'Rohtang Pass', description: 'Snow point pass with spectacular Himalayan panoramas.' },
        { name: 'Hadimba Temple', description: 'Historic wooden temple nestled in cedar forests.' }
      ],
      hotels: [
        { name: 'The Himalayan Resort', price: 12000, rating: 4.7, latOffset: 0.009, lngOffset: 0.004 },
        { name: 'Span Resort & Spa', price: 14500, rating: 4.6, latOffset: -0.015, lngOffset: -0.010 }
      ],
      tours: [
        { name: 'Solang Valley & Rohtang Pass Tour', price: 3500, duration: 'Full Day' }
      ]
    },
    {
      id: 'kerala', name: 'Kerala', state: 'Kerala', country: 'India',
      description: "God's Own Country, famed for serene backwaters, palm-fringed lagoons, tea gardens, and Ayurvedic wellness.",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      type: "Backwaters & Nature",
      latitude: 9.9312, longitude: 76.2673,
      places: [
        { name: 'Alleppey Backwaters', description: 'Famous for tranquil houseboat stays and lagoon tours.' },
        { name: 'Munnar Tea Gardens', description: 'Rolling misty green hills covered with tea plantations.' }
      ],
      hotels: [
        { name: 'Kumarakom Lake Resort', price: 22000, rating: 4.9, latOffset: 0.008, lngOffset: 0.012 }
      ],
      tours: [
        { name: 'Houseboat Day Cruise', price: 6000, duration: 'Full Day' }
      ]
    },
    {
      id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', country: 'India',
      description: "The Pink City of India, world-renowned for Amer Fort, Hawa Mahal, vibrant bazaars, and royal dining.",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      type: "Heritage & Forts",
      latitude: 26.9124, longitude: 75.7873,
      places: [
        { name: 'Hawa Mahal', description: 'Palace of Winds with intricate honeycomb pink stone facade.' },
        { name: 'Amer Fort', description: 'Hilltop fortress featuring royal courtyards and mirror palace.' }
      ],
      hotels: [
        { name: 'Rambagh Palace', price: 48000, rating: 4.9, latOffset: 0.007, lngOffset: -0.005 }
      ],
      tours: [
        { name: 'Royal Forts & Bazaars Tour', price: 2200, duration: 'Full Day' }
      ]
    },
    {
      id: 'leh', name: 'Leh Ladakh', state: 'Ladakh', country: 'India',
      description: "Land of high passes, ancient monasteries, crystal lakes like Pangong, and surreal mountain landscapes.",
      image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
      type: "Mountain & Trekking",
      latitude: 34.1526, longitude: 77.5771,
      places: [
        { name: 'Pangong Tso', description: 'Vibrant blue endorheic lake at 14,270 feet.' },
        { name: 'Nubra Valley', description: 'High altitude cold desert with double-humped camels.' }
      ],
      hotels: [
        { name: 'The Grand Dragon Ladakh', price: 16000, rating: 4.7, latOffset: 0.004, lngOffset: 0.003 }
      ],
      tours: [
        { name: 'Pangong & Nubra Valley 3-Day Expedition', price: 14000, duration: '3 Days' }
      ]
    },
    {
      id: 'agra', name: 'Agra', state: 'Uttar Pradesh', country: 'India',
      description: "Home of the majestic Taj Mahal, Agra Fort, and rich Mughal architecture along the Yamuna river.",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
      type: "World Wonder & History",
      latitude: 27.1767, longitude: 78.0081,
      places: [
        { name: 'Taj Mahal', description: 'Ivory-white marble mausoleum, one of the 7 Wonders of the World.' },
        { name: 'Agra Fort', description: 'Historic 16th-century fortress of Mughal emperors.' }
      ],
      hotels: [
        { name: 'The Oberoi Amarvilas', price: 42000, rating: 4.9, latOffset: -0.003, lngOffset: 0.008 }
      ],
      tours: [
        { name: 'Sunrise Taj Mahal Tour', price: 1500, duration: 'Half Day' }
      ]
    },
    {
      id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', country: 'India',
      description: "One of the oldest continuously inhabited cities on earth, sacred ghats of the Ganges, and soulful Ganga Aarti.",
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      type: "Spiritual & Cultural",
      latitude: 25.3176, longitude: 82.9739,
      places: [
        { name: 'Dashashwamedh Ghat', description: 'Main ghat famous for the grand evening Ganga Aarti.' },
        { name: 'Kashi Vishwanath Temple', description: 'Renowned Golden Temple dedicated to Lord Shiva.' }
      ],
      hotels: [
        { name: 'BrijRama Palace Varanasi', price: 26000, rating: 4.8, latOffset: 0.006, lngOffset: -0.004 }
      ],
      tours: [
        { name: 'Ganga Boat Ride & Ghats Tour', price: 1200, duration: '3 Hours' }
      ]
    },
    {
      id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', country: 'India',
      description: "The Queen of Hill Stations, Victorian architecture, Mall Road, and panoramic Himalayan vistas.",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
      type: "Hill Station & Colonial",
      latitude: 31.1048, longitude: 77.1734,
      places: [
        { name: 'The Ridge & Mall Road', description: 'Iconic pedestrian hub with colonial buildings and churches.' },
        { name: 'Jakhu Temple', description: 'Ancient temple on peak dedicated to Lord Hanuman.' }
      ],
      hotels: [
        { name: 'Wildflower Hall Shimla', price: 32000, rating: 4.9, latOffset: -0.008, lngOffset: 0.015 }
      ],
      tours: [
        { name: 'Kufri & Chail Day Excursion', price: 2800, duration: 'Full Day' }
      ]
    }
  ];

  // Clean old destination-linked items to allow seamless re-seeding
  await prisma.placeToVisit.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.destination.deleteMany({});

  for (const dest of destinations) {
    await prisma.destination.create({
      data: {
        id: dest.id,
        name: dest.name,
        state: dest.state,
        country: dest.country,
        description: dest.description,
        image: dest.image,
        type: dest.type,
        latitude: dest.latitude,
        longitude: dest.longitude,
        placesToVisit: {
          create: dest.places.map((p) => ({
            name: p.name,
            description: p.description,
            image: dest.image,
          })),
        },
        hotels: {
          create: dest.hotels.map((h) => ({
            name: h.name,
            price: h.price,
            rating: h.rating,
            image: dest.image,
            location: `${dest.name}, ${dest.state}`,
            latitude: dest.latitude + h.latOffset,
            longitude: dest.longitude + h.lngOffset,
            amenities: 'WiFi, AC, Breakfast, Pool, Parking',
            isVerified: true,
            isActive: true,
          })),
        },
        tours: {
          create: dest.tours.map((t) => ({
            name: t.name,
            price: t.price,
            duration: t.duration,
            image: dest.image,
          })),
        },
      },
    });
    console.log(`Seeded destination: ${dest.name}`);
  }

  // 2. Taxis Seed
  const taxis = [
    {
      slug: 'royal-cabs',
      name: 'Royal Cabs',
      type: 'SUV',
      model: 'Toyota Innova Crysta',
      location: 'Delhi NCR',
      capacity: '6+1',
      bags: '4 Bags',
      rating: 4.8,
      price: 15,
      perKm: true,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      features: JSON.stringify(['AC', 'Complimentary Water', 'English Speaking Driver', 'Fastag', 'Clean Interior']),
      recommended: true,
    },
    {
      slug: 'shiv-taxi',
      name: 'Shiv Taxi Service',
      type: 'Sedan',
      model: 'Maruti Suzuki Dzire',
      location: 'Mumbai',
      capacity: '4+1',
      bags: '2 Bags',
      rating: 4.6,
      price: 12,
      perKm: true,
      image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80',
      features: JSON.stringify(['AC', 'Music System', 'USB Charging', 'Verified Driver']),
      recommended: false,
    },
    {
      slug: 'premium-rides',
      name: 'Premium Luxury Rides',
      type: 'Luxury Sedan',
      model: 'Mercedes-Benz E-Class',
      location: 'Goa',
      capacity: '4+1',
      bags: '3 Bags',
      rating: 4.9,
      price: 35,
      perKm: true,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      features: JSON.stringify(['Luxury Leather', 'Chauffeur', 'Complimentary WiFi', 'Chilled Beverages']),
      recommended: true,
    },
  ];

  for (const t of taxis) {
    await prisma.taxi.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
    console.log(`Seeded taxi: ${t.name}`);
  }

  // 3. Restaurants Seed
  const restaurants = [
    {
      slug: 'gordhan-thal',
      name: 'Gordhan Thal',
      cuisine: 'Authentic Gujarati Thali & Rajasthani Sweets',
      location: 'Ahmedabad',
      rating: 4.8,
      priceForTwo: 900,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      features: JSON.stringify(['AC Dining', 'Unlimited Thali', 'Valet Parking', 'Pure Vegetarian']),
    },
    {
      slug: 'havmor-restaurant',
      name: 'Havmor The Eatery',
      cuisine: 'North Indian, Continental & Signature Ice Creams',
      location: 'Ahmedabad / Vadodara',
      rating: 4.6,
      priceForTwo: 1100,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      features: JSON.stringify(['Family Friendly', 'Dessert Parlour', 'Outdoor Seating', 'Live Kitchen']),
    },
    {
      slug: 'spice-court',
      name: 'Spice Court',
      cuisine: 'Royal Rajasthani & Junglee Maas',
      location: 'Jaipur',
      rating: 4.7,
      priceForTwo: 1400,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      features: JSON.stringify(['Courtyard Seating', 'Live Folk Music', 'Full Bar', 'Heritage Ambience']),
    },
  ];

  for (const r of restaurants) {
    await prisma.restaurant.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
    console.log(`Seeded restaurant: ${r.name}`);
  }

  // 4. Tour Packages Seed
  const packages = [
    {
      slug: 'goa-4-days',
      name: 'Goa Coastal Dream & Cruise Expedition',
      destination: 'Goa',
      duration: '4 Days / 3 Nights',
      price: 15999,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      highlights: JSON.stringify(['North & South Goa Sightseeing', 'Mandovi Luxury Sunset Cruise', '4-Star Beach Resort Stay', 'Airport Transfers Included']),
    },
    {
      slug: 'manali-trip',
      name: 'Himachal Snow Peaks & Solang Adventure',
      destination: 'Manali',
      duration: '5 Days / 4 Nights',
      price: 18499,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      highlights: JSON.stringify(['Solang Valley Paragliding', 'Rohtang Pass Snow Excursion', 'River Rafting in Beas', 'Campfire & DJ Night']),
    },
    {
      slug: 'kerala-tour',
      name: 'Munnar Hills & Alleppey Houseboat Serenade',
      destination: 'Kerala',
      duration: '6 Days / 5 Nights',
      price: 24999,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      highlights: JSON.stringify(['Private Deluxe Houseboat Stay', 'Munnar Tea Plantations', 'Periyar Wildlife Sanctuary', 'Authentic Kerala Meals']),
    },
  ];

  for (const p of packages) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`Seeded package: ${p.name}`);
  }

  // 5. System Users Seed with Hashed Passwords & RBAC Roles
  const defaultPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@yatrasangi.com',
      password: defaultPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
    {
      email: 'hotelier@yatrasangi.com',
      password: defaultPassword,
      name: 'Vikram Mehta (Hotelier Partner)',
      role: 'HOTEL_OWNER',
    },
    {
      email: 'partner@yatrasangi.com',
      password: defaultPassword,
      name: 'Ramesh Patel (Driver & Fleet Captain)',
      role: 'DRIVER',
    },
    {
      email: 'traveler@yatrasangi.com',
      password: defaultPassword,
      name: 'Raj Patel (YaatraSangi Traveler)',
      role: 'TRAVELLER',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: u.password, role: u.role, name: u.name },
      create: u,
    });
    console.log(`Seeded user: ${u.email} [${u.role}]`);
  }

  console.log('✅ YaatraSangi database seeded completely with real destinations, hotels, taxis, restaurants, packages and RBAC users!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
