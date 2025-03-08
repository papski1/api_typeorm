import bcrypt from 'bcryptjs';
import { AppDataSource } from '../_helpers/db';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

class UserService {
    private userRepository: Repository<User>;

    private get repository(): Repository<User> {
        if (!this.userRepository) {
            this.userRepository = AppDataSource.getRepository(User);
        }
        return this.userRepository;
    }

    async getAll(): Promise<User[]> {
        const users = await this.repository.find();
        
        this.exportUsersToJson(users);
        
        return users;
    }

    async getById(id: number): Promise<User> {
        return await this.getUser(id);
    }

    async create(params: any): Promise<User> {
        const existingUser = await this.repository.findOne({ where: { email: params.email } });
        if (existingUser) {
            throw `Email "${params.email}" is already registered`;
        }

        const user = new User();
        Object.assign(user, params);

        user.passwordHash = await bcrypt.hash(params.password, 10);

        const savedUser = await this.repository.save(user);
        
        const users = await this.repository.find();
        this.exportUsersToJson(users);
        
        return savedUser;
    }

    async update(id: number, params: any): Promise<User> {
        const user = await this.getUser(id);

        const emailChanged = params.email && user.email !== params.email;
        if (emailChanged) {
            const existingUser = await this.repository.findOne({ where: { email: params.email } });
            if (existingUser) {
                throw `Email "${params.email}" is already taken`;
            }
        }

        if (params.password) {
            params.passwordHash = await bcrypt.hash(params.password, 10);
            delete params.password;
        }

        Object.assign(user, params);
        const updatedUser = await this.repository.save(user);
        
        const users = await this.repository.find();
        this.exportUsersToJson(users);
        
        return updatedUser;
    }

    async delete(id: number): Promise<void> {
        const user = await this.getUser(id);
        await this.repository.remove(user);
        
        const users = await this.repository.find();
        this.exportUsersToJson(users);
    }

    private async getUser(id: number): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) throw 'User not found';
        return user;
    }
    
    private exportUsersToJson(users: User[]): void {
        try {
            const sanitizedUsers = users.map(user => {
                const { passwordHash, ...userWithoutPassword } = user;
                return {
                    ...userWithoutPassword,
                    fullName: user.fullName 
                };
            });
            
            const rootDir = path.join(__dirname, '../../');
            const filePath = path.join(rootDir, 'users.json');
            fs.writeFileSync(filePath, JSON.stringify(sanitizedUsers, null, 2));
            console.log(`Users data exported to ${filePath}`);
        } catch (error) {
            console.error('Failed to export users to JSON:', error);
        }
    }
}

export const userService = new UserService();