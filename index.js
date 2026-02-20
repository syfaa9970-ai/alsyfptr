import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"
import pino from "pino"

const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
  logger: pino({ level: "silent" }),
  auth: state,
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async m => {
  const msg = m.messages[0]
  if (!msg.message) return

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text

  if (text === "ping") {
    await sock.sendMessage(msg.key.remoteJid, { text: "pong" })
  }
})
  
