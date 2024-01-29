import * as baileys from '@whiskeysockets/baileys'

export default <baileys.UserFacingSocketConfig> {
  printQRInTerminal: true,
  browser: baileys.Browsers.macOS('Chrome'),
  syncFullHistory: true,
}

