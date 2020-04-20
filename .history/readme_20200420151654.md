## 按照
```
npm i p-jsx-loader
```

## webpack中配置
```
// 这只是一个简单实例，请根据自己需要进行调整
module.exports = {
  entry: './index.js',
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][hash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'p-jsx-loader'
      }
    ]
  }
}
```

## 实例

* 老规矩，第一个例子，先上`hello wolrd`:

```
// 源码
export default function (props) {
  return <div>hello world!</div>
}

// 如果是react，@babel/plugin-transform-react-jsx转换后
export default function (props) {
  return React.createElement("div", null, "hello world!");
}

// p-jsx-loader转换后
export default function (props) {
  return '<div>hello world!</div>';
}
```

* 带变量的例子

```
// 源码
export default function (props) {
  return <div>{props.name}</div>
}

// 如果是react，@babel/plugin-transform-react-jsx转换后
export default function (props) {
  return React.createElement("div", null, props.name);
}

// p-jsx-loader转换后
export default function (props) {
  return '<div>'+(props.name)+'</div>';
}
```

* 带逻辑的例子

```
// 源码
export default function (props) {
  let list = props.list
  if (list.length == 0) {
    return <div>暂无数据</div>
  }
  return list.map(function (item, index) {
    return <div>
      <span>任务{index}</span>
      <span>{item.hasDone ? "已完成" : "未完成"}</span>
    </div>
  }).join('')
}

// 如果是react，@babel/plugin-transform-react-jsx转换后
export default function (props) {
  let list = props.list;

  if (list.length == 0) {
    return React.createElement("div", null, "\u6682\u65E0\u6570\u636E");
  }

  return list.map(function (item, index) {
    return React.createElement("div", null, React.createElement("span", null, "\u5F53\u524D\u5E8F\u53F7\u4E3A\uFF1A", index), React.createElement("span", null, item.hasDone ? "已完成" : "未完成"));
  }).join('');
}

// p-jsx-loader转换后
export default function (props) {
  let list = props.list;

  if (list.length == 0) {
    return "<div>\u6682\u65E0\u6570\u636E</div>";
  }

  return list.map(function (item, index) {
    return "<div><span>\u4EFB\u52A1"+(index)+"</span><span>"+(item.hasDone ? "已完成" : "未完成")+"</span></div>";
  }).join('');
}
```

* 带事件监听的例子

```
// 源码
function sayHi (event) {
  let { name } = event.target.dataset
  alert(`Hi,i am ${name}. Nice to meet you!`)
}
export default function (props) {
  return <button data-name={props.name} onClick={sayHi}>say hello</button>
}

// 如果是react，@babel/plugin-transform-react-jsx转换后
function sayHi(event) {
  let {
    name
  } = event.target.dataset;
  alert(`Hi,i am ${name}. Nice to meet you!`);
}

export default function (props) {
  return React.createElement("button", {
    "data-name": props.name,
    onClick: sayHi
  }, "say hello");
}

// p-jsx-loader转换后
function sayHi(event) {
  let {
    name
  } = event.target.dataset;
  alert(`Hi,i am ${name}. Nice to meet you!`);
}

export default function (props) {
  return "<button data-name=\""+(props.name)+"\" onclick=\"window.jsx_loader_event__0sayHi(event)\">say hello</button>";
}
window.jsx_loader_event__0sayHi = sayHi;
```

* 带组件的例子

```
// 源码，main.jsx
import Sub from './sub.jsx'

export default function (props) {
  return <div>
    <p>你好</p>
    welcome to：<Sub name={props.name} cls={props.cls} />
  </div>
}
// 源码，sub.jsx
import './index.css'

export default function (props) {
  return <span className={props.cls}>{props.name}</span>
}

// 如果是react，@babel/plugin-transform-react-jsx转换后，main.jsx
import Sub from './sub.jsx';
export default function (props) {
  return React.createElement("div", null, React.createElement("p", null, "\u4F60\u597D"), "welcome to\uFF1A", React.createElement(Sub, {
    name: props.name,
    cls: props.cls
  }));
}
// 如果是react，@babel/plugin-transform-react-jsx转换后，sub.jsx
import './index.css';
export default function (props) {
  return React.createElement("span", {
    className: props.cls
  }, props.name);
}

// p-jsx-loader转换后，main.jsx
import Sub from './sub.jsx';
export default function (props) {
  return "<div><p>\u4F60\u597D</p>welcome to\uFF1A"+(Sub({"name":""+(props.name)+"","cls":""+(props.cls)+""}))+"</div>";
}
// p-jsx-loader转换后，sub.jsx
import './index.css';
export default function (props) {
  return "<span class=\""+(props.cls)+"\">"+(props.name)+"</span>";
}
```