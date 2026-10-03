/**
 * Domain types for VCG.
 *
 * These mirror the entities in `spec.md` and are shaped the way the Go API is
 * expected to return them, so swapping the mock data layer for real fetches
 * does not require touching components.
 */

/* --------------------------------- RBAC ---------------------------------- */

export type Permission =
  | 'sadhna.view'
  | 'sadhna.create'
  | 'sadhna.edit'
  | 'sadhna.delete'
  | 'feed.view'
  | 'feed.create'
  | 'feed.comment'
  | 'feed.like'
  | 'feed.save'
  | 'feed.report'
  | 'feed.moderate'
  | 'chat.view'
  | 'chat.dm'
  | 'chat.group.view'
  | 'chat.group.create'
  | 'chat.group.manage'
  | 'resource.view'
  | 'resource.create'
  | 'resource.edit'
  | 'resource.delete'
  | 'event.view'
  | 'event.create'
  | 'event.edit'
  | 'event.delete'
  | 'admin.users.approve'
  | 'admin.users.suspend'
  | 'admin.reports.manage'
  | 'admin.roles.manage'

export interface Role {
  id: string
  name: string
  description: string
  /** Permissions are stored separately from roles so admins can define new
   *  roles without a code deployment (spec §20). */
  permissions: Permission[]
  system: boolean
  memberCount: number
}

/* --------------------------------- Users --------------------------------- */

export type AccountStatus =
  | 'REGISTERED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ACTIVE'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'DEACTIVATED'

export interface User {
  id: string
  name: string
  email: string
  /** Two-letter fallback rendered when there is no photo. */
  initials: string
  avatarUrl?: string
  avatarTone: AvatarTone
  bio?: string
  location?: string
  joinedAt: string
  initiatedName?: string
  status: AccountStatus
  roleIds: string[]
  /** Flattened from roles by the API; the client never re-derives it. */
  permissions: Permission[]
}

/** The design fills empty avatars with one of a few warm tones. */
export type AvatarTone = 'sand' | 'clay' | 'dust' | 'stone'

/* ---------------------------------- Feed --------------------------------- */

export interface Flag {
  /** Stable internal identifier — the display label can change freely. */
  id: string
  label: string
  color: string
  description: string
  order: number
  active: boolean
  /** Admin-controlled: whether ordinary devotees may post under this flag. */
  userPostable: boolean
}

export type PostType = 'TEXT' | 'IMAGE' | 'LINK' | 'VIDEO' | 'RESOURCE' | 'EVENT'

export interface PostMedia {
  id: string
  label: string
  /** Relative weight in the media grid; the design uses a 2fr / 1fr split. */
  span: 1 | 2
}

export interface Post {
  id: string
  author: Pick<User, 'id' | 'name' | 'initials' | 'avatarTone' | 'avatarUrl'>
  /** Flag is stored separately from post type (spec §6). */
  flagId: string
  type: PostType
  title: string
  body?: string
  media?: PostMedia[]
  createdAt: string
  /** Pre-formatted relative stamp from the API ("2h", "Yesterday"). */
  timeAgo: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
  savedByMe: boolean
}

export interface Comment {
  id: string
  postId: string
  author: Pick<User, 'id' | 'name' | 'initials' | 'avatarTone' | 'avatarUrl'>
  body: string
  timeAgo: string
  likeCount: number
  likedByMe: boolean
  /** One level of nesting only — deep threads read badly (spec §7). */
  replies: Comment[]
}

export type FeedSort = 'latest' | 'popular' | 'saved'

/* -------------------------------- Sadhna --------------------------------- */

export type SadhnaActivity = 'chanting' | 'reading'

export interface SadhnaEntry {
  id: string
  date: string
  activity: SadhnaActivity
  /** Rounds for chanting, pages for reading. */
  count?: number
  /** Minutes. */
  duration?: number
  resourceId?: string
  resourceTitle?: string
  notes?: string
}

export interface SadhnaDay {
  date: string
  dayOfMonth: number
  rounds: number
  readingMinutes: number
  logged: boolean
  /** Outside the displayed month — rendered dimmed. */
  outside?: boolean
}

