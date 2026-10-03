import { permissionsForRoles } from '@/lib/rbac'
import { EVENT_COLORS } from '@/lib/flags'
import { tithiForMonth } from '@/lib/panchang'
import type {
  AdminMetric,
  AppNotification,
  AuditLogEntry,
  CalendarCell,
  Comment,
  Conversation,
  Message,
  NotificationPreferences,
  PendingDevotee,
  Post,
  Report,
  Resource,
  SadhnaDay,
  SadhnaEntry,
  User,
  VcgEvent,
} from '@/types'

/**
 * Mock data layer.
 *
 * Everything here is shaped exactly like the API responses described in
 * `spec.md`, and the content reproduces `VCG Desktop.dc.html` so the
 * implementation can be diffed against the design. Replace the `get*`
 * functions with fetches and the components stay untouched.
 */

/* --------------------------------- Session -------------------------------- */

export const currentUser: User = {
  id: 'u_govind',
  name: 'Govind Das',
  email: 'govind@example.com',
  initials: 'GD',
  avatarTone: 'sand',
  bio: 'Reading Bhagavatam slowly. Seva at the Delhi centre on weekends.',
  location: 'New Delhi',
  joinedAt: '2024-03-11',
  initiatedName: 'Govind Das',
  status: 'ACTIVE',
  roleIds: ['devotee'],
  permissions: permissionsForRoles(['devotee']),
}

/**
 * A second identity used to demonstrate the admin panel and the
 * pending-approval gate without a real auth backend.
 */
export const adminUser: User = {
  ...currentUser,
  id: 'u_admin',
  name: 'Anand Mishra',
  initials: 'AM',
  email: 'anand@example.com',
  roleIds: ['admin'],
  permissions: permissionsForRoles(['admin']),
}

/* ----------------------------------- Feed --------------------------------- */

export const posts: Post[] = [
  {
    id: 'p_travel_japa',
    author: {
      id: 'u_ramesh',
      name: 'Ramesh Kumar',
      initials: 'RK',
      avatarTone: 'clay',
    },
    flagId: 'qna',
    type: 'TEXT',
    title: 'How do you keep chanting steady while travelling?',
    body: "I'm on trains most of next week. Earlier I would lose count and rush through rounds. Curious how others keep their japa attentive on the move. Do you split rounds across the day, or finish them in one sitting before leaving?",
    createdAt: '2026-09-26T06:40:00Z',
    timeAgo: '2h',
    likeCount: 24,
    commentCount: 8,
    likedByMe: false,
    savedByMe: false,
  },
  {
    id: 'p_mangla_darshan',
    author: {
      id: 'u_radhika',
      name: 'Radhika Sharma',
      initials: 'RS',
      avatarTone: 'dust',
    },
    flagId: 'darshan',
    type: 'IMAGE',
    title: 'Mangla darshan this morning',
    media: [
      { id: 'm1', label: 'darshan photo', span: 2 },
      { id: 'm2', label: 'shringar detail', span: 1 },
    ],
    createdAt: '2026-09-26T03:30:00Z',
    timeAgo: '5h',
    likeCount: 112,
    commentCount: 19,
    likedByMe: true,
    savedByMe: false,
  },
  {
    id: 'p_makhan_mishri',
    author: {
      id: 'u_madhav',
      name: 'Madhav Das',
      initials: 'MD',
      avatarTone: 'clay',
    },
    flagId: 'recipe',
    type: 'TEXT',
    title: 'Makhan mishri for bhog, the way my Nani made it',
    body: 'Fresh cream churned by hand, never a mixer — the texture changes completely. Mishri crushed coarse so it still crunches. Offered before it is touched by anyone.',
    createdAt: '2026-09-25T11:00:00Z',
    timeAgo: 'Yesterday',
    likeCount: 63,
    commentCount: 11,
    likedByMe: false,
    savedByMe: true,
  },
  {
    id: 'p_kartik_open',
    author: {
      id: 'u_seva_team',
      name: 'Parivar Seva Team',
      initials: 'PS',
      avatarTone: 'stone',
    },
    flagId: 'announcement',
    type: 'EVENT',
    title: 'Kartik Vraj Yatra registrations are open',
    body: 'Eight days in Vrindavan and Govardhan, 27 Oct – 3 Nov. Shared accommodation at the parivar ashram, prasadam twice daily. 58 places remain.',
    createdAt: '2026-09-24T08:00:00Z',
    timeAgo: '2d',
    likeCount: 208,
    commentCount: 34,
    likedByMe: false,
    savedByMe: true,
  },
  {
    id: 'p_gita_children',
    author: {
      id: 'u_sunita',
      name: 'Sunita Devi',
      initials: 'SD',
      avatarTone: 'dust',
    },
    flagId: 'qna',
    type: 'TEXT',
    title: 'Reading Bhagavatam with children, where to begin?',
    body: 'Our two are seven and ten. We tried reading a few verses after aarti each evening, but they drift off within minutes. Has anyone found stories or an order of cantos that holds their attention?',
    createdAt: '2026-09-23T17:20:00Z',
    timeAgo: '3d',
    likeCount: 47,
    commentCount: 22,
    likedByMe: false,
    savedByMe: false,
  },
  {
    id: 'p_govardhan_walk',
    author: {
      id: 'u_keshav',
      name: 'Keshav Prasad',
      initials: 'KP',
      avatarTone: 'sand',
    },
    flagId: 'yatra',
    type: 'TEXT',
    title: 'Govardhan parikrama in the monsoon — what to carry',
    body: 'Did the full parikrama barefoot last week after the rains. The path is soft but there are stretches of gravel near Jatipura. Carry cloth for your feet and start before four.',
    createdAt: '2026-09-22T05:00:00Z',
    timeAgo: '4d',
    likeCount: 89,
    commentCount: 15,
    likedByMe: false,
    savedByMe: false,
  },
]

