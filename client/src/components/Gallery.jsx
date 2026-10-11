import { useEffect, useState } from 'react'
import { imageUrl } from '../imageUrl.js'

function Reel({ title, images }) {
  return (
    <figure className="shot gallery is-reel">
      <div className="gallery-reel" tabIndex={0} aria-label={`${images.length} screenshots of ${title}`}>
        <div className="gallery-track" style={{ '--count': images.length }}>
          {[...images, ...images].map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={imageUrl(src)}
              alt={i < images.length ? `Screenshot ${i + 1} of ${images.length} of ${title}` : ''}
              aria-hidden={i >= images.length || undefined}
            />
          ))}
        </div>
      </div>
    </figure>
  )
}

export default function Gallery({ title, images }) {
  const [index, setIndex] = useState(0)
  const [portrait, setPortrait] = useState(false)
  const first = images[0]

  useEffect(() => {
    if (!first) return
    let live = true
    const probe = new Image()
    probe.onload = () => { if (live) setPortrait(probe.naturalHeight > probe.naturalWidth) }
    probe.src = imageUrl(first)
    return () => { live = false }
  }, [first])

  if (images.length === 0) return null
  if (portrait && images.length > 1) return <Reel title={title} images={images} />
  const shown = Math.min(index, images.length - 1)

  return (
    <figure className="shot gallery">
      <img
        key={images[shown]}
        className="gallery-main"
        src={imageUrl(images[shown])}
        alt={`Screenshot ${shown + 1} of ${images.length} of ${title}`}
      />
      {images.length > 1 && (
        <ul className="list gallery-thumbs">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                className="gallery-thumb"
                aria-label={`Show screenshot ${i + 1}`}
                aria-pressed={i === shown}
                onClick={() => setIndex(i)}
              >
                <img src={imageUrl(src)} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  )
}
