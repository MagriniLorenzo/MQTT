import { Database } from '../db.js';

export class SensorDataRepository {
  constructor() {
    this.db = Database.getInstance();
    this.pool = this.db.getPool();
  }
  
  async insert(sensor_id, timestamp, value) {
    return this.pool.query(
      'INSERT INTO sensor_data(sensor_id, timestamp, value) VALUES ($1, $2, $3)',
      [sensor_id, timestamp, value]
    );
  }

  async fetchBySensorAndDate(sensor_id, from, to) {
    const res = await this.pool.query(
      'SELECT * FROM sensor_data WHERE sensor_id = $1 AND timestamp BETWEEN $2 AND $3',
      [sensor_id, from, to]
    );
    return res.rows;
  }
}
