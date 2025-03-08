import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import * as mysql from 'mysql2/promise';
import * as config from '../../config.json';

// Create a variable to export our data source
export let AppDataSource: DataSource;

// Initialize function
export async function initialize(): Promise<void> {
    try {
        // Extract database config
        const { host, port, user, password, database } = config.database;
        
        // Create database if it doesn't exist
        const connection = await mysql.createConnection({ 
            host, 
            port, 
            user, 
            password 
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
        
        // Initialize TypeORM data source
        AppDataSource = new DataSource({
            type: 'mysql',
            host,
            port,
            username: user,
            password,
            database,
            entities: [User],
            synchronize: true, // This is equivalent to sequelize.sync({ alter: true })
            logging: true
        });
        
        // Initialize the data source
        await AppDataSource.initialize();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

initialize();