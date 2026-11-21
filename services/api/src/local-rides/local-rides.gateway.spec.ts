import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesGateway } from './local-rides.gateway.js';
import { LocalRidesService } from './local-rides.service.js';

describe('LocalRidesGateway (ADR-001 Quarantine Verification)', () => {
  let gateway: LocalRidesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalRidesGateway,
        {
          provide: LocalRidesService,
          useValue: {
            createRideBooking: vi.fn(),
            acceptRide: vi.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<LocalRidesGateway>(LocalRidesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should reject real-time ride dispatch request and return disabled event per ADR-001', async () => {
    const mockSocket = { id: 'client-socket-1' } as any;
    const requestData = {
      userId: 'test-user',
      pickup: 'Station Road',
      drop: 'Airport Road',
      vehicleType: 'auto',
    };

    const response = await gateway.handleRequestRide(requestData, mockSocket);
    expect(response.event).toBe('ride_dispatch_disabled');
    expect(response.data.success).toBe(false);
    expect(response.data.message).toContain('ADR-001');
  });

  it('should reject driver_online event and return disabled event per ADR-001', async () => {
    const mockSocket = { id: 'driver-socket-1' } as any;
    const response = gateway.handleDriverOnline({ driverId: 'driver-1', vehicleType: 'bike' }, mockSocket);
    expect(response.event).toBe('driver_online_disabled');
    expect(response.data.success).toBe(false);
  });

  it('should reject accept_ride event and return disabled event per ADR-001', async () => {
    const mockSocket = { id: 'driver-socket-1' } as any;
    const response = await gateway.handleAcceptRide({ bookingId: 'b-1', driverId: 'd-1' }, mockSocket);
    expect(response.event).toBe('ride_accept_disabled');
    expect(response.data.success).toBe(false);
  });
});