export const commentsByPost: Record<string, Comment[]> = {
  p_travel_japa: [
    {
      id: 'c1',
      postId: 'p_travel_japa',
      author: {
        id: 'u_anand',
        name: 'Anand Mishra',
        initials: 'AM',
        avatarTone: 'dust',
      },
      body: "I finish most rounds before leaving and keep only four for the train. A counter ring helps so I'm not reaching for beads in a crowded coach.",
      timeAgo: '1h',
      likeCount: 9,
      likedByMe: false,
      replies: [
        {
          id: 'c1r1',
          postId: 'p_travel_japa',
          author: {
            id: 'u_ramesh',
            name: 'Ramesh Kumar',
            initials: 'RK',
            avatarTone: 'clay',
          },
          body: "That's practical. I'll try the ring, thank you.",
          timeAgo: '48m',
          likeCount: 2,
          likedByMe: false,
          replies: [],
        },
      ],
    },
    {
      id: 'c2',
      postId: 'p_travel_japa',
      author: {
        id: 'u_sunita',
        name: 'Sunita Devi',
        initials: 'SD',
        avatarTone: 'clay',
      },
      body: 'Earphones with a slow kirtan recording in the background keep my pace steady. Otherwise I speed up without noticing.',
      timeAgo: '40m',
      likeCount: 4,
      likedByMe: false,
      replies: [],
    },
    {
      id: 'c3',
      postId: 'p_travel_japa',
      author: {
        id: 'u_madhav',
        name: 'Madhav Das',
        initials: 'MD',
        avatarTone: 'stone',
      },
      body: 'Early morning at the station before the crowd builds has worked well for me. The waiting room is usually quiet until six.',
      timeAgo: '22m',
      likeCount: 6,
      likedByMe: false,
      replies: [],
    },
  ],
}

/** Sidebar copy for the post detail screen — related threads in the same flag. */
export const relatedInFlag: Record<string, { title: string; comments: number }[]> =
  {
    qna: [
      { title: 'Chanting when unwell: fewer rounds or shorter sittings?', comments: 14 },
      { title: 'Which Bhagavatam translation for a first reading?', comments: 22 },
      { title: 'Keeping Ekadashi while at work', comments: 9 },
    ],
  }

