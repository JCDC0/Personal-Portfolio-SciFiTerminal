const SHAPES = {
  bottom: {
    fill: 'M0,0 H1 V0.79 Q0.5,1.17 0,0.79 Z',
    edge: 'M0,0.79 Q0.5,1.17 1,0.79',
  },
  top: {
    fill: 'M0,0.24 Q0.5,-0.2 1,0.24 V1 H0 Z',
    edge: 'M0,0.24 Q0.5,-0.2 1,0.24',
  },
}

export default function CurveEdge({ side }) {
  const shape = SHAPES[side]
  return (
    <svg className="curve-edge" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="curve-fill" d={shape.fill} />
      <path className="curve-line" d={shape.edge} />
    </svg>
  )
}
