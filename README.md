# comodo-admin-web

## back end
[comodo-admin-api](https://github.com/xtthaop/comodo-admin-api.git)

## demo
[DEMO](https://zxctb.top:8081)

**account information**
administrator account
username：admin
password：123456

ordinary users account
username：user
password：123456

![截图](https://github.com/xtthaop/image-lib/blob/master/image/screenshot.png?raw=true)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### change to your proxy config
```js
// vue.config.js
module.exports = {
  devServer: {
    port: 3030,
    proxy: {
      '/api': {
        target: 'http://localhost:56890',
        changeOrigin: true,
        pathRewrite: {'/api' : ''},
      }
    }
  }
}
```

### reference
[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin.git)
[go-admin-ui](https://github.com/go-admin-team/go-admin-ui.git)
