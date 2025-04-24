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

export async function createSensor({ name, tags = [] }) {
  return pool.query(
    'INSERT INTO sensors (name, tags) VALUES ($1, $2)',
    [name, tags]
  );
}

export async function listSensors() {
  const res = await pool.query('SELECT * FROM sensors');
  return res.rows; 
}

export async function updateSensor(id, { name, tags }) {
  await pool.query(
    'UPDATE sensors SET name = $1, tags = $2 WHERE id = $3',
    [name, tags, id]
  );
}