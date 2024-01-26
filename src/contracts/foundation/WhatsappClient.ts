import { UserFacingSocketConfig, AuthenticationState } from '@whiskeysockets/baileys/lib/Types/index'

interface WhatsappClient {
  start(): Promise<void>
  prepareConfig(): Promise<UserFacingSocketConfig>
  resolveAuthentication(): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
  }>
}


export default WhatsappClient