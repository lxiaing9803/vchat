import { Dexie } from "dexie"
import type { EntityTable } from "dexie"
import { providers } from "./testData"
import { ConversationProps, MessageProps, ProviderProps } from "./types"

export const db = new Dexie("vChatDatabase") as Dexie & {
  conversations: EntityTable<ConversationProps, "id">
  messages: EntityTable<MessageProps, "id">
  providers: EntityTable<ProviderProps, "id">
}

db.version(1).stores({
  conversations: "++id, providerId",
  messages: "++id, conversationId",
  providers: "++id, name",
})

export const initProviders = async () => {
  const count = await db.providers.count()
  if (count === 0) {
    db.providers.bulkAdd(providers)
  }
}
