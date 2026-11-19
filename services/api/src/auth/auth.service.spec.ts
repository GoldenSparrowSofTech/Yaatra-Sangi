import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/role.enum.js';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: vi.fn(),
              create: vi.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn().mockReturnValue('mock-jwt-token'),
            verify: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user as TRAVELLER by default and hash password', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.user, 'create').mockImplementation(async (args: any) => ({
      id: 'uuid-1',
      email: args.data.email,
      password: args.data.password,
      name: args.data.name,
      role: args.data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.register({
      email: 'traveler@yaatrasangi.com',
      password: 'plainpassword',
      name: 'John Doe',
    });

    expect(result.email).toBe('traveler@yaatrasangi.com');
    expect(result.role).toBe(Role.TRAVELLER);
    expect(result.access_token).toBe('mock-jwt-token');
  });

  it('should prevent self-registering as ADMIN', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.user, 'create').mockImplementation(async (args: any) => ({
      id: 'uuid-2',
      email: args.data.email,
      password: args.data.password,
      name: args.data.name,
      role: args.data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.register({
      email: 'hacker@yaatrasangi.com',
      password: 'secretpassword',
      role: Role.ADMIN,
    });

    expect(result.role).toBe(Role.TRAVELLER);
  });

  it('should prevent self-registering as SUPER_ADMIN', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.user, 'create').mockImplementation(async (args: any) => ({
      id: 'uuid-3',
      email: args.data.email,
      password: args.data.password,
      name: args.data.name,
      role: args.data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.register({
      email: 'hacker2@yaatrasangi.com',
      password: 'secretpassword',
      role: Role.SUPER_ADMIN,
    });

    expect(result.role).toBe(Role.TRAVELLER);
  });
});
