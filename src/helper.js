const babel = require('@babel/core')
const eventExpressionPluginObj = require('./event-expression-plugin-obj')
const jsxExpressionPluginObj = require('./jsx-expression-plugin-obj')
const reactjsComponentPluginObj = require('./reactjs-component-plugin-obj')
const reactjsToHtmlPlugin = require('./reactjs-to-html-plugin')

const START_NOTICE = '['
const END_NOTICE = ']'
const EXPRESSION_HOLDER = '#%%%%%%#'
const COMPOMNET_HOLDER = '#%%%c%%#'
const QMARK = '"'

function handleJsx (source) {
  let result = babel.transform(source, {
    plugins: [
      '@babel/plugin-syntax-jsx', 
      eventExpressionPluginObj.plugin,
      [
        jsxExpressionPluginObj.plugin,
        {
          startNotice: START_NOTICE,
          endNotice: END_NOTICE,
          holder: EXPRESSION_HOLDER
        }
      ], 
      '@babel/plugin-transform-react-jsx',
      [
        reactjsComponentPluginObj.plugin,
        {
          startNotice: START_NOTICE,
          endNotice: END_NOTICE,
          holder: COMPOMNET_HOLDER,
          qmark: '"'
        }
      ]
    ]
  })
  return result.code
}
function handleReactjs (source) {
  let result = babel.transform(source, {
    plugins: [reactjsToHtmlPlugin]
  })
  return result.code
}

function getJSHTMLCode (source) {
  source = handleJsx(source)
  source = handleReactjs(source)
  source = source.replace(new RegExp(eventExpressionPluginObj.eventTempHolder, 'g'), '')
  source = fillFromCache(source, COMPOMNET_HOLDER, reactjsComponentPluginObj.cache)
  source = fillFromCache(source, EXPRESSION_HOLDER, jsxExpressionPluginObj.cache)
  return source
}

function fillFromCache (source, holder, cache) {
  Object.keys(cache).forEach(function (key) {
    source = source.replace(`${START_NOTICE}${holder}${key}${holder}${END_NOTICE}`, `${QMARK}+(${cache[key]})+${QMARK}`)
  })
  return source
}

module.exports = {
  handleJsx,
  handleReactjs,
  getJSHTMLCode
}