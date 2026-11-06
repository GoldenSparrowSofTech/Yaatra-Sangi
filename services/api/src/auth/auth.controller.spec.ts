import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    getProfile: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return profile for current user', async () => {
    mockAuthService.getProfile.mockResolvedValue({ id: 'user-123', email: 'test@example.com' });
    const profile = await controller.getProfile('user-123');
    expect(profile).toEqual({ id: 'user-123', email: 'test@example.com' });
  });

  it('should allow admin-check handler execution', async () => {
    const mockUser = { id: 'admin-1', role: 'ADMIN' };
    const result = await controller.adminCheck(mockUser);
    expect(result.message).toContain('Admin authorization verified');
    expect(result.user).toEqual(mockUser);
  });
});
