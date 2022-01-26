import path from 'path';
import { isRunningInElectron } from '../../../utils/env';

export class ChainConfig {
  static ChainId = 0x19;

  static RpcUrl = 'https://evm-cronos.crypto.org';

  static ExplorerAPIUrl = 'https://cronos.crypto.org/explorer/api';
}

export function getProviderPreloadScriptPath() {
  if (isRunningInElectron()) {
    const { remote } = window.require('electron');
    // Replace backslash on Windows to forwardslash
    return process.env.NODE_ENV === 'development'
      ? `file://${path.join(
          remote.app.getAppPath().replace(/\\/g, '/'),
          'src/pages/dapp/browser/preload.js',
        )}`
      : `file://${path.join(remote.app.getAppPath().replace(/\\/g, '/'), '../scripts/preload.js')}`;
  }

  // the path is not necessary when running in other environments
  return '';
}
