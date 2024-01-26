import { UserFacingSocketConfig, WASocket, makeWASocket, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom'
import {SocketConnectionEnum, ConnectionStatusEnum, CredEventEnum} from '../enums';
import { BaileysEventMap } from '@whiskeysockets/baileys/lib/Types';

class WhatsappConnection {
  protected socket: WASocket
  protected saveCreds: Function

  constructor(config: UserFacingSocketConfig, saveCreds: Function) {
    this.socket = makeWASocket(config)
    this.saveCreds = saveCreds
  }

  public connectToWhatsapp(): this {
    this.socket.ev.on(SocketConnectionEnum.Update, (update: BaileysEventMap[SocketConnectionEnum.Update]) => {
      const {connection, lastDisconnect} = update

      if(connection === ConnectionStatusEnum.Open) {
        console.log('opened connection')
      }

      const shouldReconnect: boolean = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

      if (connection === ConnectionStatusEnum.Close && shouldReconnect) {
        console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)

        this.connectToWhatsapp();
      }
    })

    return this;
  }

  public resolveCredentialSaver(): this {
    this.socket.ev.on(CredEventEnum.Update, this.saveCreds)

    return this
  }
}

export default WhatsappConnection