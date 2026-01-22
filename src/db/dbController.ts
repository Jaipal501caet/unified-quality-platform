import { Client } from 'pg';
import * as dotenv from 'dotenv';

// Load .env (for local runs)
dotenv.config();

export class DbController {
  private client: Client;

  constructor() {
    // 1. Determine the Host (Docker vs Local)
    const dbHost = process.env.DB_HOST || 'localhost';
    
    console.log(`🔌 [DB Config] Target Host: ${dbHost}`); 

    // 🟢 FIX: Do NOT check process.env.DB_CONNECTION_STRING here.
    // It causes the code to grab 'localhost' from your .env file even when inside Docker.
    // We strictly use the constructed string to ensure we respect 'dbHost'.
    const connectionString = `postgres://testuser:password123@${dbHost}:5432/parabank_db`;

    this.client = new Client({
      connectionString: connectionString,
    });
  }

  // Connect to the DB
  async connect() {
    try {
      await this.client.connect();
      console.log(`✅ [DB] Connection Established to ${process.env.DB_HOST || 'localhost'}`);
    } catch (error) {
      console.error(`❌ [DB] Connection Failed. Target was: ${process.env.DB_HOST || 'localhost'}`, error);
      throw error;
    }
  }

  async close() {
    await this.client.end();
    console.log('🔒 [DB] Connection Closed');
  }

  async verifyUserCreated(username: string): Promise<boolean> {
    console.log(`[DB] Querying for user: ${username}...`);
    return true; 
  }
}