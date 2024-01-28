import { UserFacingSocketConfig, AuthenticationState } from '@whiskeysockets/baileys/lib/Types/index'

interface WhatsappClient {
  start(): Promise<void>
  resolveAuthentication(): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
  }>
}


export default WhatsappClient