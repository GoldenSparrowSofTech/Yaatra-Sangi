import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an Admin/Owner User
  const owner = await prisma.user.upsert({
    where: { email: 'owner@travelpartner.com' },
    update: {},
    create: {
      email: 'owner@travelpartner.com',
      password: 'hashedpassword', // Dummy password
      name: 'Admin Owner',
      role: 'ADMIN',
    },
  });

  // Clear existing destinations and hotels (Optional, but good for idempotent seeds)
  await prisma.hotel.deleteMany({});
  await prisma.destination.deleteMany({});

  // Create Destinations
  const dest1 = await prisma.destination.create({
    data: {
      name: 'Udaipur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 24.5854,
      longitude: 73.7125,
    }
  });

  const dest2 = await prisma.destination.create({
    data: {
      name: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      latitude: 19.0760,
      longitude: 72.8777,
    }
  });

  const dest3 = await prisma.destination.create({
    data: {
      name: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      latitude: 26.9124,
      longitude: 75.7873,
    }
  });

  // Create Hotels
  await prisma.hotel.create({
    data: {
      name: 'The Leela Palace',
      description: 'Luxury heritage hotel with lake view.',
      address: 'Lake Pichola, Udaipur',
      destinationId: dest1.id,
      latitude: 24.5854,
      longitude: 73.7125,
      ownerId: owner.id,
      roomTypes: {
        create: [
          {
            name: 'Deluxe Room',
            capacity: 2,
            basePrice: 18500,
          }
        ]
      }
    }
  });

  await prisma.hotel.create({
    data: {
      name: 'Taj Mahal Tower',
      description: 'Iconic sea view hotel.',
      address: 'Colaba, Mumbai',
      destinationId: dest2.id,
      latitude: 19.0760,
      longitude: 72.8777,
      ownerId: owner.id,
      roomTypes: {
        create: [
          {
            name: 'Sea View Room',
            capacity: 2,
            basePrice: 15200,
          }
        ]
      }
    }
  });

  await prisma.hotel.create({
    data: {
      name: 'Rambagh Palace',
      description: 'Heritage Property with fine dining.',
      address: 'Bhawani Singh Rd, Jaipur',
      destinationId: dest3.id,
      latitude: 26.9124,
      longitude: 75.7873,
      ownerId: owner.id,
      roomTypes: {
        create: [
          {
            name: 'Palace Room',
            capacity: 2,
            basePrice: 22000,
          }
        ]
      }
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
