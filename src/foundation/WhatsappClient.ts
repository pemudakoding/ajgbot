import * as baileys from '@whiskeysockets/baileys'
import type WhatsappClientContract from '../contracts/foundation/WhatsappClient'
import WhatsappConnection from './WhatsappConnection'
import schedule from 'node-schedule';
import DeleteSavedMessagesAction from "../actions/database/DeleteSavedMessagesAction";

class WhatsappClient implements WhatsappClientContract {
  async start (): Promise<void> {
    const connection = new WhatsappConnection(
      async (): Promise<{ state: baileys.AuthenticationState, saveCreds: () => Promise<void> }> => await baileys.useMultiFileAuthState('ajgbotauth')
    )

    await connection.connectToWhatsapp()
  }

  scheduler(): WhatsappClient {
    const dailyScheduleRule = new schedule.RecurrenceRule();

    dailyScheduleRule.hour = 0;
    dailyScheduleRule.minute = 0;

    schedule.scheduleJob(
        dailyScheduleRule,
        () => {
          DeleteSavedMessagesAction.execute()
        }
    )
    return this
  }
}

export default WhatsappClient
