import { defineStore } from "pinia"
import { ConversationProps } from "../types"
import { db } from "../db"

export interface ConversationStore {
  items: ConversationProps[]
  selectedId: number
}

export const useConversationStore = defineStore("conversation", {
  state: (): ConversationStore => ({
    items: [],
    selectedId: -1,
  }),
  actions: {
    async fetchConversations() {
      this.items = await db.conversations.toArray()
    },
    async createConversation(createdData: Omit<ConversationProps, "id">) {
      const newCId = await db.conversations.add(createdData)
      this.items.push({
        ...createdData,
        id: newCId,
      })
      return newCId
    },
  },
  getters: {
    totalNumber: (state) => state.items.length,
    getConversationById: (state) => (id: number) => {
      return state.items.find((item) => item.id === id)
    },
  },
})
