const COMPONENT_CACHE = {}

function plugin (babel, options) {
  const t = babel.types
  return {
    visitor: createVisitor(t, options)
  }
}

function createVisitor (t, options) {
  let index = 0,
      { startNotice, holder, endNotice, qmark} = options
  return {
    MemberExpression (path) {
      let node = path.node
      if (node.object.name == 'React' && node.property.name == 'createElement' && t.isIdentifier(path.parent.arguments[0])) {
        let key = `${index++}`
        path.parentPath.replaceWith(t.stringLiteral(`${startNotice}${holder}${key}${holder}${endNotice}`))
        COMPONENT_CACHE[key] = createCompFn(path, qmark)
      }
    }
  }
}

function createCompFn (path, qmark) {
  let args = path.parent.arguments
      fnName = args[0].name,
      paramsStr = ''
  if (args.length > 1) {
    let properties = args[1].properties
    properties = properties.map(function (property) {
      return `${qmark}${property.key.name || property.key.value}${qmark}:${qmark}${property.value.value}${qmark}`
    })
    paramsStr = `{${properties.join(',')}}`
  }
  return `${fnName}(${paramsStr})`
}

module.exports = {
  plugin,
  cache: COMPONENT_CACHE
}