/* ---------------------------------- Sadhna -------------------------------- */

export const sadhnaEntries: SadhnaEntry[] = [
  {
    id: 's1',
    date: '2026-09-26',
    activity: 'chanting',
    count: 16,
    duration: 96,
    notes: 'Steady until the twelfth round, then attention wandered.',
  },
  {
    id: 's2',
    date: '2026-09-26',
    activity: 'reading',
    duration: 20,
    count: 9,
    resourceId: 'r_brs',
    resourceTitle: 'Bhakti Rasamrita Sindhu',
  },
  {
    id: 's3',
    date: '2026-09-25',
    activity: 'chanting',
    count: 16,
    duration: 92,
  },
  {
    id: 's4',
    date: '2026-09-25',
    activity: 'reading',
    duration: 35,
    count: 14,
    resourceId: 'r_bhagavatam',
    resourceTitle: 'Srimad Bhagavatam',
  },
  {
    id: 's5',
    date: '2026-09-24',
    activity: 'chanting',
    count: 12,
    duration: 74,
    notes: 'Travelling; split across the day.',
  },
]

/** Six weeks of history for the calendar strip on the sadhna page. */
export function getSadhnaCalendar(): SadhnaDay[] {
  // Deterministic sample so server and client markup match.
  const pattern = [16, 16, 12, 16, 0, 16, 16, 16, 14, 16, 16, 16, 0, 16]
  const reading = [20, 35, 0, 25, 0, 30, 15, 20, 40, 20, 25, 30, 0, 20]
  return pattern.map((rounds, i) => {
    const dayOfMonth = 13 + i
    return {
      date: `2026-09-${`${dayOfMonth}`.padStart(2, '0')}`,
      dayOfMonth,
      rounds,
      readingMinutes: reading[i],
      logged: rounds > 0 || reading[i] > 0,
    }
  })
}

export const sadhnaSummary = {
  weekRounds: 648,
  weekReadingMinutes: 200,
  streakDays: 7,
  todayRounds: 16,
  todayReadingMinutes: 20,
  dailyTarget: 16,
}

/* ----------------------------------- Chat --------------------------------- */

export const conversations: Conversation[] = [
  {
    id: 'cv_ankit',
    kind: 'dm',
    name: 'Ankit Verma',
    initials: 'AV',
    avatarTone: 'clay',
    lastMessage: 'Sent the yatra list — check the third page.',
    lastAt: '11:42',
    unread: 2,
    online: true,
  },
  {
    id: 'cv_delhi',
    kind: 'group',
    name: 'Delhi Centre Seva',
    initials: 'DC',
    avatarTone: 'stone',
    lastMessage: 'Radhika: Annadaan on the 17th, who can come early?',
    lastAt: '10:08',
    unread: 1,
    memberCount: 24,
    description: 'Coordination for seva at the Delhi centre.',
  },
  {
    id: 'cv_ramesh',
    kind: 'dm',
    name: 'Ramesh Kumar',
    initials: 'RK',
    avatarTone: 'dust',
    lastMessage: 'Thank you for the reply on the post 🙏',
    lastAt: 'Yesterday',
    unread: 0,
  },
  {
    id: 'cv_katha',
    kind: 'group',
    name: 'Bhagavatam Katha Study',
    initials: 'BK',
    avatarTone: 'sand',
    lastMessage: 'Madhav: Canto 10 chapter 14 for Sunday.',
    lastAt: 'Yesterday',
    unread: 0,
    memberCount: 61,
    description: 'Weekly reading group, Sundays after satsang.',
  },
  {
    id: 'cv_sunita',
    kind: 'dm',
    name: 'Sunita Devi',
    initials: 'SD',
    avatarTone: 'clay',
    lastMessage: 'Will bring the mishri tomorrow.',
    lastAt: 'Tue',
    unread: 0,
  },
]

