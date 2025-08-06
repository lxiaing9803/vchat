import { BaseProvider } from "./BaseProvider"
import { OpenAIProvider } from "./OpenAIProvider"
import { QianfanProvider } from "./QianfanProvider"

export const createProvider = (providerName: string): BaseProvider => {
  const accessKey = process.env["QIANFAN_ACCESS_KEY"]
  const secretKey = process.env["QIANFAN_SECRET_KEY"]
  const apiKey = process.env["ALI_API_KEY"]
  const dsApiKey = process.env["DS_API_KEY"]
  switch (providerName) {
    case "qianfan":
      if (!accessKey || !secretKey) {
        throw new Error("QIANFAN_ACCESS_KEY or QIANFAN_SECRET_KEY is not set")
      }
      return new QianfanProvider(accessKey, secretKey)
    case "dashscope":
      if (!apiKey) {
        throw new Error("ALI_API_KEY is not set")
      }
      return new OpenAIProvider(
        apiKey,
        "https://dashscope.aliyuncs.com/compatible-mode/v1"
      )
    case "deepseek":
      if (!dsApiKey) {
        throw new Error("DS_API_KEY is not set")
      }
      return new OpenAIProvider(dsApiKey, "https://api.deepseek.com/v1")
    default:
      throw new Error(`Unsupported provider: ${providerName}`)
  }
}
