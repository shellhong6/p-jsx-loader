const React = require('react')
var ReactDOMServer = require('react-dom/server')

function plugin (babel) {
  const t = babel.types
  return {
    visitor: createVisitor(t)
  }
}

function createVisitor (t) {
  return {
    CallExpression (path) {
      let code = path.hub.getCode(),
          callee = path.node.callee
      if (callee.object && callee.object.name == 'React' && callee.property && callee.property.name == 'createElement') {
        path.replaceWith(t.stringLiteral(exeReactjs(code.substring(path.node.start, path.node.end))))
      }
    }
  }
}

function exeReactjs (code) {
  let fn = new Function('React', `return ${code}`)
  return ReactDOMServer.renderToStaticMarkup(fn(React))
}
module.exports = plugin
