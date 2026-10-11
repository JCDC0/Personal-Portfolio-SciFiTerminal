import { useState } from 'react'
import { imageUrl } from '../imageUrl.js'

export function projectImages(project) {
  return [...new Set([project.image_url, ...(project.screenshots ?? [])].filter(Boolean))]
}

export default function ProjectThumbs({ project, className }) {
  const images = projectImages(project)
  const [portrait, setPortrait] = useState(false)

  if (images.length === 0) return <span className={`${className} thumbs is-empty`} />

  const strip = portrait && images.length > 1

  return (
    <span className={`${className} thumbs${strip ? ' is-strip' : ''}`}>
      {(strip ? images.slice(0, 3) : images.slice(0, 1)).map((src, index) => (
        <img
          key={src}
          src={imageUrl(src)}
          alt=""
          loading="lazy"
          onLoad={index === 0 ? (event) => setPortrait(event.currentTarget.naturalHeight > event.currentTarget.naturalWidth) : undefined}
        />
      ))}
    </span>
  )
}
