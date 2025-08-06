import { app, BrowserWindow, ipcMain, net, protocol } from "electron"
import path from "node:path"
import started from "electron-squirrel-startup"
import "dotenv/config"
import { CreateChatProps } from "./types"
import fs from "fs/promises"
import url from "url"
import { createProvider } from "./providers/createProvider"
// import { lookup } from "mime-types"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })
  protocol.handle("safe-file", async (request) => {
    const filePath = decodeURIComponent(
      request.url.slice("safe-file://".length)
    )
    // const data = await fs.readFile(filePath)
    // return new Response(data, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": lookup(filePath) as string,
    //   },
    // })
    const newFilePath = url.pathToFileURL(filePath).toString()
    return net.fetch(newFilePath)
  })
  ipcMain.handle(
    "copy-image-to-user-dir",
    async (event, sourcePath: string) => {
      const userDataPath = app.getPath("userData")
      const imagesDir = path.join(userDataPath, "images")
      await fs.mkdir(imagesDir, { recursive: true })
      const fileName = path.basename(sourcePath)
      const destPath = path.join(imagesDir, fileName)
      await fs.copyFile(sourcePath, destPath)
      return destPath
    }
  )
  ipcMain.on("start-chat", async (event, data: CreateChatProps) => {
    const { messages, provideName, selectedModel, messageId } = data
    const provider = createProvider(provideName)
    const stream = await provider.chat(messages, selectedModel)
    for await (const chunk of stream) {
      const content = {
        messageId,
        data: {
          is_end: chunk.is_end,
          result: chunk.result,
        },
      }
      mainWindow.webContents.send("update-message", content)
    }
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
