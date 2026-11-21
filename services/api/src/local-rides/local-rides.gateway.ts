import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocalRidesService } from './local-rides.service.js';

@WebSocketGateway({ cors: true })
export class LocalRidesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store connected drivers: driverUserId -> { socketId, vehicleType, location }
  private activeDrivers = new Map<string, { socketId: string, vehicleType: string, location?: string }>();

  constructor(private readonly localRidesService: LocalRidesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [driverId, data] of this.activeDrivers.entries()) {
      if (data.socketId === client.id) {
        this.activeDrivers.delete(driverId);
        break;
      }
    }
  }

  // WAVE 1: Driver online dispatch status is disabled per ADR-001 directory-only policy
  @SubscribeMessage('driver_online')
  handleDriverOnline(
    @MessageBody() data: { driverId?: string; vehicleType?: string; location?: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.warn('[ADR-001] driver_online dispatch event rejected. Direct directory in effect.');
    return {
      event: 'driver_online_disabled',
      data: {
        success: false,
        message: 'Driver online dispatch status is disabled. YaatraSangi operates a direct-connect directory only.',
      },
    };
  }

  // WAVE 1: Customer ride request dispatch is disabled per ADR-001 directory-only policy
  @SubscribeMessage('request_ride')
  async handleRequestRide(
    @MessageBody() data: { 
      userId?: string;
      pickup?: string; 
      drop?: string; 
      vehicleType?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.warn('[ADR-001] Real-time ride dispatch request rejected. Direct contact directory in effect.');
    return {
      event: 'ride_dispatch_disabled',
      data: {
        success: false,
        message: 'On-demand ride dispatch is disabled per ADR-001. Please browse driver directory and contact directly.',
      },
    };
  }

  // WAVE 1: Driver ride acceptance is disabled per ADR-001 directory-only policy
  @SubscribeMessage('accept_ride')
  async handleAcceptRide(
    @MessageBody() data: { bookingId?: string; driverId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.warn('[ADR-001] accept_ride dispatch event rejected. Direct contact directory in effect.');
    return {
      event: 'ride_accept_disabled',
      data: {
        success: false,
        message: 'Ride acceptance and dispatch are disabled per ADR-001 directory policy.',
      },
    };
  }
}
