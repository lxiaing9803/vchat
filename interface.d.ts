import { CreateChatProps, OnUpdateMessageCallback } from "./src/types"

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void
  onUpdateMessage: (callback: OnUpdateMessageCallback) => void
  copyImageToUserDir: (sourcePath: string) => Promise<string>
  getFilePath: (file: File) => string
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
