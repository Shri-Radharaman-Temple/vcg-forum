import { notFound } from 'next/navigation'
import { ChatView } from '@/components/app/chat-view'
import { getConversation } from '@/data/mock'

/** Deep link to one conversation — what a "New message" notification targets. */
export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!getConversation(id)) notFound()
  return <ChatView initialConversationId={id} />
}