export const messagesByConversation: Record<string, Message[]> = {
  cv_ankit: [
    {
      id: 'm1',
      conversationId: 'cv_ankit',
      authorId: 'u_ankit',
      authorName: 'Ankit Verma',
      authorInitials: 'AV',
      avatarTone: 'clay',
      body: 'Radhe Radhe. Are you joining the Kartik yatra this year?',
      at: '11:20',
      mine: false,
    },
    {
      id: 'm2',
      conversationId: 'cv_ankit',
      authorId: 'u_govind',
      authorName: 'Govind Das',
      authorInitials: 'GD',
      avatarTone: 'sand',
      body: 'Radhe Radhe. Planning to — registrations opened this morning.',
      at: '11:24',
      mine: true,
      readBy: 1,
    },
    {
      id: 'm3',
      conversationId: 'cv_ankit',
      authorId: 'u_ankit',
      authorName: 'Ankit Verma',
      authorInitials: 'AV',
      avatarTone: 'clay',
      body: 'Good. The ashram fills quickly, better to register this week.',
      at: '11:39',
      mine: false,
    },
    {
      id: 'm4',
      conversationId: 'cv_ankit',
      authorId: 'u_ankit',
      authorName: 'Ankit Verma',
      authorInitials: 'AV',
      avatarTone: 'clay',
      body: 'Sent the yatra list — check the third page.',
      at: '11:42',
      mine: false,
    },
  ],
}

/* -------------------------------- Resources ------------------------------- */

