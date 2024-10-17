/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-func-assign */
/* eslint-disable no-unused-vars */

/**
 * Based on the initialization script provided by Sourcepoint. Includes callback events that will force a page reload when a user changes their consents.
 * @param {object} options - Options object
 * @param {string} options.propertyId - Sourcepoint property ID
 * @param {boolean} options.propertyHref - Set the property href, defaults to 'https://www.myfitnesspal.com'
 * @param {boolean} options.forceGDPR - Force GDPR mode
 */
function initializeSourcepoint(options) {
  createSourcepointSDK()
  config = {
    accountId: 1849,
    baseEndpoint: 'https://cdn.privacy-mgmt.com',
    usnat: {},
    gdpr: {},
    events: {
      onPrivacyManagerActionStatus(message_type) {
        window.location.reload()
      },
      onMessageChoiceSelect: (message_type, choice_id, choice_type_id) => {
        if (message_type === 'gdpr') {
          window.gdprConsentAccepted = true
        }
      },
      onConsentReady(message_type, consentUUID, euconsent, info) {
        if (window.gdprConsentAccepted && message_type === 'gdpr') {
          window.location.reload()
        }
      },
    },
    targetingParams: {
      forceGDPR: !!options?.forceGDPR,
    },
  }

  if (options?.propertyId) {
    config.propertyId = options.propertyId
  } else {
    config.propertyHref =
      options?.propertyHref || 'https://www.myfitnesspal.com'
    config.joinHref = !!options?.propertyHref
  }

  window._sp_queue = []
  window._sp_ = {
    config,
  }
}

/**
 * Wait until cmp is loaded, return the result of the __tcfapi('ping') call (https://sourcepoint-public-api.readme.io/reference/ping). Useful for determining gdpr applicability.
 * @returns {Promise<object>}
 */
function checkTcfStatus() {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      try {
        window.__tcfapi('ping', 2, (pingReturn) => {
          if (pingReturn.cmpLoaded) {
            clearInterval(intervalId)
            resolve(pingReturn)
          }
        })
      } catch (error) {
        reject(error.message)
      }
    }, 200)
  })
}

/**
 * Check if ads should be restricted based on user consents
 * @param {object} options
 * @param {boolean} options.forceGDPR - Force GDPR mode
 * @returns {Promise<boolean>}
 */
async function shouldRestrictDataProcessing(options) {
  const SOURCEPOINT_US_ADVERTISING_CATEGORY_ID = '648c9c48e17a3c7a82360c52'

  const tcfStatus = await checkTcfStatus()

  return new Promise((resolve, reject) => {
    if (!options?.forceGDPR && !tcfStatus.gdprApplies) {
      window.__gpp('getUserConsentsUsnat', (data, success) => {
        if (!success) {
          reject('Failed to get USNAT consents')
          return
        }
        const advertisingCookieConsentAccepted = data.categories.find(
          ({ _id }) => _id === SOURCEPOINT_US_ADVERTISING_CATEGORY_ID,
        ).consented

        resolve(!advertisingCookieConsentAccepted)
        return
      })
    }
    resolve(false)
  })
}

/**
 * Open Sourcepoint privacy manager modal based on which set of privacy laws apply to the user
 * @param {object} options
 * @param {boolean} options.forceGDPR - Force GDPR privacy manager to open
 */
async function handleSourcepointClick(options) {
  const tcfStatus = await checkTcfStatus()

  if (options?.forceGDPR || tcfStatus.gdprApplies) {
    // check if user should see TCF privacy manager
    window._sp_.gdpr.loadPrivacyManagerModal(1142806)
  } else {
    // check if user should see CCPA privacy manager
    window._sp_.usnat.loadPrivacyManagerModal(1142703)
  }
}

