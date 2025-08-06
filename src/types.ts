export interface ConversationProps {
  id: number
  title: string
  selectedModel: string
  createdAt: string
  updatedAt: string
  /** 模型提供商ID */
  providerId: number
}

export interface ProviderProps {
  id: number
  name: string
  models: string[]
  title?: string
  desc?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export type MessageStatus = "loading" | "streaming" | "finished"
export interface MessageProps {
  id: number
  content: string
  type: "question" | "answer"
  conversationId: number
  createdAt: string
  updatedAt: string
  status?: MessageStatus
  imagePath?: string
}

export type MessageRoleType = "user" | "assistant"

export interface ChatMessageProps {
  role: MessageRoleType
  content: string
  imagePath?: string
}

export interface CreateChatProps {
  messages: ChatMessageProps[]
  provideName: string
  selectedModel: string
  messageId: number
}

export interface UpdateStreamData {
  messageId: number
  data: {
    is_end: boolean
    result: string
  }
}

export type OnUpdateMessageCallback = (data: UpdateStreamData) => void

export interface MessageListInstance {
  ref: HTMLElement
}

export interface UniversalChunkProps {
  is_end: boolean
  result: string
}

export interface BaiduChunkProps {
  is_end: boolean
  result: string
}
