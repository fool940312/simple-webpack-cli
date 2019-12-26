module.exports = {
    "env": {
        "browser": true,
        "node": true, // 支持 node语法
        "es6": true // 支持 es6 语法
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "warn",
            "tab"
        ],
        "linebreak-style": [
            "warn",
            "windows"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "no-console": 0,
        "semi": [
            "warn",
            "never"
        ]
    },
    "parserOptions": {
        "sourceType": "module"// 支持import 方式进行模块加载
    },
    "globals": {
        "document":true,
        "window":true
    },
    "plugins":[
        "html"
    ]
}