window.isDesktopWalletExtensionAvailable = true

const DESKTOP_WALLET_EXTENSION_INFO = {
  name: 'Desktop Wallet Extension',
  identifier: 'desktop-wallet-extension',
  icon: 'https://crypto.org/static/logo-white.1b19213b.svg',
};

if (
  typeof window.desktopWalletExtensions !== 'undefined' &&
  Array.isArray(window.desktopWalletExtensions)
) {
  window.desktopWalletExtensions.push(DESKTOP_WALLET_EXTENSION_INFO);
} else {
  window.desktopWalletExtensions = [DESKTOP_WALLET_EXTENSION_INFO];
}
