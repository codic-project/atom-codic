# Codic Package

Atom から [codic](https://codic.jp/) を使ってネーミングを生成するためのパッケージ。

## インストール

```console
$ apm install codic
```

## 使い方

変換したい文字列を選択した後 `ctrl-shift-d` で変換を行います。

## 詳細設定

`cmd-shift-p` または `ctrl-shift-p` から `Open Your Config` で開ける `config.cson` の末尾に下記のような設定を加える事で、JavaScriptの場合はcamelCase変換、CSSの場合はハイフネーション変換といったようにファイルの言語毎に設定切替を行うことができます。

参考リンク: [Language-specific Settings in your Config File](https://atom.io/docs/latest/using-atom-basic-customization#language-specific-settings-in-your-config-file)

```cson
".js.source":
  codic:
    acronymStyle: "camel strict"
    casing: "camel"
".css.source":
  codic:
    casing: "hyphen"
```
