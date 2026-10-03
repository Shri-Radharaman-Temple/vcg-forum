'use client'

import * as React from 'react'
import { MapPin, CalendarBlank } from '@phosphor-icons/react'
import { Main, Rail } from '@/components/app/shell'
import { PostCard } from '@/components/app/post-card'
import { useSession } from '@/components/app/session'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty'
import { SectionHead } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROLES } from '@/lib/rbac'
import { posts, savedPosts } from '@/data/mock'
import type { AccountStatus } from '@/types'

type Tab = 'posts' | 'saved'

/**
 * Profile (spec §16). Deliberately minimal — no follower counts, no activity
 * graph. Sadhna is absent by design: it is private and never shown here.
 */
export default function ProfilePage() {
  const { user, actAs, reset } = useSession()
  const [tab, setTab] = React.useState<Tab>('posts')

  const mine = posts.filter((p) => p.author.id === user.id)
  const list = tab === 'posts' ? mine : savedPosts
  const roleNames = user.roleIds
    .map((id) => ROLES.find((r) => r.id === id)?.name)
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <Main className="gap-6 lg:gap-7 px-5 lg:px-14 py-6 lg:py-10">
        <header className="flex flex-wrap items-start gap-4 sm:flex-nowrap sm:gap-6">
          <Avatar
            initials={user.initials}
            tone={user.avatarTone}
            src={user.avatarUrl}
            size="2xl"
            className="h-[72px] w-[72px] text-[22px] sm:h-24 sm:w-24 sm:text-[28px]"
          />
          <div className="flex min-w-0 flex-1 basis-[180px] flex-col gap-2">
            <div className="flex flex-wrap items-baseline gap-x-3.5">
              <h1 className="m-0 text-[26px] font-light leading-[1.1] sm:text-[32px]">
                {user.name}
              </h1>
              {user.initiatedName && user.initiatedName !== user.name ? (
                <span className="deva text-[20px]">{user.initiatedName}</span>
              ) : null}
            </div>
            {user.bio ? (
              <p className="m-0 max-w-[560px] text-[15px] font-light leading-[1.6] text-ink-3">
                {user.bio}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] font-light text-muted">
              {user.location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} weight="light" />
                  {user.location}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <CalendarBlank size={15} weight="light" />
                Joined {new Date(user.joinedAt).getFullYear()}
              </span>
              <span>{roleNames}</span>
            </div>
          </div>
          <Button variant="outline" className="max-sm:w-full">
            Edit profile
          </Button>
        </header>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="border-b border-line">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col pb-12">
          {list.length === 0 ? (
            <EmptyState
              title={tab === 'posts' ? 'No posts yet' : 'Nothing saved yet'}
              body={
                tab === 'posts'
                  ? 'Anything you post to the parivar appears here.'
                  : 'Saved posts are private — only you can see this list.'
              }
            />
          ) : (
            list.map((p, i) => (
              <PostCard key={p.id} post={p} last={i === list.length - 1} />
            ))
          )}
        </div>
      </Main>

      <Rail width={300} className="lg:px-7">
        <div className="flex flex-col gap-3">
          <SectionHead title="Privacy" />
          {[
            'Who can send me a direct message',
            'Show my profile to the community',
            'Show my online status',
          ].map((label) => (
            <label
              key={label}
              className="flex cursor-pointer items-center justify-between gap-3 border-t border-line py-3 text-[14px] font-light text-ink-2"
            >
              {label}
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 shrink-0 accent-[#4F7A5A]"
              />
            </label>
          ))}
        </div>

        {/* Demo control: re-issues the session so the RBAC gates and the
            approval screen can be exercised without a backend. */}
        <div className="flex flex-col gap-2.5 rounded-[12px] border border-dashed border-line p-4">
          <span className="text-[13px] text-ink">Demo · view the app as</span>
          <span className="text-[12px] font-light leading-[1.5] text-muted">
            The choice is remembered across reloads so the gates can be checked
            on any screen.
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => actAs({ roleIds: [role.id], status: 'ACTIVE' })}
                className="rounded-[8px] border border-line-strong px-2.5 py-1 text-[12px] font-light text-ink-4 transition-colors hover:border-tulsi hover:text-tulsi-ink"
              >
                {role.name}
              </button>
            ))}
            {(['PENDING_APPROVAL', 'SUSPENDED'] as AccountStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => actAs({ status: s })}
                className="rounded-[8px] border border-line-strong px-2.5 py-1 text-[12px] font-light capitalize text-ink-4 transition-colors hover:border-terracotta hover:text-terracotta"
              >
                {s.replace('_', ' ').toLowerCase()}
              </button>
            ))}
            <button
              type="button"
              onClick={reset}
              className="rounded-[8px] border border-line-strong px-2.5 py-1 text-[12px] font-light text-ink-4 transition-colors hover:border-line-deep"
            >
              Reset
            </button>
          </div>
        </div>
      </Rail>
    </>
  )
}
