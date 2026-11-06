import { Injectable, ConflictException } from '@nestjs/common';

export interface IdempotencyRecord {
  key: string;
  status: 'PROCESSING' | 'COMPLETED';
  response?: any;
  createdAt: number;
}

@Injectable()
export class IdempotencyService {
  private readonly store = new Map<string, IdempotencyRecord>();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  async startProcessing(key: string): Promise<any | null> {
    this.cleanExpired();

    const existing = this.store.get(key);
    if (existing) {
      if (existing.status === 'PROCESSING') {
        throw new ConflictException(
          'A request with this Idempotency-Key is currently being processed. Please retry shortly.',
        );
      }
      if (existing.status === 'COMPLETED') {
        return existing.response;
      }
    }

    this.store.set(key, {
      key,
      status: 'PROCESSING',
      createdAt: Date.now(),
    });

    return null;
  }

  async markCompleted(key: string, response: any): Promise<void> {
    const record = this.store.get(key);
    if (record) {
      record.status = 'COMPLETED';
      record.response = response;
    } else {
      this.store.set(key, {
        key,
        status: 'COMPLETED',
        response,
        createdAt: Date.now(),
      });
    }
  }

  async markFailed(key: string): Promise<void> {
    this.store.delete(key);
  }

  private cleanExpired() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now - record.createdAt > this.TTL_MS) {
        this.store.delete(key);
      }
    }
  }
}

