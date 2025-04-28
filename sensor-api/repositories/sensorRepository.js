import { Database } from '../db.js';

export class SensorController {
  constructor() {
    this.db = Database.getInstance();
    this.pool = this.db.getPool();
  }

  async create({ name, tags = [] }) {
    return this.pool.query(
      'INSERT INTO sensors (name, tags) VALUES ($1, $2)',
      [name, tags]
    );
  }

  async get() {
    const res = await this.pool.query('SELECT * FROM sensors');
    return res.rows;
  }

  async update(id, { name, tags }) {
    await this.pool.query(
      'UPDATE sensors SET name = $1, tags = $2 WHERE id = $3',
      [name, tags, id]
    );
  }
}
