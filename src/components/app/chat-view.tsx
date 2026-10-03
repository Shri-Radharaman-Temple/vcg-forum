'use client'

import * as React from 'react'
import {
  ChatCircle,
  DotsThree,
  MagnifyingGlass,
  PaperPlaneTilt,
  Paperclip,
  Plus,
  Users,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/components/app/session'
import { can } from '@/lib/rbac'
import { cn } from '@/lib/utils'
import {
  conversations,
  messagesByConversation,
  getConversation,
} from '@/data/mock'
import type { Message } from '@/types'

type Filter = 'all' | 'dm' | 'group'

/**
 * Chat (spec §10). Three columns inside the app frame: conversation list,
 * thread, and details. Realtime delivery comes from Soketi in production —
 * the send path still writes through REST so Postgres stays the source of
 * truth (spec §11).
 *
 * `initialConversationId` lets /chat/[id] open a specific thread, so a
 * notification can deep-link straight to the conversation it refers to.
 */
export function ChatView({
  initialConversationId,
}: {
  initialConversationId?: string
}) {
  const { user } = useSession()
  const [filter, setFilter] = React.useState<Filter>('all')
  const [activeId, setActiveId] = React.useState(
    initialConversationId && getConversation(initialConversationId)
      ? initialConversationId
      : conversations[0].id,
  )
  const [draft, setDraft] = React.useState('')
  const [sent, setSent] = React.useState<Message[]>([])

  const active = getConversation(activeId)
  const list = conversations.filter((c) =>
    filter === 'all' ? true : c.kind === filter,
  )
  const messages = [...(messagesByConversation[activeId] ?? []), ...sent]

  const send = () => {
    if (!draft.trim()) return
    setSent((prev) => [
      ...prev,
      {
        id: `local_${prev.length}`,
        conversationId: activeId,
        authorId: user.id,
        authorName: user.name,
        authorInitials: user.initials,
        avatarTone: user.avatarTone,
        body: draft.trim(),
        at: 'now',
        mine: true,
      },
    ])
    setDraft('')
  }

  return (
    <>
      {/* Conversation list */}
      <div className="flex w-[320px] shrink-0 flex-col border-r border-line">
        <div className="flex flex-col gap-3.5 px-6 pb-4 pt-10">
          <div className="flex items-center justify-between">
            <h1 className="m-0 text-[28px] font-light leading-none">Chat</h1>
            {can(user, 'chat.group.create') ? (
              <button
                type="button"
                aria-label="New group"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line-strong text-ink-4 transition-colors hover:border-line-deep"
              >
                <Plus size={15} weight="light" />
              </button>
            ) : null}
          </div>

          <label className="flex h-9 items-center gap-2.5 rounded-[10px] border border-line-strong bg-surface px-3 focus-within:border-tulsi">
            <MagnifyingGlass size={16} weight="light" className="text-muted-2" />
            <input
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="flex-1 bg-transparent text-[14px] font-light placeholder:text-muted-2 focus:outline-none"
            />
          </label>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="gap-5 text-[14px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="dm">Direct</TabsTrigger>
              <TabsTrigger value="group">Groups</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="scroll-quiet flex-1 overflow-y-auto">
          {list.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveId(c.id)
                // Keep the URL in step without a full navigation, so the open
                // thread can be copied, bookmarked or reloaded.
                window.history.replaceState(null, '', `/chat/${c.id}`)
              }}
              className={cn(
                'flex w-full items-start gap-3 border-b border-line px-6 py-3.5 text-left transition-colors',
                c.id === activeId ? 'bg-tulsi-tint/60' : 'hover:bg-[#EFE8DC]',
              )}
            >
              <span className="relative">
                <Avatar initials={c.initials} tone={c.avatarTone} size="lg" />
                {c.online ? (
                  <span className="absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full border-2 border-ground bg-tulsi" />
                ) : null}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] text-ink">{c.name}</span>
                  <span className="shrink-0 text-[11px] font-light text-muted-2">
                    {c.lastAt}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="truncate text-[13px] font-light text-muted">
                    {c.lastMessage}
                  </span>
                  {c.unread ? (
                    <span className="ml-auto flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] text-[#F7F2EA]">
                      {c.unread}
                    </span>
                  ) : null}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      {active ? (
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-line px-8 py-[18px]">
            <Avatar
              initials={active.initials}
              tone={active.avatarTone}
              size="lg"
            />
            <div className="flex flex-col">
              <span className="text-[16px] text-ink">{active.name}</span>
              <span className="text-[12px] font-light text-muted">
                {active.kind === 'group'
                  ? `${active.memberCount} members`
                  : active.online
                    ? 'Online'
                    : 'Offline'}
              </span>
            </div>
            <span className="flex-1" />
            <button
              type="button"
              aria-label="Conversation options"
              className="text-ink-5 transition-colors hover:text-ink"
            >
              <DotsThree size={22} weight="light" />
            </button>
          </header>

          <div className="scroll-quiet flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-6">
            {messages.length === 0 ? (
              <EmptyState
                icon={ChatCircle}
                title="No messages yet"
                body="Say Radhe Radhe to begin the conversation."
                className="my-auto"
              />
            ) : (
              messages.map((m) => <Bubble key={m.id} message={m} />)
            )}
          </div>

          {can(user, 'chat.dm') ? (
            <div className="flex items-center gap-2.5 border-t border-line px-8 py-4">
              <button
                type="button"
                aria-label="Attach file"
                className="text-ink-5 transition-colors hover:text-ink"
              >
                <Paperclip size={20} weight="light" />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Write a message…"
                aria-label="Message"
                className="h-10 flex-1 rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] font-light placeholder:text-muted-2 focus:border-tulsi focus:outline-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-tulsi text-[#F7F2EA] transition-opacity disabled:opacity-40"
              >
                <PaperPlaneTilt size={18} weight="light" />
              </button>
            </div>
          ) : null}
        </main>
      ) : null}

      {/* Details rail */}
      {active ? (
        <aside className="scroll-quiet flex w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-l border-line px-7 py-10">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Avatar
              initials={active.initials}
              tone={active.avatarTone}
              size="2xl"
            />
            <span className="text-[18px] font-light text-ink">{active.name}</span>
            {active.description ? (
              <span className="text-[13px] font-light leading-[1.55] text-muted">
                {active.description}
              </span>
            ) : null}
          </div>

          {active.kind === 'group' ? (
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-[15px]">
                <Users size={17} weight="light" className="text-muted" />
                {active.memberCount} members
              </span>
              {can(user, 'chat.group.manage') ? (
                <button
                  type="button"
                  className="rounded-[10px] border border-line-strong py-2 text-[14px] font-light text-ink-2 transition-colors hover:border-line-deep"
                >
                  Manage group
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-line pt-4 text-[13px] font-light text-muted">
            <span>
              Messages are delivered in realtime and stored within the parivar
              community. Only members of this conversation can read them.
            </span>
          </div>
        </aside>
      ) : null}
    </>
  )
}

function Bubble({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        'flex max-w-[70%] gap-2.5',
        message.mine && 'ml-auto flex-row-reverse',
      )}
    >
      {!message.mine ? (
        <Avatar
          initials={message.authorInitials}
          tone={message.avatarTone}
          size="md"
          className="mt-auto"
        />
      ) : null}
      <div
        className={cn(
          'flex flex-col gap-1 rounded-[12px] px-3.5 py-2.5',
          message.mine
            ? 'bg-tulsi text-[#F7F2EA]'
            : 'border border-line bg-surface text-ink-2',
        )}
      >
        <span className="text-[15px] font-light leading-[1.55]">
          {message.body}
        </span>
        <span
          className={cn(
            'text-[11px] font-light',
            message.mine ? 'text-[#DCE7DD]' : 'text-muted-2',
          )}
        >
          {message.at}
          {message.mine && message.readBy ? ' · Read' : ''}
        </span>
      </div>
    </div>
  )
}