// The contents of this function are provided by Sourcepoint based on their implementation guide. See - https://docs.sourcepoint.com/hc/en-us/articles/23972617137427-GDPR-TCF-and-U-S-Multi-State-Privacy-implementation-guide-web
function createSourcepointSDK() {
  'use strict'
  function _typeof(t) {
    return (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (t) {
            return typeof t
          }
        : function (t) {
            return t &&
              'function' == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t
          })(t)
  }
  !(function () {
    var t = function () {
      var t,
        e,
        o = [],
        n = window,
        r = n
      for (; r; ) {
        try {
          if (r.frames.__tcfapiLocator) {
            t = r
            break
          }
        } catch (t) {}

        if (r === n.top) break
        r = r.parent
      }
      t ||
        (!(function t() {
          var e = n.document,
            o = !!n.frames.__tcfapiLocator

          if (!o)
            if (e.body) {
              var r = e.createElement('iframe')
              ;(r.style.cssText = 'display:none'),
                (r.name = '__tcfapiLocator'),
                e.body.appendChild(r)
            } else setTimeout(t, 5)

          return !o
        })(),
        (n.__tcfapi = function () {
          for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++)
            n[r] = arguments[r]

          if (!n.length) return o
          'setGdprApplies' === n[0]
            ? n.length > 3 &&
              2 === parseInt(n[1], 10) &&
              'boolean' == typeof n[3] &&
              ((e = n[3]), 'function' == typeof n[2] && n[2]('set', !0))
            : 'ping' === n[0]
            ? 'function' == typeof n[2] &&
              n[2]({ gdprApplies: e, cmpLoaded: !1, cmpStatus: 'stub' })
            : o.push(n)
        }),
        n.addEventListener(
          'message',
          function (t) {
            var e = 'string' == typeof t.data,
              o = {}

            if (e)
              try {
                o = JSON.parse(t.data)
              } catch (t) {}
            else o = t.data
            var n =
              'object' === _typeof(o) && null !== o ? o.__tcfapiCall : null
            n &&
              window.__tcfapi(
                n.command,
                n.version,
                function (o, r) {
                  var a = {
                    __tcfapiReturn: {
                      returnValue: o,
                      success: r,
                      callId: n.callId,
                    },
                  }
                  t &&
                    t.source &&
                    t.source.postMessage &&
                    t.source.postMessage(e ? JSON.stringify(a) : a, '*')
                },
                n.parameter,
              )
          },
          !1,
        ))
    }
    'undefined' != typeof module ? (module.exports = t) : t()
  })()
  ;(window.__gpp_addFrame = function (e) {
    if (!window.frames[e])
      if (document.body) {
        var t = document.createElement('iframe')
        ;(t.style.cssText = 'display:none'),
          (t.name = e),
          document.body.appendChild(t)
      } else window.setTimeout(window.__gpp_addFrame, 10, e)
  }),
    (window.__gpp_stub = function () {
      var e = arguments

      if (
        ((__gpp.queue = __gpp.queue || []),
        (__gpp.events = __gpp.events || []),
        !e.length || (1 == e.length && 'queue' == e[0]))
      )
        return __gpp.queue

      if (1 == e.length && 'events' == e[0]) return __gpp.events
      var t = e[0],
        p = e.length > 1 ? e[1] : null,
        s = e.length > 2 ? e[2] : null

      if ('ping' === t)
        p(
          {
            gppVersion: '1.1',
            cmpStatus: 'stub',
            cmpDisplayStatus: 'hidden',
            signalStatus: 'not ready',
            supportedAPIs: [
              '2:tcfeuv2',
              '5:tcfcav1',
              '6:uspv1',
              '7:usnatv1',
              '8:uscav1',
              '9:usvav1',
              '10:uscov1',
              '11:usutv1',
              '12:usctv1',
            ],
            cmpId: 0,
            sectionList: [],
            applicableSections: [],
            gppString: '',
            parsedSections: {},
          },
          !0,
        )
      else if ('addEventListener' === t) {
        'lastId' in __gpp || (__gpp.lastId = 0), __gpp.lastId++
        var n = __gpp.lastId
        __gpp.events.push({ id: n, callback: p, parameter: s }),
          p(
            {
              eventName: 'listenerRegistered',
              listenerId: n,
              data: !0,
              pingData: {
                gppVersion: '1.1',
                cmpStatus: 'stub',
                cmpDisplayStatus: 'hidden',
                signalStatus: 'not ready',
                supportedAPIs: [
                  '2:tcfeuv2',
                  '5:tcfcav1',
                  '6:uspv1',
                  '7:usnatv1',
                  '8:uscav1',
                  '9:usvav1',
                  '10:uscov1',
                  '11:usutv1',
                  '12:usctv1',
                ],
                cmpId: 0,
                sectionList: [],
                applicableSections: [],
                gppString: '',
                parsedSections: {},
              },
            },
            !0,
          )
      } else if ('removeEventListener' === t) {
        for (var a = !1, i = 0; i < __gpp.events.length; i++)
          if (__gpp.events[i].id == s) {
            __gpp.events.splice(i, 1), (a = !0)
            break
          }
        p(
          {
            eventName: 'listenerRemoved',
            listenerId: s,
            data: a,
            pingData: {
              gppVersion: '1.1',
              cmpStatus: 'stub',
              cmpDisplayStatus: 'hidden',
              signalStatus: 'not ready',
              supportedAPIs: [
                '2:tcfeuv2',
                '5:tcfcav1',
                '6:uspv1',
                '7:usnatv1',
                '8:uscav1',
                '9:usvav1',
                '10:uscov1',
                '11:usutv1',
                '12:usctv1',
              ],
              cmpId: 0,
              sectionList: [],
              applicableSections: [],
              gppString: '',
              parsedSections: {},
            },
          },
          !0,
        )
      } else
        'hasSection' === t
          ? p(!1, !0)
          : 'getSection' === t || 'getField' === t
          ? p(null, !0)
          : __gpp.queue.push([].slice.apply(e))
    }),
    (window.__gpp_msghandler = function (e) {
      var t = 'string' == typeof e.data
      try {
        var p = t ? JSON.parse(e.data) : e.data
      } catch (e) {
        p = null
      }

      if ('object' == typeof p && null !== p && '__gppCall' in p) {
        var s = p.__gppCall
        window.__gpp(
          s.command,
          function (p, n) {
            var a = {
              __gppReturn: { returnValue: p, success: n, callId: s.callId },
            }
            e.source.postMessage(t ? JSON.stringify(a) : a, '*')
          },
          'parameter' in s ? s.parameter : null,
          'version' in s ? s.version : '1.1',
        )
      }
    }),
    ('__gpp' in window && 'function' == typeof window.__gpp) ||
      ((window.__gpp = window.__gpp_stub),
      window.addEventListener('message', window.__gpp_msghandler, !1),
      window.__gpp_addFrame('__gppLocator'))
}
