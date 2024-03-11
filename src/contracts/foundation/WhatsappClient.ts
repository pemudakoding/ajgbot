interface WhatsappClient {
  start: () => Promise<void>
  scheduler: () => WhatsappClient
}


export default WhatsappClient