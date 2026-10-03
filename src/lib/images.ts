/** Local artwork used wherever the design shows a hatched image area. */
const COVERS = Array.from({ length: 6 }, (_, i) => `/images/cover-${i + 1}.svg`)
const VIDEOS = ['/images/video-1.svg', '/images/video-2.svg']
const SCENES = ['/images/scene-dusk.svg', '/images/scene-dawn.svg', '/images/scene-evening.svg']

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export const bookCover = (id: string) => COVERS[hash(id) % COVERS.length]
export const videoThumb = (id: string) => VIDEOS[hash(id) % VIDEOS.length]
export const sceneCover = (id: string) => SCENES[hash(id) % SCENES.length]

const MEDIA_BY_LABEL: Record<string, string> = {
  'darshan photo': '/images/darshan.svg',
  'shringar detail': '/images/shringar.svg',
}
export const postMedia = (label: string, id: string) =>
  MEDIA_BY_LABEL[label] ?? sceneCover(id)
