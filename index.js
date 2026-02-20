import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (text === "ping") {
            sock.sendMessage(msg.key.remoteJid, { text: "pong 🐈" })
        }
    })
}

startBot()
