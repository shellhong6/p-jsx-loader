const EVENT_PROPERTY_REGEXP = /on[A-Z][a-z]+/
const GLOBAL_EVENT_PREFIX = 'jsx_loader_event__'
const EVENT_TEMP_HOLDER = '_jsx_loader_event__'
var globalFnNameList = []
var index = 0

function plugin (babel, options) {
  const t = babel.types
  return {
    visitor: createVisitor(t, options)
  }
}

function createVisitor (t) {
  return {
    JSXAttribute (path) {
      let node = path.node
      if (node.name && node.value && node.value.expression && EVENT_PROPERTY_REGEXP.test(node.name.name)) {
        let fnName = node.value.expression.name,
            prefix = GLOBAL_EVENT_PREFIX + (index++),
            globalFnName = `${prefix}${fnName}`
        globalFnNameList.push([fnName, globalFnName])
        node.name.name = `${EVENT_TEMP_HOLDER}${node.name.name.toLowerCase()}`
        let valuePath = path.get("value")
        valuePath.replaceWith(t.stringLiteral(`window.${globalFnName}(event)`))
      }
    },
    Program: {
      exit (path) {
        let fnInfo, expr
        for (let i = 0; i < globalFnNameList.length; i++) {
          fnInfo = globalFnNameList[i]
          expr = t.assignmentExpression(
            '=', 
            t.memberExpression(t.identifier('window'), t.identifier(fnInfo[1])),
            t.identifier(fnInfo[0])
          )
          path.get(`body.${path.node.body.length - 1}`).insertAfter(t.expressionStatement(expr))
        }
        globalFnNameList = []
      }
    }
  }
}
module.exports = {
  plugin,
  eventTempHolder: EVENT_TEMP_HOLDER
}
