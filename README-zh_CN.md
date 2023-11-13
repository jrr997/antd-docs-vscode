`Antd-docs` 是一个VSCode插件，可以让你在 VSCode 中查看 `ant-design` 组件库的文档。

![description](https://github.com/jrr997/antd-docs-vscode/blob/master/description.gif?raw=true)

中文 | [English](./README.md)

## 功能
 - 鼠标悬停在组件时显示文档。
 - 从 VSCode 跳转到某个组件的文档网页。
 - 支持切换文档的版本、语言。

## 使用
  1. 第一次使用: 需要设置 `github token`。打开 `VSCode 设置 --> 扩展 --> Antd Docs`，填入 `github token`，接着重新打开 VSCode 。你可以在[这里](https://github.com/settings/tokens)生成 `github token`。
  2. 修改文档语言和版本：可以在 `VSCode 设置 --> 扩展 --> Antd Docs` 中设置文档的版本和语言，需要重新打开 VSCode。
  3. 修改文档版本而不重启：点击快捷键 `ctrl + P`，输入 `>AntdDoc: set`, 回车后输入想要的版本，插件就会立即更新文档。
    这种方式只会在当前工作区生效，其他工作区还是以 `VSCode 设置` 中的版本为准

### 问题

  1. 为什么插件需要 `github token` ?
  插件通过 `github rest api` 来获取 `antd-design` 的文档。调用 api 需要 `github token`，否则会有请求次数的限制，导致插件无法获取完整文档。[这里](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api?apiVersion=2022-11-28)是 github 的解释。

  2. 关于文档版本。
  文档版本有两种格式:
  一是 `x.xx.xx`，插件只会获取一次文档。
  二是 `4.x` 和 `5.x`，插件每次激活时都会获取一次文档，以保证文档是 `ant-design` 4或5的最新版本。 



