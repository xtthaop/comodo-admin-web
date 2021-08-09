# comodo-admin-web

## back end
[comodo-admin-api](https://github.com/xtthaop/comodo-admin-api.git)

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

### account information
管理员账号
用户名：admin
密码：123456

普通用户账号
用户名：user
密码：123456
