import WhatsappClient from './src/foundation/WhatsappClient'

const whatsappClient: WhatsappClient = new WhatsappClient()

whatsappClient
    .scheduler()
    .start()
