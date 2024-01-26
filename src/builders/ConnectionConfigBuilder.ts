import { UserFacingSocketConfig, AuthenticationState } from '@whiskeysockets/baileys/lib/Types/index'

class ConnectionConfigBuilder {
  protected config: UserFacingSocketConfig;

  constructor(config: UserFacingSocketConfig) {
    this.config = config
  }

  public setAuthState(state: AuthenticationState): this {
    this.config.auth = state

    return this;
  }

  public build(): UserFacingSocketConfig
  {
    return this.config
  }
}

export default ConnectionConfigBuilder