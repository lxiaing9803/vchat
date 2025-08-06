// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, webUtils } from "electron"
import { AppConfig, CreateChatProps, OnUpdateMessageCallback } from "./types"

contextBridge.exposeInMainWorld("electronAPI", {
  startChat: (data: CreateChatProps) => ipcRenderer.send("start-chat", data),
  onUpdateMessage: (callback: OnUpdateMessageCallback) =>
    ipcRenderer.on("update-message", (event, data) => callback(data)),
  copyImageToUserDir: (sourcePath: string) =>
    ipcRenderer.invoke("copy-image-to-user-dir", sourcePath),
  getFilePath: (file: File) => webUtils.getPathForFile(file),
  getConfig: () => ipcRenderer.invoke("get-config"),
  updateConfig: (config: Partial<AppConfig>) =>
    ipcRenderer.invoke("update-config", config),
  onMenuNewConversation: (callback: () => void) =>
    ipcRenderer.on("menu-new-conversation", () => callback()),
  onMenuOpenSettings: (callback: () => void) =>
    ipcRenderer.on("menu-open-settings", () => callback()),
})
