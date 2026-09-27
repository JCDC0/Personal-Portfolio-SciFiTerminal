export async function create(pool, { name, email, message }) {
  const result = await pool.query(
    `INSERT INTO messages (name, email, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, message]
  )
  return result.rows[0]
}
