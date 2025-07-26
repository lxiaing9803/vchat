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
}
