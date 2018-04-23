# vue_auto_images

### 安装
```
npm install vue_auto_images -D
```

### 使用

1.vue项目中assets目录中分组放置图片

图片名称从1递增

eg:
```

assets
| --test_1
|     --1.png
|     --2.png
| --test_2
|     --1.png
|     --2.png
|     --3.png

```

2.package.json修改scripts
```
"script": {
    "dev": "node node_modules/vue_auto_images & webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "build": "node node_modules/vue_auto_images & node build/build.js"
}
    
```

3.npm run dev 或 npm run build

### 效果
生成对应文件
```
src
| --page
|   --test_1.vue
|   --test_2.vue
| --router
|   --index.js
| --dashboard.vue

```



