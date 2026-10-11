export const WORKSPACES = {
  home: { position: [-2600, 250, 2400], shape: 'monolith', label: 'Home Terminal' },
  projects: { position: [3300, -150, 900], shape: 'drum', label: 'Project Records' },
  detail: { position: null, shape: null, label: 'Record Viewer' },
  about: { position: [-1500, -700, -3400], shape: 'icosahedron', label: 'Profile' },
  contact: { position: [2300, 900, -2900], shape: 'relay', label: 'Contact Form' },
  missing: { position: [0, -2600, 1500], shape: 'broken', label: 'Null Sector' },
}

export const PANEL_WIDTH = 880
export const CARD_WIDTH = 820
export const FOV = 50
export const START_POSITION = [0, 900, 7600]

export function workspaceFor(pathname) {
  if (pathname === '/') return 'home'
  if (pathname === '/projects') return 'projects'
  if (/^\/projects\/[^/]+$/.test(pathname)) return 'detail'
  if (pathname === '/about') return 'about'
  if (pathname === '/contact') return 'contact'
  return 'missing'
}
