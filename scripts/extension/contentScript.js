import extension from 'extensionizer'
import PortStream from 'extension-port-stream'
import LocalMessageDuplexStream from 'post-message-stream'

if (shouldInjectProvider()) {
  injectScript()
  start()
}

function injectScript() {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (e) {
    console.error('Provider injection failed.', e)
  }
}

async function start() {
  await setupStreams()
  await domIsReady()
}

function shouldInjectProvider() {
  return docTypeCheck() && suffixCheck() && documentElementCheck()
}

function docTypeCheck() {
  const { doctype } = window.document
  if (doctype) {
    return doctype.name === 'html'
  }
  return true
}

function suffixCheck() {
  const prohibitedTypes = [/\.xml$/, /\.pdf$/]
  const currentUrl = window.location.pathname
  for (let i = 0; i < prohibitedTypes.length; i += 1) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false
    }
  }
  return true
}

function documentElementCheck() {
  const documentElement = document.documentElement.nodeName
  if (documentElement) {
    return documentElement.toLowerCase() === 'html'
  }
  return true
}

async function setupStreams() {
  const pageStream = new LocalMessageDuplexStream({
    name: 'DesktopWalletExt:content',
    target: 'DesktopWalletExt:inpage',
  });

  const extensionPort = extension.runtime.connect({
    name: 'DesktopWalletExtension',
  })

  const extensionStream = new PortStream(extensionPort)

  extensionStream.pipe(pageStream)
  pageStream.pipe(extensionStream)
}

function domIsReady() {
  // already loaded
  if (['interactive', 'complete'].includes(document.readyState)) {
    return Promise.resolve()
  }

  // wait for load
  return new Promise((resolve) =>
    window.addEventListener('DOMContentLoaded', resolve, { once: true })
  )
}
