import extension from "extensionizer"
import PortStream from "extension-port-stream"

const connectRemote = (remotePort) => {
  if (remotePort.name !== 'DesktopWalletExtension') {
    return;
  }

  const origin = remotePort.sender.origin

  console.log("DesktopWalletExt(background): connectRemote", remotePort)
  const portStream = new PortStream(remotePort)

  const sendResponse = (name, payload) => {
    portStream.write({ name, payload })
  }

  portStream.on("data", (data) => {
    console.log('DesktopWalletExt(background): portStream.on', data);
    const { type, ...payload } = data
    // TODO: handle data
  })
}

extension.runtime.onConnect.addListener(connectRemote)

let tabId = undefined
extension.tabs.onRemoved.addListener(() => (tabId = undefined))

const POPUP_WIDTH = 480
const POPUP_HEIGHT = 600

const getCenter = (window) => {
  return {
    top: Math.floor(window.height / 2 - POPUP_HEIGHT / 2),
    left: Math.floor(window.width / 2 - POPUP_WIDTH / 2),
  }
}

const openPopup = () => {
  const popup = {
    type: "popup",
    focused: true,
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
  }
  !tabId &&
    extension.tabs.create(
      { url: extension.extension.getURL("index.html"), active: false },
      (tab) => {
        tabId = tab.id
        extension.windows.getCurrent((window) => {
          const center = getCenter(window)
          const top = Math.max(center.top, 0) || 0
          const left = Math.max(center.left, 0) || 0

          const config = { ...popup, tabId: tab.id, top, left }
          extension.windows.create(config)
        })
      }
    )
}

const closePopup = () => {
  tabId && extension.tabs.remove(tabId)
}
