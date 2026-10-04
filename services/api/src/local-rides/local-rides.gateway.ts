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

  // Driver explicitly goes "online"
  @SubscribeMessage('driver_online')
  handleDriverOnline(
    @MessageBody() data: { driverId: string, vehicleType: string, location?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.activeDrivers.set(data.driverId, { 
      socketId: client.id, 
      vehicleType: data.vehicleType || 'bike',
      location: data.location || 'Rajkot'
    });
    console.log(`Driver ${data.driverId} [${data.vehicleType}] is online (Socket: ${client.id})`);
    return { event: 'online_status', data: { success: true } };
  }

  // Customer requests a ride
  @SubscribeMessage('request_ride')
  async handleRequestRide(
    @MessageBody() data: { 
      userId: string;
      pickup: string; 
      drop: string; 
      vehicleType: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // 1. Save booking to database via service
    const booking = await this.localRidesService.createRideBooking(data);

    // 2. Broadcast this new booking ONLY to active drivers matching the vehicle type
    // In a real app, you would also calculate distance between pickup and driver location
    for (const [driverId, driverData] of this.activeDrivers.entries()) {
      // Basic matching: Driver must have the same vehicle type
      if (driverData.vehicleType === data.vehicleType) {
        // Send specific event to this driver's socket
        this.server.to(driverData.socketId).emit('new_ride_request', booking);
      }
    }

    // 3. Confirm to the customer that we are searching
    return { event: 'ride_requested', data: booking };
  }

  // Driver accepts a ride
  @SubscribeMessage('accept_ride')
  async handleAcceptRide(
    @MessageBody() data: { bookingId: string; driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // 1. Call service to attempt assignment (handles first-come-first-serve lock)
      const confirmedBooking = await this.localRidesService.acceptRide(data.bookingId, data.driverId);

      // 2. Notify the specific driver that they got the ride
      client.emit('ride_accepted_success', confirmedBooking);

      // 3. Notify the customer (and everyone else) that the ride is taken
      this.server.emit(`ride_status_updated_${data.bookingId}`, confirmedBooking);

    } catch (error) {
      // If someone else took it, notify this driver
      client.emit('ride_accepted_failed', { message: 'Ride already accepted by another Captain.' });
    }
  }
}
