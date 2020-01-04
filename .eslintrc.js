module.exports = {
    root: true, 
    parserOptions:{
      ecmaVersion: 7,
      sourceType: "module"
    },
    parser: 'babel-eslint',
    env: {
      "browser": true,
      "node": true
    },
    globals: {
      "window": true,
      "document": true,
      "localStorage": true
    }
}