export default function ProjectStack({ status, count, error, slow, load }) {
  return (
    <section className="panel stack" aria-labelledby="stack-title">
      <p className="mono muted">PROJECT RECORDS // {status === 'ready' ? `${count} ROWS` : status.toUpperCase()}</p>
      <h1 id="stack-title">Projects</h1>
      <p className="stack-query mono">SELECT * FROM projects ORDER BY id;</p>

      {status === 'loading' && (
        <p className="muted">
          Querying{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
        </p>
      )}

      {status === 'error' && (
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      )}

      {status === 'ready' && count === 0 && (
        <p className="muted">0 rows returned. No projects to show yet.</p>
      )}

      {status === 'ready' && count > 0 && (
        <p className="muted stack-hint">Select a record to lock it, select it again to open it.</p>
      )}
    </section>
  )
}
