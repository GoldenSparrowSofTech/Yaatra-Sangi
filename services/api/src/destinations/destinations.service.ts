import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.destination.findMany();
  }

  async findOne(id: string) {
    // Return rich mock data for the API
    const enrichedData: any = {
      goa: {
        id: 'goa', name: 'Goa', state: 'Goa', country: 'India',
        description: "Experience the vibrant nightlife, pristine beaches, and Portuguese heritage of Goa.",
        placesToVisit: [
          { name: 'Baga Beach', description: 'Famous for water sports and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80' },
          { name: 'Dudhsagar Waterfalls', description: 'A majestic four-tiered waterfall located on the Mandovi River.', image: 'https://images.unsplash.com/photo-1620025983803-cc941829e28d?auto=format&fit=crop&q=80' },
          { name: 'Aguada Fort', description: 'A well-preserved seventeenth-century Portuguese fort.', image: 'https://images.unsplash.com/photo-1542456485-bd571597f8aa?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "Taj Exotica Resort & Spa", price: "₹18,000/night", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80", rating: 4.8 },
          { id: 2, name: "W Goa", price: "₹15,500/night", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80", rating: 4.6 }
        ],
        tours: [
          { id: 1, name: "South Goa Sightseeing Tour", price: "₹1,200", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80", duration: "Full Day" }
        ]
      },
      udaipur: {
        id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', country: 'India',
        description: "The City of Lakes, known for its palaces, history, and romantic boat rides.",
        placesToVisit: [
          { name: 'City Palace', description: 'A massive palace complex built over 400 years.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80' },
          { name: 'Lake Pichola', description: 'An artificial fresh water lake, created in the year 1362 AD.', image: 'https://images.unsplash.com/photo-1615836245337-f5894101e1da?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "Taj Lake Palace", price: "₹45,000/night", image: "https://images.unsplash.com/photo-1542314831-c6a4d142104d?auto=format&fit=crop&q=80", rating: 4.9 }
        ],
        tours: [
          { id: 1, name: "City Palace & Boat Ride", price: "₹2,500", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80", duration: "Half Day" }
        ]
      },
      manali: {
        id: 'manali', name: 'Manali', state: 'Himachal Pradesh', country: 'India',
        description: "A high-altitude Himalayan resort town known for its backpacking center and honeymoon destination.",
        placesToVisit: [
          { name: 'Rohtang Pass', description: 'A high mountain pass on the eastern Pir Panjal Range.', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80' },
          { name: 'Solang Valley', description: 'A side valley at the top of the Kullu Valley known for its summer and winter sports conditions.', image: 'https://images.unsplash.com/photo-1623944686948-26f6eb8b07ee?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "The Himalayan", price: "₹12,000/night", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80", rating: 4.7 }
        ],
        tours: [
          { id: 1, name: "Solang Valley Adventure", price: "₹1,800", image: "https://images.unsplash.com/photo-1623944686948-26f6eb8b07ee?auto=format&fit=crop&q=80", duration: "Full Day" }
        ]
      },
      kerala: {
        id: 'kerala', name: 'Kerala', state: 'Kerala', country: 'India',
        description: "God's Own Country, known for its palm-lined beaches and backwaters.",
        placesToVisit: [
          { name: 'Alleppey Backwaters', description: 'Famous for houseboat cruises.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80' },
          { name: 'Munnar Tea Gardens', description: 'Rolling hills dotted with tea plantations.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "Kumarakom Lake Resort", price: "₹25,000/night", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80", rating: 4.9 }
        ],
        tours: [
          { id: 1, name: "Backwater Houseboat Tour", price: "₹8,500", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80", duration: "1 Night/2 Days" }
        ]
      },
      jaipur: {
        id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', country: 'India',
        description: "The Pink City, known for its fascinating monuments and colorful markets.",
        placesToVisit: [
          { name: 'Amber Fort', description: 'A massive fort built of red sandstone and marble.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80' },
          { name: 'Hawa Mahal', description: 'The Palace of Winds with its unique honeycomb design.', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "Rambagh Palace", price: "₹50,000/night", image: "https://images.unsplash.com/photo-1542314831-c6a4d142104d?auto=format&fit=crop&q=80", rating: 5.0 }
        ],
        tours: [
          { id: 1, name: "Jaipur Heritage Tour", price: "₹3,000", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80", duration: "Full Day" }
        ]
      },
      leh: {
        id: 'leh', name: 'Leh Ladakh', state: 'Ladakh', country: 'India',
        description: "A land of high passes, Buddhist monasteries, and rugged terrain.",
        placesToVisit: [
          { name: 'Pangong Lake', description: 'A high altitude lake famous for its changing colors.', image: 'https://images.unsplash.com/photo-1574510615573-03b137d5320d?auto=format&fit=crop&q=80' },
          { name: 'Nubra Valley', description: 'A high altitude cold desert with double-humped camels.', image: 'https://images.unsplash.com/photo-1623944686948-26f6eb8b07ee?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "The Grand Dragon Ladakh", price: "₹14,000/night", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80", rating: 4.8 }
        ],
        tours: [
          { id: 1, name: "Pangong Lake Excursion", price: "₹4,500", image: "https://images.unsplash.com/photo-1574510615573-03b137d5320d?auto=format&fit=crop&q=80", duration: "2 Days" }
        ]
      },
      agra: {
        id: 'agra', name: 'Agra', state: 'Uttar Pradesh', country: 'India',
        description: "Home to the iconic Taj Mahal, a masterpiece of Mughal architecture.",
        placesToVisit: [
          { name: 'Taj Mahal', description: 'The famous ivory-white marble mausoleum.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80' },
          { name: 'Agra Fort', description: 'A historical fort and former residence of the Mughal Dynasty.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "The Oberoi Amarvilas", price: "₹35,000/night", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80", rating: 5.0 }
        ],
        tours: [
          { id: 1, name: "Taj Mahal Sunrise Tour", price: "₹1,500", image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80", duration: "Half Day" }
        ]
      },
      varanasi: {
        id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', country: 'India',
        description: "The spiritual capital of India, known for its ghats along the River Ganges.",
        placesToVisit: [
          { name: 'Dashashwamedh Ghat', description: 'The main ghat in Varanasi, known for the spectacular Ganga Aarti.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80' },
          { name: 'Kashi Vishwanath Temple', description: 'One of the most famous Hindu temples dedicated to Lord Shiva.', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "BrijRama Palace", price: "₹22,000/night", image: "https://images.unsplash.com/photo-1542314831-c6a4d142104d?auto=format&fit=crop&q=80", rating: 4.8 }
        ],
        tours: [
          { id: 1, name: "Morning Boat Ride on the Ganges", price: "₹800", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80", duration: "2 Hours" }
        ]
      },
      shimla: {
        id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', country: 'India',
        description: "The Queen of Hill Stations, known for its colonial architecture and pleasant climate.",
        placesToVisit: [
          { name: 'The Ridge', description: 'A large open space in the heart of Shimla.', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80' },
          { name: 'Mall Road', description: 'The main street in Shimla with many shops and cafes.', image: 'https://images.unsplash.com/photo-1623944686948-26f6eb8b07ee?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "Wildflower Hall", price: "₹28,000/night", image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80", rating: 4.9 }
        ],
        tours: [
          { id: 1, name: "Shimla Heritage Walk", price: "₹1,200", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80", duration: "Half Day" }
        ]
      }
    };

    if (enrichedData[id.toLowerCase()]) {
      return enrichedData[id.toLowerCase()];
    }

    try {
      const destination = await this.prisma.destination.findUnique({
        where: { id },
        include: { hotels: true }
      });
      if (!destination) {
        throw new NotFoundException(`Destination with ID ${id} not found`);
      }
      return destination;
    } catch (e) {
      // Fallback if DB is not seeded or connected
      return {
        id, name: id.charAt(0).toUpperCase() + id.slice(1),
        description: `Explore the amazing places, hotels, and tours in ${id}.`,
        placesToVisit: [
          { name: `Top spot in ${id}`, description: `Must visit place in ${id}.`, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80' }
        ],
        hotels: [
          { id: 1, name: "Luxury Hotel " + id, price: "₹5,000/night", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80", rating: 4.5 }
        ],
        tours: [
          { id: 1, name: id + " Highlights Tour", price: "₹1,500", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80", duration: "Full Day" }
        ]
      };
    }
  }

  async create(data: { name: string; state: string; country: string; latitude: number; longitude: number }) {
    return this.prisma.destination.create({
      data,
    });
  }

  async search(query: string) {
    return this.prisma.destination.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }
}
