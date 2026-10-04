import { GITHUB_URL, RESUME_URL } from '../links.js'

const SKILLS = ['Python', 'Java', 'HTML & CSS', 'Flutter & Dart', 'Kotlin', 'Git & GitHub']
const STRENGTHS = ['Fast learner', 'Critical thinking', 'Problem solver', 'Teamwork']
const LANGUAGES = ['English', 'Tagalog']

function TagList({ items }) {
  return (
    <ul className="tags">
      {items.map((item) => <li key={item} className="tag">{item}</li>)}
    </ul>
  )
}

export default function AboutPanel() {
  return (
    <section className="panel">
      <p className="mono muted">ABOUT // PROFILE</p>
      <h1>About</h1>

      <p className="lede">
        An upcoming Computer Science graduate with a fascination for computers, eager to learn how
        programs, graphics, data and artificial intelligence interact with computers and other IoT
        devices. Eager to collaborate and work with others on coding projects.
      </p>

      <h2>Skills</h2>
      <TagList items={SKILLS} />

      <h2>Strengths</h2>
      <TagList items={STRENGTHS} />

      <h2>Languages</h2>
      <TagList items={LANGUAGES} />

      <div className="actions">
        <a className="button" href={RESUME_URL} target="_blank" rel="noreferrer">Resume (CV)</a>
        <a className="button secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </section>
  )
}
