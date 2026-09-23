import { useState } from 'react'
import { sendMessage } from '../api'

const EMPTY_FORM = { name: '', email: '', message: '' }

export default function ContactPanel() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      await sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      })
      setForm(EMPTY_FORM)
      setStatus('sent')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }

  return (
    <section className="panel">
      <p className="mono muted">CONTACT // OPEN CHANNEL</p>
      <h1>Contact</h1>

      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="name">Name</label>
        <input id="name" value={form.name} onChange={update('name')} maxLength={120} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={form.email} onChange={update('email')} maxLength={254} required />

        <label htmlFor="message">Message</label>
        <textarea id="message" value={form.message} onChange={update('message')} maxLength={2000} rows={5} required />

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send'}
        </button>
      </form>

      {status === 'sent' && <p className="mono" role="status">MESSAGE RECEIVED. Thank you.</p>}
      {status === 'error' && <p className="error" role="alert">{error.message}</p>}
    </section>
  )
}
