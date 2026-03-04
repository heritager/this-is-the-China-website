# this-is-the-China-website

将国际网站伪装成中国网站.

## 2026 更新

`all.js` 已升级为结构化增强版，主要改动：

- 新增共享引擎 [shared/site-engine.js](./shared/site-engine.js)：站点脚本只保留 metadata + 配置调用。
- 使用配置对象驱动渲染（`siteName/logoUrl/favicon/colorScheme/placeholders/title`），新增站点更快。
- 移除原先大量无限轮询，改为限次重试 + SPA 导航监听 + MutationObserver 重应用，降低中途失效概率。
- 去掉高风险 `trustedTypes.createPolicy('default', ...)` 写法，兼容性更稳。
- 增加运行时配置能力（`localStorage`）：支持按站点开关和 YouTube 目标站点切换。

### 运行时配置

在浏览器控制台执行：

```js
// 查看当前配置
window.chinaWebsiteMask.getConfig()

// 切换 YouTube 到西瓜风格并刷新
window.chinaWebsiteMask.setConfig({ youtubeBrand: 'xigua' })

// 按站点开关（示例：关闭 twitter）
window.chinaWebsiteMask.setConfig({
  siteEnabled: { twitter: false }
})

// 恢复默认配置并刷新
window.chinaWebsiteMask.resetConfig()
```

### 自动化回归测试（Playwright）

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

说明：
- 测试文件在 `tests/mask-regression.spec.js`。
- 默认会做关键断言（title/placeholder）并生成截图基线，后续可用于回归比对。

这样你就可以在(半)公共区域使用国际网站, 而不会被萌新在微信 / QQ 上问, "哇! 为什么你可以使用 Google / YouTube / ...? 浇浇我!"

以下链接为 [Greasy Fork](https://greasyfork.org) 链接.

| src | dst |
| --- | --- |
| Google (搜索/图片/学术) | [百度](https://greasyfork.org/zh-CN/scripts/453226-google-%E4%BC%AA%E8%A3%85%E6%88%90-%E7%99%BE%E5%BA%A6), |
| Wikipedia | [百度百科](https://greasyfork.org/zh-CN/scripts/453100-wikipedia-%E4%BC%AA%E8%A3%85%E6%88%90-%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91), |
| YouTube | [哔哩哔哩](https://greasyfork.org/zh-CN/scripts/453225-youtube-%E4%BC%AA%E8%A3%85%E6%88%90-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9), [西瓜视频](https://greasyfork.org/zh-CN/scripts/483454-youtube-%E4%BC%AA%E8%A3%85%E6%88%90-%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91)|
| GitHub | [码云 (Gitee)](https://greasyfork.org/zh-CN/scripts/453224-github-%E4%BC%AA%E8%A3%85%E6%88%90-gitee-%E7%A0%81%E4%BA%91), |
| Steam | [蒸汽平台](https://greasyfork.org/zh-CN/scripts/461435-steam-%E4%BC%AA%E8%A3%85%E6%88%90-%E8%92%B8%E6%B1%BD%E5%B9%B3%E5%8F%B0), |
| Twitter (X) | [微博](https://greasyfork.org/zh-CN/scripts/475826-twitter-x-%E4%BC%AA%E8%A3%85%E6%88%90-%E5%BE%AE%E5%8D%9A), |
| Reddit | [百度贴吧](https://greasyfork.org/zh-CN/scripts/530189-reddit-%E4%BC%AA%E8%A3%85%E6%88%90-%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7), |

另有汇总: 
https://greasyfork.org/zh-CN/scripts/461427-%E5%9B%BD%E9%99%85%E7%BD%91%E7%AB%99%E4%BC%AA%E8%A3%85%E4%B8%BA%E5%9B%BD%E5%86%85%E7%BD%91%E7%AB%99

欢迎通过 issue 或 PR, 提出 bug 或需求, 提供点子或代码.

思路来自 [把google搜索伪装成百度搜索](https://greasyfork.org/en/scripts/372883-%E6%8A%8Agoogle%E6%90%9C%E7%B4%A2%E4%BC%AA%E8%A3%85%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2).

![中国人就用中国网站](./jing.png)

##### TODO

设计一个野鸡搜索引擎界面.

| src | dst |
| --- | --- |
| Quora | 知乎, |
| Google | 野鸡搜索引擎, |
| Reddit | (小红书?) |
| Stack Overflow | 没想好 (百度知道? 知乎?) |
| Facebook | 没想好 (QQ 空间?) |
| Pixiv | 没想好 |
| Pinterest | 没想好 |
| Instagram | 没想好 (小红书?) |
| Archive of Our Own | 乐乎 (Lofter), |
