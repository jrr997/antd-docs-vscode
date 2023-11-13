`Antd-docs` is a VSCode plugin that allows you to view the documentation of the `ant-design` component library within VSCode.

![description](https://github.com/jrr997/antd-docs-vscode/blob/master/description.gif?raw=true)

English | [中文](./README-zh_CN.md)

## Features
- Display documentation on hovering over components.
- Jump from VSCode to the documentation webpage of a specific component.
- Support for switching documentation versions and languages.

## Usage
1. First-time setup: Requires setting up a `github token`. Open `VSCode Settings --> Extensions --> Antd Docs`, input the `github token`, and then restart VSCode. You can generate a `github token` [here](https://github.com/settings/tokens).
2. Change document language and version: You can set the document's version and language in `VSCode Settings --> Extensions --> Antd Docs`, requiring a VSCode restart.
3. Change document version without restarting: Use the shortcut `ctrl + P`, input `>AntdDoc: set`, press enter, input the desired version, and the plugin will immediately update the document.
    This method only affects the current workspace; other workspaces will adhere to the version set in `VSCode Settings`.

### Issues

1. Why does the plugin require a `github token`?
   The plugin uses the `github rest api` to access the `antd-design` documentation. Accessing the API requires a `github token` to avoid request limitations that would prevent the plugin from retrieving the complete documentation. You can find GitHub's explanation [here](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api?apiVersion=2022-11-28).

2. About document versions.
   Document versions come in two formats:
   - The format `x.xx.xx` where the plugin fetches the document only once.
   - Formats like `4.x` and `5.x`, where the plugin fetches the document every time it's activated to ensure the documentation reflects the latest version of `ant-design` 4 or 5.