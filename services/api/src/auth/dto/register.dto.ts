import { Role } from '../enums/role.enum.js';

export class RegisterDto {
  email: string;
  password: string;
  name?: string;
  role?: Role;
  phone?: string;
}

