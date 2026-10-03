import type { EventCategory, Flag } from '@/types'

/**
 * Feed flags (spec §5.2).
 *
 * Admin-managed: label, colour, order and `userPostable` are all editable from
 * the admin panel. The `id` is the stable internal identifier and never changes,
 * so posts keep their classification even after a label is renamed.
 *
 * Colours come from the create-post screen in `VCG Desktop.dc.html`.
 */
export const FLAGS: Flag[] = [
  {
    id: 'qna',
    label: 'QnA',
    color: '#4F7A5A',
    description:
      'Questions on sadhna, scripture and practice. Answers come from fellow devotees; for personal guidance, speak with your siksha guru.',
    order: 1,
    active: true,
    userPostable: true,
  },
  {
    id: 'darshan',
    label: 'Darshan',
    color: '#B4613C',
    description: 'Photographs of the Lord, shringar and temple darshan.',
    order: 2,
    active: true,
    userPostable: true,
  },
  {
    id: 'recipe',
    label: 'Recipe',
    color: '#A7822F',
    description: 'Bhog preparations and prasadam recipes.',
    order: 3,
    active: true,
    userPostable: true,
  },
  {
    id: 'yatra',
    label: 'Yatra',
    color: '#5E7390',
    description: 'Pilgrimage, parikrama and travel to the dhams.',
    order: 4,
    active: true,
    userPostable: true,
  },
  {
    id: 'sadhna',
    label: 'Sadhna',
    color: '#7E8F4A',
    description: 'Japa, reading and daily practice.',
    order: 5,
    active: true,
    userPostable: true,
  },
  {
    id: 'seva',
    label: 'Seva',
    color: '#8C6A8A',
    description: 'Service opportunities and seva reports.',
    order: 6,
    active: true,
    userPostable: true,
  },
  {
    id: 'book_recommendation',
    label: 'Book Recommendation',
    color: '#6F7B6E',
    description: 'Granthas worth reading and where to begin.',
    order: 7,
    active: true,
    userPostable: true,
  },
  {
    id: 'experience',
    label: 'Experience',
    color: '#9A7B5E',
    description: 'Realisations and experiences from the path.',
    order: 8,
    active: true,
    userPostable: true,
  },
  {
    id: 'discussion',
    label: 'Discussion',
    color: '#7B6F63',
    description: 'Open discussion within the parivar.',
    order: 9,
    active: true,
    userPostable: true,
  },
  {
    id: 'announcement',
    label: 'Announcement',
    color: '#9A4F2E',
    description: 'Official announcements from the parivar.',
    order: 10,
    active: true,
    // Announcements carry organisational weight, so only roles granted the
    // permission may post under this flag. Surfaces as a locked chip.
    userPostable: false,
  },
]

export function flagById(id: string): Flag {
  return FLAGS.find((f) => f.id === id) ?? FLAGS[FLAGS.length - 1]
}

/** Flags shown as quick filters on the feed; the rest live behind "More". */
export const QUICK_FILTER_FLAGS = ['qna', 'darshan', 'recipe', 'yatra']

/**
 * Event category colours — the calendar dots in screen 1f.
 */
export const EVENT_COLORS: Record<EventCategory, string> = {
  satsang: '#4F7A5A',
  kirtan: '#B4613C',
  seva: '#8C6A8A',
  yatra: '#5E7390',
  festival: '#A7822F',
  lecture: '#6F7B6E',
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  satsang: 'Satsang',
  kirtan: 'Kirtan',
  seva: 'Seva',
  yatra: 'Yatra',
  festival: 'Festival',
  lecture: 'Lecture',
}

/** Report reasons are admin-configurable (spec §7). */
export const REPORT_REASONS = [
  'Spam',
  'Harassment',
  'Inappropriate content',
  'Incorrect information',
  'Other',
]
