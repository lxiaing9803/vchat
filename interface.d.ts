import { CreateChatProps, OnUpdateMessageCallback } from "./src/types"

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void
  onUpdateMessage: (callback: OnUpdateMessageCallback) => void
  copyImageToUserDir: (sourcePath: string) => Promise<string>
  getFilePath: (file: File) => string
  getConfig: () => Promise<AppConfig>
  updateConfig: (config: Partial<AppConfig>) => Promise<AppConfig>
  onMenuNewConversation: (callback: () => void) => void
  onMenuOpenSettings: (callback: () => void) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
