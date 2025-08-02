import { defineStore } from "pinia"
import { MessageProps, MessageStatus, UpdateStreamData } from "../types"
import { db } from "../db"

export interface MessageStore {
  items: MessageProps[]
}

export const useMessageStore = defineStore("message", {
  state: (): MessageStore => ({
    items: [],
  }),
  actions: {
    async fetchMessagesByConversation(conversationId: number) {
      this.items = await db.messages.where({ conversationId }).toArray()
    },
    async createMessage(createdData: Omit<MessageProps, "id">) {
      const newMessageId = await db.messages.add(createdData)
      this.items.push({
        ...createdData,
        id: newMessageId,
      })
      return newMessageId
    },
    async updateMessage(streamData: UpdateStreamData) {
      const { messageId, data } = streamData
      const currentMessage = this.items.find(
        (item: MessageProps) => item.id === messageId
      )
      if (currentMessage) {
        const updatedData = {
          content: currentMessage.content + data.result,
          status: data.is_end ? "finished" : ("streaming" as MessageStatus),
          updatedAt: new Date().toISOString(),
        }
        await db.messages.update(messageId, updatedData)
        const index = this.items.findIndex(
          (item: MessageProps) => item.id === messageId
        )
        if (index !== -1) {
          this.items[index] = {
            ...this.items[index],
            ...updatedData,
          }
        }
      }
    },
  },
  getters: {
    getLastQuestion: (state) => (conversationId: number) => {
      return state.items.findLast(
        (item) =>
          item.conversationId === conversationId && item.type === "question"
      )
    },
    isMessageLoading: (state) => {
      return state.items.some(
        (item) => item.status === "loading" || item.status === "streaming"
      )
    },
  },
})
