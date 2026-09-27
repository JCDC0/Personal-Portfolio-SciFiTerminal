export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM projects ORDER BY id')
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id])
  return result.rows[0] ?? null
}
