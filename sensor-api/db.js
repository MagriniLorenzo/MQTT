import pkg from 'pg';
const { Pool } = pkg;

export class Database {
  static instance;

  constructor() {
    this.pool = new Pool({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE
    });

    this.initializeTables();
  }

  async initializeTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS sensors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        tags TEXT[]
      )
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        sensor_id INTEGER,
        timestamp TIMESTAMPTZ,
        value FLOAT,
        PRIMARY KEY (sensor_id, timestamp),
        FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE
      )
    `);
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getPool() {
    return this.pool;
  }
}
