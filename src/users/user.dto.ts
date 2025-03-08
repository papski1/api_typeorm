import { Role } from '../_helpers/role';

export interface CreateUserDto {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    password: string;
    confirmPassword: string;
}

export interface UpdateUserDto {
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
    password?: string;
    confirmPassword?: string;
} 