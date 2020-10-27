# @alipay/herb-plugin-base64

![build](https://img.shields.io/badge/build-passing-brightgreen)
![types](https://img.shields.io/badge/types-TypeScript-blue)

> 图片自动转成 base64，性能提升

## 安装使用

```bash
npm i @alipay/herb-plugin-base64 --save-dev
```

```javascript
// herb.config.js

module.exports = {
  dev: {
    //...省略其他
  },
  plugins: ["@alipay/herb-plugin-base64"],
};
```

### 插件配置参数

| 参数名  |       参数值类型       |                           参数说明                           |
| :-----: | :--------------------: | :----------------------------------------------------------: |
| enable  | Boolean(default: true) |                      是否启用，默认开启                      |
| limit |     number     | 单位 B，默认 4096，超过上限，则转换成 base64 |

### 完整配置

```javascript
// herb.config.js

module.exports = {
  dev: {
    //...省略其他
  },
  plugins: [
    [
      "@alipay/herb-plugin-base64",
      {
        // 超过 4KB，默认转换成 base64
        limit: 4096,
      }
    ]
  ],
};
```

### 实现说明

图片可存在于 axml、acss、js 中，js 中转换暂不支持。

- axml：ast 获取到 src 后转换成绝对路径，然后判断 limit，符合条件则转成 base64
- acss：正则表达式匹配 src 后续操作过程和 axml 相同

## Publish

```sh
npm login --registry http://registry.npm.alibaba-inc.com --scope @alipay

lerna publish --registry http://registry.npm.alibaba-inc.com
```
