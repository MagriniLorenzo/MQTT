import { pool } from '../db.js';

export async function insertSensorData(sensor_id, timestamp, value) {
  return pool.query(
    'INSERT INTO sensor_data(sensor_id, timestamp, value) VALUES ($1, $2, $3)',
    [sensor_id, timestamp, value]
  );
}

export async function fetchDataBySensorAndDate(sensor_id, from, to) {
  const res = await pool.query(
    'SELECT * FROM sensor_data WHERE sensor_id = $1 AND timestamp BETWEEN $2 AND $3',
    [sensor_id, from, to]
  );
  return res.rows;
}
