import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Mock Destinations with Hotels and Tours
  const destinations = [
    {
      id: 'goa', name: 'Goa', state: 'Goa', country: 'India',
      description: "Experience the vibrant nightlife, pristine beaches, and Portuguese heritage of Goa.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80",
      places: [
        { name: 'Baga Beach', description: 'Famous for water sports and vibrant nightlife.' },
        { name: 'Dudhsagar Waterfalls', description: 'A majestic four-tiered waterfall.' }
      ],
      hotels: [
        { name: 'Taj Exotica Resort & Spa', price: '₹18,000/night', rating: 4.8 },
        { name: 'W Goa', price: '₹15,500/night', rating: 4.6 }
      ],
      tours: [
        { name: 'South Goa Sightseeing Tour', price: '₹1,200', duration: 'Full Day' }
      ]
    },
    {
      id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', country: 'India',
      description: "The City of Lakes, known for its palaces, history, and romantic boat rides.",
      image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80",
      places: [
        { name: 'City Palace', description: 'A massive palace complex built over 400 years.' },
        { name: 'Lake Pichola', description: 'An artificial fresh water lake.' }
      ],
      hotels: [
        { name: 'Taj Lake Palace', price: '₹45,000/night', rating: 4.9 }
      ],
      tours: [
        { name: 'City Palace & Boat Ride', price: '₹2,500', duration: 'Half Day' }
      ]
    },
    {
      id: 'manali', name: 'Manali', state: 'Himachal Pradesh', country: 'India',
      description: "A high-altitude Himalayan resort town known for its backpacking center and honeymoon destination.",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80",
      places: [
        { name: 'Rohtang Pass', description: 'A high mountain pass on the eastern Pir Panjal Range.' }
      ],
      hotels: [
        { name: 'The Himalayan', price: '₹12,000/night', rating: 4.7 }
      ],
      tours: [
        { name: 'Solang Valley Adventure', price: '₹1,800', duration: 'Full Day' }
      ]
    }
  ];

  for (const dest of destinations) {
    await prisma.destination.upsert({
      where: { id: dest.id },
      update: {},
      create: {
        id: dest.id,
        name: dest.name,
        state: dest.state,
        country: dest.country,
        description: dest.description,
        image: dest.image,
        placesToVisit: {
          create: dest.places.map(p => ({
            name: p.name,
            description: p.description,
            image: dest.image
          }))
        },
        hotels: {
          create: dest.hotels.map(h => ({
            name: h.name,
            price: h.price,
            rating: h.rating,
            image: dest.image
          }))
        },
        tours: {
          create: dest.tours.map(t => ({
            name: t.name,
            price: t.price,
            duration: t.duration,
            image: dest.image
          }))
        }
      }
    });
    console.log(`Created destination: ${dest.name}`);
  }

  // 2. Create Dummy Partner User
  const partner = await prisma.user.upsert({
    where: { email: 'partner@yatrasangi.com' },
    update: {},
    create: {
      email: 'partner@yatrasangi.com',
      password: 'password123', // In real app, this should be hashed
      name: 'Ramesh (Driver)',
      role: 'PARTNER'
    }
  });

  // 3. Create Dummy Traveler User
  const traveler = await prisma.user.upsert({
    where: { email: 'traveler@yatrasangi.com' },
    update: {},
    create: {
      email: 'traveler@yatrasangi.com',
      password: 'password123', // In real app, this should be hashed
      name: 'Raj Patel',
      role: 'TRAVELER'
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