/* --------------------------------- Chat ---------------------------------- */

export type ConversationKind = 'dm' | 'group'

export interface Conversation {
  id: string
  kind: ConversationKind
  name: string
  avatarTone: AvatarTone
  initials: string
  lastMessage: string
  lastAt: string
  unread: number
  online?: boolean
  memberCount?: number
  description?: string
}

export interface Message {
  id: string
  conversationId: string
  authorId: string
  authorName: string
  authorInitials: string
  avatarTone: AvatarTone
  body: string
  at: string
  /** Rendered right-aligned in tulsi when true. */
  mine: boolean
  readBy?: number
  replyTo?: { authorName: string; body: string }
}

/* ------------------------------- Resources -------------------------------- */

export type ResourceKind = 'book' | 'pdf' | 'audiobook' | 'youtube'

export interface ResourceChapter {
  n: string
  title: string
  sub: string
  pages: string
}

export interface Resource {
  id: string
  kind: ResourceKind
  title: string
  devanagariTitle?: string
  author: string
  description?: string
  languages?: string[]
  tags?: string[]
  pageCount?: number
  /** Human-readable, e.g. "14h 05m". */
  audioDuration?: string
  chapterCount?: number
  chapters?: ResourceChapter[]
  meta?: string
  savedByMe?: boolean
  /** Personal reading position, when the devotee has started it. */
  progress?: { page: number; of: number }
  related?: { id: string; title: string; meta: string }[]
}

/* -------------------------------- Events ---------------------------------- */

export type EventCategory =
  | 'satsang'
  | 'kirtan'
  | 'seva'
  | 'yatra'
  | 'festival'
  | 'lecture'

export interface EventScheduleRow {
  when: string
  what: string
}

export interface VcgEvent {
  id: string
  title: string
  devanagariTitle?: string
  category: EventCategory
  description?: string
  /** Pre-split for the date chip in the agenda rail. */
  day: string
  mon: string
  startsAt: string
  endsAt?: string
  /** Human date range, e.g. "Tue 27 Oct – Tue 3 Nov 2026". */
  dateLabel?: string
  tithiLabel?: string
  meta: string
  location?: string
  locationDetail?: string
  online: boolean
  organizer?: string
  placesLeft?: number
  registrationEnabled?: boolean
  coverLabel?: string
  schedule?: EventScheduleRow[]
  savedByMe?: boolean
}

export interface CalendarCell {
  day: number
  tithi: string
  outside: boolean
  /** Highlighted (terracotta) — a purnima or otherwise notable day. */
  accent: boolean
  events: { id: string; label: string; color: string }[]
}

/* ----------------------------- Notifications ------------------------------ */

export type NotificationKind =
  | 'reply'
  | 'mention'
  | 'message'
  | 'event'
  | 'account'
  | 'resource'

export interface AppNotification {
  id: string
  kind: NotificationKind
  body: string
  actor?: string
  at: string
  read: boolean
  href: string
}

export interface NotificationPreferences {
  messages: boolean
  replies: boolean
  mentions: boolean
  events: boolean
  resources: boolean
  account: boolean
}

/* -------------------------------- Moderation ------------------------------ */

export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED'
export type ReportTargetKind = 'post' | 'comment' | 'user'

export interface Report {
  id: string
  targetKind: ReportTargetKind
  targetExcerpt: string
  targetAuthor: string
  reporter: string
  reason: string
  description?: string
  status: ReportStatus
  at: string
  moderator?: string
  resolution?: string
  notes?: string
}

/* --------------------------------- Admin ---------------------------------- */

export interface PendingDevotee {
  id: string
  name: string
  email: string
  registeredAt: string
  initials: string
  avatarTone: AvatarTone
  initiatedName?: string
  location?: string
}

export interface AdminMetric {
  label: string
  value: string
  href?: string
  /** Rendered in terracotta when the number needs attention. */
  attention?: boolean
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target: string
  at: string
}