export const resources: Resource[] = [
  {
    id: 'r_gita',
    kind: 'book',
    title: 'Bhagavad Gita',
    devanagariTitle: 'भगवद्गीता',
    author: 'Vyasadeva',
    description:
      'The seven hundred verses spoken on the field of Kurukshetra, covering karma, jnana and bhakti yoga.',
    languages: ['Sanskrit', 'Hindi', 'English'],
    tags: ['gita', 'core', 'yoga'],
    pageCount: 318,
    audioDuration: '9h 40m',
  },
  {
    id: 'r_bhagavatam',
    kind: 'book',
    title: 'Srimad Bhagavatam',
    devanagariTitle: 'श्रीमद्भागवतम्',
    author: 'Vyasadeva',
    description:
      'The ripened fruit of the Vedic tree, in twelve cantos, culminating in the pastimes of Sri Krishna.',
    languages: ['Sanskrit', 'Hindi', 'English'],
    tags: ['bhagavatam', 'katha', 'core'],
    pageCount: 2140,
    audioDuration: '96h 12m',
  },
  {
    id: 'r_cc',
    kind: 'book',
    title: 'Chaitanya Charitamrita',
    devanagariTitle: 'चैतन्यचरितामृत',
    author: 'Krishnadas Kaviraj',
    description:
      'The life and teachings of Sri Chaitanya Mahaprabhu, in three lilas.',
    languages: ['Bengali', 'Hindi', 'English'],
    tags: ['chaitanya', 'biography'],
    pageCount: 1680,
    audioDuration: '72h 30m',
  },
  {
    id: 'r_brs',
    kind: 'book',
    title: 'Bhakti Rasamrita Sindhu',
    devanagariTitle: 'भक्तिरसामृतसिन्धु',
    author: 'Srila Rupa Goswami',
    description:
      'A systematic treatise on devotional service, composed in Vrindavan in the sixteenth century. Rupa Goswami arranges the work as an ocean with four divisions, describing the stages of bhakti from practice to prema and the relationships through which devotion is tasted.',
    languages: ['Sanskrit', 'Hindi', 'English'],
    tags: ['rasa', 'bhakti', 'goswami'],
    pageCount: 412,
    audioDuration: '14h 05m',
    progress: { page: 88, of: 412 },
    savedByMe: true,
    chapters: [
      {
        n: '1',
        title: 'Eastern Division',
        sub: 'General characteristics of devotional service',
        pages: 'p. 1',
      },
      {
        n: '2',
        title: 'Southern Division',
        sub: 'The ingredients of rasa',
        pages: 'p. 132',
      },
      {
        n: '3',
        title: 'Western Division',
        sub: 'The five primary relationships',
        pages: 'p. 241',
      },
      {
        n: '4',
        title: 'Northern Division',
        sub: 'The secondary rasas',
        pages: 'p. 338',
      },
    ],
    related: [
      { id: 'r_un', title: 'Ujjvala Nilamani', meta: 'Book · Rupa Goswami' },
      {
        id: 'r_brs_lectures',
        title: 'Bhakti Rasamrita Sindhu lectures',
        meta: 'YouTube playlist · 24 videos',
      },
      {
        id: 'p_gita_children',
        title: 'Discussing Chapter 2 in a small group',
        meta: 'Post · Discussion',
      },
    ],
  },
  {
    id: 'r_gl',
    kind: 'book',
    title: 'Govinda Lilamrita',
    author: 'Krishnadas Kaviraj',
    languages: ['Sanskrit', 'English'],
    pageCount: 520,
  },
  {
    id: 'r_vk',
    kind: 'book',
    title: 'Vilap Kusumanjali',
    author: 'Raghunath Das Goswami',
    languages: ['Sanskrit', 'Hindi'],
    pageCount: 164,
  },
  {
    id: 'r_bhag_audio',
    kind: 'audiobook',
    title: 'Srimad Bhagavatam Katha · Canto 10',
    author: 'Parivar Katha Series',
    meta: 'Hindi · 12 chapters · 6h 40m',
    chapterCount: 12,
    audioDuration: '6h 40m',
  },
  {
    id: 'r_cc_audio',
    kind: 'audiobook',
    title: 'Chaitanya Charitamrita · Adi Lila',
    author: 'Parivar Katha Series',
    meta: 'English · 17 chapters · 9h 12m',
    chapterCount: 17,
    audioDuration: '9h 12m',
  },
  {
    id: 'r_kartik_yt',
    kind: 'youtube',
    title: 'Kartik Katha 2025',
    author: 'Radharaman Parivar',
    meta: 'Playlist · 30 videos',
  },
  {
    id: 'r_kirtan_yt',
    kind: 'youtube',
    title: 'Evening kirtan at Radharaman temple',
    author: 'Radharaman Parivar',
    meta: 'Video · 48 min',
  },
  {
    id: 'r_un',
    kind: 'book',
    title: 'Ujjvala Nilamani',
    devanagariTitle: 'उज्ज्वलनीलमणि',
    author: 'Srila Rupa Goswami',
    description:
      'The companion to Bhakti Rasamrita Sindhu, treating madhurya rasa in detail.',
    languages: ['Sanskrit', 'English'],
    tags: ['rasa', 'madhurya', 'goswami'],
    pageCount: 386,
    related: [
      { id: 'r_brs', title: 'Bhakti Rasamrita Sindhu', meta: 'Book · Rupa Goswami' },
    ],
  },
  {
    id: 'r_brs_lectures',
    kind: 'youtube',
    title: 'Bhakti Rasamrita Sindhu lectures',
    author: 'Radharaman Parivar',
    meta: 'YouTube playlist · 24 videos',
    description:
      'A twenty-four part series working through the four divisions of the text.',
    related: [
      { id: 'r_brs', title: 'Bhakti Rasamrita Sindhu', meta: 'Book · Rupa Goswami' },
    ],
  },
  {
    id: 'r_gita_pdf',
    kind: 'pdf',
    title: 'Gita verses for daily recitation',
    author: 'Parivar Study Group',
    meta: 'PDF · 24 pages',
    pageCount: 24,
  },
  {
    id: 'r_ekadashi_pdf',
    kind: 'pdf',
    title: 'Ekadashi observance — a short guide',
    author: 'Parivar Study Group',
    meta: 'PDF · 12 pages',
    pageCount: 12,
  },
]

export function resourcesOfKind(kind: Resource['kind']) {
  return resources.filter((r) => r.kind === kind)
}

/* --------------------------------- Events --------------------------------- */

