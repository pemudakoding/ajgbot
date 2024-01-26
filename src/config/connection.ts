import { Browsers } from '@whiskeysockets/baileys'
import { UserFacingSocketConfig } from '@whiskeysockets/baileys/lib/Types/index'

export default <UserFacingSocketConfig> {
  printQRInTerminal: true,
  browser: Browsers.macOS('Chrome'),
  syncFullHistory: true,
}

