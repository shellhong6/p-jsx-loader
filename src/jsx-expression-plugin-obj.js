const EXPRESSION_CACHE = {}

function plugin (babel, options) {
  const t = babel.types
  return {
    visitor: createVisitor(t, options)
  }
}

function createVisitor (t, options) {
  let key, code, keyIndex = 0
  let { startNotice, holder, endNotice} = options
  function _baseDeal (path, property) {
    key = `${keyIndex++}`
    code = path.hub.getCode()
    EXPRESSION_CACHE[key] = code.substring(path.node[property].start, path.node[property].end)
    path.replaceWith(t.stringLiteral(`${startNotice}${holder}${key}${holder}${endNotice}`))
  }
  return {
    JSXExpressionContainer (path) {
      _baseDeal(path, 'expression')
    },
    JSXSpreadAttribute (path) {
      _baseDeal(path, 'argument')
    }
  }
}
module.exports = {
  plugin,
  cache: EXPRESSION_CACHE
}