export const events: VcgEvent[] = [
  {
    id: 'e_satsang_oct3',
    title: 'Saturday Satsang',
    category: 'satsang',
    day: '3',
    mon: 'OCT',
    startsAt: '2026-10-03T19:00:00+05:30',
    meta: 'Online · 7:00 pm',
    online: true,
    description:
      'Weekly satsang with reading, kirtan and discussion. Open to all approved members.',
    organizer: 'Parivar Seva Team',
  },
  {
    id: 'e_ekadashi_oct10',
    title: 'Ekadashi kirtan',
    category: 'kirtan',
    day: '10',
    mon: 'OCT',
    startsAt: '2026-10-10T18:30:00+05:30',
    meta: 'Delhi centre · 6:30 pm',
    online: false,
    location: 'Radharaman Parivar Delhi Centre',
    locationDetail: 'Chittaranjan Park, New Delhi',
    tithiLabel: 'Ekadashi',
  },
  {
    id: 'e_annadaan_oct17',
    title: 'Annadaan seva',
    category: 'seva',
    day: '17',
    mon: 'OCT',
    startsAt: '2026-10-17T09:00:00+05:30',
    meta: 'Mathura · 9:00 am',
    online: false,
    location: 'Mathura',
    locationDetail: 'Near Vishram Ghat',
  },
  {
    id: 'e_vijayadashami',
    title: 'Vijayadashami katha',
    category: 'festival',
    day: '20',
    mon: 'OCT',
    startsAt: '2026-10-20T19:00:00+05:30',
    meta: 'Online · 7:00 pm',
    online: true,
    tithiLabel: 'Dashami',
  },
  {
    id: 'e_sharad_purnima',
    title: 'Sharad Purnima Maharas kirtan',
    category: 'festival',
    day: '26',
    mon: 'OCT',
    startsAt: '2026-10-26T20:00:00+05:30',
    meta: 'Vrindavan · Ashwin Purnima',
    online: false,
    location: 'Sri Radharaman Temple',
    locationDetail: 'Vrindavan, Uttar Pradesh',
    tithiLabel: 'Purnima',
  },
  {
    id: 'e_kartik_yatra',
    title: 'Kartik Vraj Yatra',
    devanagariTitle: 'कार्तिक व्रज यात्रा',
    category: 'yatra',
    day: '27',
    mon: 'OCT',
    startsAt: '2026-10-27T06:00:00+05:30',
    endsAt: '2026-11-03T20:00:00+05:30',
    dateLabel: 'Tue 27 Oct – Tue 3 Nov 2026',
    tithiLabel: 'Kartik Krishna Pratipada – Ashtami',
    meta: '8 days · Vrindavan, Govardhan',
    online: false,
    description:
      'Eight days of parikrama, katha and kirtan through Vrindavan, Govardhan and Barsana during the month of Kartik. Accommodation is shared at the parivar ashram. Prasadam is served twice daily.',
    location: 'Radharaman Parivar Ashram',
    locationDetail: 'Vrindavan, Uttar Pradesh',
    organizer: 'Parivar Seva Team',
    placesLeft: 58,
    registrationEnabled: true,
    coverLabel: 'cover · Govardhan at dusk',
    schedule: [
      {
        when: '27 – 28 Oct',
        what: 'Arrival, Radharaman mangla darshan, Vrindavan parikrama',
      },
      { when: '29 – 31 Oct', what: 'Govardhan parikrama and Radha Kund' },
      { when: '1 – 3 Nov', what: 'Barsana, Nandgaon, closing kirtan' },
    ],
  },
]

