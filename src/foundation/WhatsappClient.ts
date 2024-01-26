import { AuthenticationState, UserFacingSocketConfig, useMultiFileAuthState } from '@whiskeysockets/baileys';
import WhatsappClientContract from '../contracts/foundation/WhatsappClient';
import connection from '../config/connection';
import ConnectionConfigBuilder from '../builders/ConnectionConfigBuilder';
import WhatsappConnection from './WhatsappConnection';

class WhatsappClient implements WhatsappClientContract {
  async start(): Promise<void> {
    const configuration = await this.prepareConfig()

    const connection = new WhatsappConnection(configuration, (await this.resolveAuthentication()).saveCreds)

    connection
      .connectToWhatsapp()
      .resolveCredentialSaver()
  }

  async prepareConfig(): Promise<UserFacingSocketConfig> {
    const builder = new ConnectionConfigBuilder(connection)

    builder.setAuthState((await this.resolveAuthentication()).state)

    return builder.build()
  }

  async resolveAuthentication(): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void>; }> {
    return await useMultiFileAuthState('auth_info_baileys')
  }
}

export default WhatsappClient;