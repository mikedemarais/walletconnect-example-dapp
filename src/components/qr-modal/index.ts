/* global window setTimeout */

/* tslint:disable */
import * as copy from 'copy-to-clipboard'
import * as qrImage from 'qr-image'
import style from './style'
import asset from './asset'

let document: Document
if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  document = window.document
}

function formatQRCodeImage (data: string) {
  let result = ''
  const dataString = qrImage.imageSync(data, { type: 'svg' })
  if (typeof dataString === 'string') {
    result = dataString.replace('<svg', `<svg style="${style.qrcode.image}"`)
  }
  return result
}

function formatQRCodeModal (uri: string) {
  const qrCodeImage = formatQRCodeImage(uri)
  return `
    <div
      id="walletconnect-qrcode-modal"
      style="${style.qrcode.base}"
      class="animated fadeIn"
    >
      <div style="${style.modal.base}">
        <div style="${style.modal.header}">
          <img src="${asset.logo}" style="${style.modal.headerLogo}" />
          <div style="${style.modal.close.wrapper}">
            <div
              id="walletconnect-qrcode-close"
              style="${style.modal.close.icon}"
            >
              <div style="${style.modal.close.line1}"></div>
              <div style="${style.modal.close.line2}"></div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <button
              id="walletconnect-qrcode-copyButton"
              style="${style.qrcode.copyButton}"
            >
              Copy Raw URI
            </button>
            ${qrCodeImage}
          </div>
        </div>
      </div>
      ${style.animation}
    </div>
`
}

function open (uri: string, cb: any) {
  const wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'walletconnect-wrapper')

  wrapper.innerHTML = formatQRCodeModal(uri)

  document.body.appendChild(wrapper)

  const closeButton = document.getElementById('walletconnect-qrcode-close')
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      close()
      if (cb) {
        cb()
      }
    })
  }

  const copyButton = document.getElementById('walletconnect-qrcode-copyButton')
  if (copyButton) {
    const copyOptions = {
      debug: true,
      format: 'text/plain',
      message: 'Select all, and then copy',
    };

    copyButton.addEventListener('click', () => {
      copy(uri, copyOptions);
      console.log('✅️ Copied to clipboard: ', uri);
    })
    copyButton.addEventListener('touchstart', () => {
      copy(uri, copyOptions)
      console.log('✅️ Copied to clipboard: ', uri);
    })
  }
}

/**
 *  @desc     Close WalletConnect QR Code Modal
 */
function close () {
  const elm = document.getElementById('walletconnect-qrcode-modal')
  if (elm) {
    elm.className = elm.className.replace('fadeIn', 'fadeOut')
    setTimeout(() => {
      const wrapper = document.getElementById('walletconnect-wrapper')
      if (wrapper) {
        document.body.removeChild(wrapper)
      }
    }, style.animationDuration)
  }
}

export default { close, open }
/* tslint:enable */
