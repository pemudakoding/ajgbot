import { UserFacingSocketConfig, WASocket, makeWASocket, DisconnectReason, AuthenticationState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom'
import {
  SocketConnectionEnum,
  ConnectionStatusEnum,
  CredEventEnum,
  MessageEventEnum
} from '../enums';
import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';
import ResolveMessageAction from '../actions/ResolveMessageAction';
import ConnectionConfigBuilder from '../builders/ConnectionConfigBuilder';
import connection from '../config/connection';

class WhatsappConnection {
  protected socket: WASocket
  protected authentication: () => Promise<{ state: AuthenticationState; saveCreds: () => Promise<void>; }>

  constructor(
    authentication: () => Promise<{ state: AuthenticationState; saveCreds: () => Promise<void>; }>
  ) {
    this.authentication = authentication
  }

  public async connectToWhatsapp(): Promise<void> {
    const { state, saveCreds } = await this.authentication()

    this.socket = makeWASocket(await this.prepareConfig(state))

    this.resolveClientConnection()
    this.resolveCredentialSaver(saveCreds)
    this.resolveMessagesUpsert()
  }

  protected resolveClientConnection(): void {
    this.socket.ev.on(SocketConnectionEnum.Update, (update: BaileysEventMap[SocketConnectionEnum.Update]) => {
      const {connection, lastDisconnect} = update

      const shouldReconnect: boolean = connection === ConnectionStatusEnum.Close
        && ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut)

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
      (messages: BaileysEventMap['messages.upsert']) => ResolveMessageAction.execute(this.socket, messages)
    )
  }

  protected async prepareConfig(state: AuthenticationState): Promise<UserFacingSocketConfig> {
    const builder = new ConnectionConfigBuilder(connection)

    builder.setAuthState(state)

    return builder.build()
  }
}

export default WhatsappConnection