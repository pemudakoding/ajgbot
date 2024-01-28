import WhatsappClient from './src/foundation/WhatsappClient';
import 'dotenv/config'

const whatsappClient = new WhatsappClient();

whatsappClient.start();