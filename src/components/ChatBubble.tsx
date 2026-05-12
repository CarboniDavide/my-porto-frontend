import type { Message } from '../types/chat'

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-2 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d66d28] text-white text-xs font-bold">
          AI
        </div>
      )}
      <div
        className={[
          'max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%]',
          isUser
            ? 'rounded-tr-sm bg-[#d66d28] text-white'
            : 'rounded-tl-sm bg-[#fffaf4] text-[#1f2327] border border-[#ebdcc9]',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="mr-2 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d66d28] text-white text-xs font-bold">
        AI
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-[#ebdcc9] bg-[#fffaf4] px-4 py-3">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-[#d66d28] opacity-60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
