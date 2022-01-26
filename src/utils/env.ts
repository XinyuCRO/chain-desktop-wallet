type RunMode = 'browser' | 'extension' | 'electron';

export function getRunMode(): RunMode {
  const runModeEnv = process.env.REACT_APP_DESKTOP_WALLET_RUN_MODE;

  if (runModeEnv === 'browser') {
    return 'browser';
  }

  if (runModeEnv === 'extension') {
    return 'extension';
  }

  return 'electron';
}

export function isRunningInElectron() {
  return getRunMode() === 'electron';
}
