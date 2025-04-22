import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    sensor_id TEXT,
    timestamp TIMESTAMPTZ,
    value FLOAT
  )
`);

export const insertData = (sensor_id, timestamp, value) => {
  return pool.query(
    'INSERT INTO sensor_data(sensor_id, timestamp, value) VALUES ($1, $2, $3)',
    [sensor_id, timestamp, value]
  );
};

export const getData = (sensor_id, from, to) => {
  return pool.query(
    'SELECT * FROM sensor_data WHERE sensor_id = $1 AND timestamp BETWEEN $2 AND $3',
    [sensor_id, from, to]
  );
};
