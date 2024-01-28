import { UserFacingSocketConfig, WASocket, makeWASocket, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom'
import {SocketConnectionEnum, ConnectionStatusEnum, CredEventEnum} from '../enums';
import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';

class WhatsappConnection {
  protected socket: WASocket
  protected config: UserFacingSocketConfig
  protected saveCreds: Function

  constructor(config: UserFacingSocketConfig, saveCreds: Function) {
    this.config = config
    this.saveCreds = saveCreds
  }

  public connectToWhatsapp(): this {
    const socket = makeWASocket(this.config);

    socket.ev.on(SocketConnectionEnum.Update, (update: BaileysEventMap[SocketConnectionEnum.Update]) => {
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
    })

    this.resolveCredentialSaver(socket);

    return this;
  }

  public resolveCredentialSaver(socket: makeWASocket): this {
    socket.ev.on(CredEventEnum.Update, this.saveCreds)

    return this
  }
}

export default WhatsappConnection