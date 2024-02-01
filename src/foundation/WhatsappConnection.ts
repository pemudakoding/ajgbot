import * as baileys from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import {
  SocketConnectionEnum,
  ConnectionStatusEnum,
  CredEventEnum,
  MessageEventEnum
} from '../enums';
import ResolveMessageAction from '../actions/message/ResolveMessageAction.ts';
import ConnectionConfigBuilder from '../builders/ConnectionConfigBuilder';
import connection from '../configs/connection';

class WhatsappConnection {
  protected socket: baileys.WASocket
  protected authentication: () => Promise<{ state: baileys.AuthenticationState; saveCreds: () => Promise<void>; }>

  constructor(
    authentication: () => Promise<{ state: baileys.AuthenticationState; saveCreds: () => Promise<void>; }>
  ) {
    this.authentication = authentication
  }

  public async connectToWhatsapp(): Promise<void> {
    const { state, saveCreds } = await this.authentication()

    this.socket = baileys.makeWASocket(await this.prepareConfig(state))

    this.resolveClientConnection()
    this.resolveCredentialSaver(saveCreds)
    this.resolveMessagesUpsert()
  }

  protected resolveClientConnection(): void {
    this.socket.ev.on(SocketConnectionEnum.Update, (update: baileys.BaileysEventMap[SocketConnectionEnum.Update]) => {
      const {connection, lastDisconnect} = update

      const shouldReconnect: boolean = connection === ConnectionStatusEnum.Close
        && ((lastDisconnect?.error as Boom)?.output?.statusCode !== baileys.DisconnectReason.loggedOut)

      if (shouldReconnect) {
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)

        return this.connectToWhatsapp();
      }

      if(connection === ConnectionStatusEnum.Open) {
        console.log('opened connection')
      }

      return;
    })
  }

  protected resolveCredentialSaver(saveCreds:() => Promise<void>): void {
    this.socket.ev.on(CredEventEnum.Update, saveCreds)
  }

  protected resolveMessagesUpsert(): void {
    this.socket.ev.on(
      MessageEventEnum.Upsert,
      (messages: baileys.BaileysEventMap['messages.upsert']) => ResolveMessageAction.execute(this.socket, messages)
    )
  }

  protected async prepareConfig(state: baileys.AuthenticationState): Promise<baileys.UserFacingSocketConfig> {
    const builder = new ConnectionConfigBuilder(connection)

    builder.setAuthState(state)

    return builder.build()
  }
}

export default WhatsappConnection