/** Events keyed by day-of-month, for the October 2026 grid. */
const OCTOBER_EVENTS: Record<number, { id: string; label: string; color: string }[]> =
  {
    3: [{ id: 'e_satsang_oct3', label: 'Satsang', color: EVENT_COLORS.satsang }],
    10: [
      { id: 'e_ekadashi_oct10', label: 'Ekadashi kirtan', color: EVENT_COLORS.kirtan },
    ],
    17: [{ id: 'e_annadaan_oct17', label: 'Annadaan seva', color: EVENT_COLORS.seva }],
    20: [
      { id: 'e_vijayadashami', label: 'Vijayadashami', color: EVENT_COLORS.festival },
    ],
    24: [{ id: 'e_satsang_oct3', label: 'Satsang', color: EVENT_COLORS.satsang }],
    26: [
      { id: 'e_sharad_purnima', label: 'Sharad Purnima', color: EVENT_COLORS.festival },
    ],
  }

/**
 * Month grid for October 2026. Oct 1 2026 falls on a Thursday, so the grid
 * starts two cells into the first row (Monday-first week).
 */
export function getOctoberCells(): CalendarCell[] {
  const tithi = tithiForMonth(2026, 10)
  const cells: CalendarCell[] = []
  for (let i = 0; i < 35; i++) {
    const d = i - 2
    const inMonth = d >= 1 && d <= 31
    const day = inMonth ? d : d < 1 ? 30 + d : d - 31
    const events = inMonth ? [...(OCTOBER_EVENTS[d] ?? [])] : []

    // The Kartik yatra spans 27 Oct – 3 Nov, so it appears on every day in
    // that range including the trailing November cells.
    if (inMonth && d >= 27) {
      events.push({
        id: 'e_kartik_yatra',
        label: 'Kartik Vraj Yatra',
        color: EVENT_COLORS.yatra,
      })
    } else if (!inMonth && d - 31 >= 1) {
      events.push({ id: 'e_kartik_yatra', label: 'Yatra', color: EVENT_COLORS.yatra })
    }

    cells.push({
      day,
      tithi: inMonth ? (tithi[d] ?? '') : '',
      outside: !inMonth,
      accent: inMonth && d === 26,
      events,
    })
  }
  return cells
}

/* ------------------------------ Notifications ----------------------------- */

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'reply',
    actor: 'Anand Mishra',
    body: 'replied to your post “How do you keep chanting steady while travelling?”',
    at: '1h',
    read: false,
    href: '/posts/p_travel_japa',
  },
  {
    id: 'n2',
    kind: 'message',
    actor: 'Ankit Verma',
    body: 'sent you a message',
    at: '2h',
    read: false,
    href: '/chat/cv_ankit',
  },
  {
    id: 'n3',
    kind: 'mention',
    actor: 'Radhika Sharma',
    body: 'mentioned you in a comment',
    at: '4h',
    read: false,
    href: '/posts/p_mangla_darshan',
  },
  {
    id: 'n4',
    kind: 'event',
    body: 'Kartik Vraj Yatra registrations are open',
    at: 'Yesterday',
    read: false,
    href: '/events/e_kartik_yatra',
  },
  {
    id: 'n5',
    kind: 'resource',
    body: 'New resource added — Bhakti Rasamrita Sindhu lectures',
    at: '2d',
    read: true,
    href: '/resources/r_brs',
  },
  {
    id: 'n6',
    kind: 'account',
    body: 'Your account was approved. Welcome to the parivar.',
    at: '11 Mar 2024',
    read: true,
    href: '/profile',
  },
]

export const defaultNotificationPrefs: NotificationPreferences = {
  messages: true,
  replies: true,
  mentions: true,
  events: true,
  resources: false,
  account: true,
}

/* --------------------------------- Admin ---------------------------------- */

export const adminMetrics: AdminMetric[] = [
  { label: 'Pending approvals', value: '17', href: '/admin/users/pending', attention: true },
  { label: 'Open reports', value: '8', href: '/admin/reports', attention: true },
  { label: 'Upcoming events', value: '6', href: '/events' },
  { label: 'New users this month', value: '42', href: '/admin/users' },
  { label: 'Active users', value: '814', href: '/admin/users' },
]

