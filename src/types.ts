export interface ConversationProps {
  id: number
  title: string
  selectedModel: string
  createdAt: string
  updatedAt: string
  /** 模型提供商ID */
  providerId: string
}
