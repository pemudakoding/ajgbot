import * as baileys from '@whiskeysockets/baileys'

class ConnectionConfigBuilder {
  protected config: baileys.UserFacingSocketConfig;

  constructor(config: baileys.UserFacingSocketConfig) {
    this.config = config
  }

  public setAuthState(state: baileys.AuthenticationState): this {
    this.config.auth = state

    return this;
  }

  public build(): baileys.UserFacingSocketConfig
  {
    return this.config
  }
}

export default ConnectionConfigBuilder