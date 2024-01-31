**`Antd-docs` is a VSCode plugin that allows you to view the documentation of the `ant-design` component library within VSCode.**

![description](https://github.com/jrr997/antd-docs-vscode/blob/master/description.gif?raw=true)

English | [中文](./README-zh_CN.md)

## Features
 - Display documentation when hovering over a component.
 - Jump from VSCode to the documentation webpage of a specific component.
 - Support for switching documentation versions and languages.

## Usage
  1. The plugin takes effect immediately after installation, defaulting to displaying the documentation of `antd5`.
  2. Change language: You can select the language of the documentation in `VSCode Settings --> Extensions --> Antd Docs --> Language`, and the change takes effect immediately.
  3. Change version: You can select the version of the documentation in `VSCode Settings --> Extensions --> Antd Docs --> docVersion`, and the change takes effect immediately.

### Changes from plugin version 1.x to 2.0.0
  1. Out-of-the-box functionality, no longer requiring a `github token`.
  2. Version 2.x only previews the latest documentation for `antd` v4 or v5, while version 1.x could preview documentation for a specific version.
  3. No need to restart VSCode after modifying plugin configurations.