export const pendingDevotees: PendingDevotee[] = [
  {
    id: 'pd1',
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    registeredAt: '26 Sep 2026',
    initials: 'RK',
    avatarTone: 'clay',
    initiatedName: 'Raseshwar Das',
    location: 'Jaipur',
  },
  {
    id: 'pd2',
    name: 'Meera Joshi',
    email: 'meera.joshi@example.com',
    registeredAt: '26 Sep 2026',
    initials: 'MJ',
    avatarTone: 'dust',
    location: 'Pune',
  },
  {
    id: 'pd3',
    name: 'Harish Chandra',
    email: 'harish@example.com',
    registeredAt: '25 Sep 2026',
    initials: 'HC',
    avatarTone: 'sand',
    initiatedName: 'Hari Sharan Das',
    location: 'Vrindavan',
  },
  {
    id: 'pd4',
    name: 'Lalita Bansal',
    email: 'lalita.b@example.com',
    registeredAt: '24 Sep 2026',
    initials: 'LB',
    avatarTone: 'stone',
    location: 'Mumbai',
  },
]

export const reports: Report[] = [
  {
    id: 'rp1',
    targetKind: 'post',
    targetExcerpt: 'Buy authentic tulsi malas at wholesale rates, DM for price list',
    targetAuthor: 'Unknown Seller',
    reporter: 'Radhika Sharma',
    reason: 'Spam',
    description: 'Commercial posting, repeated across three flags.',
    status: 'OPEN',
    at: '2h',
  },
  {
    id: 'rp2',
    targetKind: 'comment',
    targetExcerpt: 'That is simply wrong, you clearly have not read anything',
    targetAuthor: 'Vikram S',
    reporter: 'Sunita Devi',
    reason: 'Harassment',
    status: 'OPEN',
    at: '6h',
  },
  {
    id: 'rp3',
    targetKind: 'post',
    targetExcerpt: 'Ekadashi dates for next year (incorrect list attached)',
    targetAuthor: 'Mohan Lal',
    reporter: 'Madhav Das',
    reason: 'Incorrect information',
    description: 'The dates do not match the parivar panchang.',
    status: 'UNDER_REVIEW',
    at: 'Yesterday',
    moderator: 'Anand Mishra',
  },
  {
    id: 'rp4',
    targetKind: 'comment',
    targetExcerpt: 'Off-topic political remark on a darshan post',
    targetAuthor: 'Anon',
    reporter: 'Keshav Prasad',
    reason: 'Inappropriate content',
    status: 'RESOLVED',
    at: '3d',
    moderator: 'Anand Mishra',
    resolution: 'Content removed',
    notes: 'Author warned; first offence.',
  },
]

export const auditLog: AuditLogEntry[] = [
  {
    id: 'a1',
    actor: 'Anand Mishra',
    action: 'Approved devotee',
    target: 'Keshav Prasad',
    at: '26 Sep 2026, 09:12',
  },
  {
    id: 'a2',
    actor: 'Anand Mishra',
    action: 'Removed comment',
    target: 'Report rp4',
    at: '23 Sep 2026, 17:40',
  },
  {
    id: 'a3',
    actor: 'Super Admin',
    action: 'Created flag',
    target: 'Book Recommendation',
    at: '21 Sep 2026, 11:02',
  },
  {
    id: 'a4',
    actor: 'Parivar Seva Team',
    action: 'Published event',
    target: 'Kartik Vraj Yatra',
    at: '24 Sep 2026, 08:00',
  },
]

/* --------------------------------- Lookups -------------------------------- */

export function getPost(id: string) {
  return posts.find((p) => p.id === id)
}

export function getResource(id: string) {
  return resources.find((r) => r.id === id)
}

export function getEvent(id: string) {
  return events.find((e) => e.id === id)
}

export function getConversation(id: string) {
  return conversations.find((c) => c.id === id)
}

export function getComments(postId: string) {
  return commentsByPost[postId] ?? []
}

export const savedPosts = posts.filter((p) => p.savedByMe)
export const myPosts = posts.filter((p) => p.author.id === currentUser.id)
export const unreadNotificationCount = notifications.filter((n) => !n.read).length
export const unreadChatCount = conversations.reduce((n, c) => n + c.unread, 0)
