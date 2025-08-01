import { CreateChatProps, OnUpdateMessageCallback } from "./src/types"

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void
  onUpdateMessage: (callback: OnUpdateMessageCallback) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
