'use babel';

import {CompositeDisposable} from 'atom';
import request from 'superagent';

export default {
  config: {
    accessToken: {
      'type': 'string',
      'default': ''
    },
    casing: {
      'type': 'string',
      'default': 'lower underscore',
      'enum': [
        'camel',
        'pascal',
        'lower underscore',
        'upper underscore',
        'hyphen'
      ]
    },
    acronymStyle: {
      'type': 'string',
      'default': 'literal',
      'enum': [
        'MS naming guidelines',
        'camel strict',
        'literal'
      ]
    }
  },

  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'codic:convert': () => this.convert()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  convert() {
    const editor       = atom.workspace.getActiveTextEditor();
    const accessToken  = atom.config.get('codic.accessToken');
    const text         = editor.getSelectedText();
    const scope        = editor.getLastCursor().getScopeDescriptor();
    const casing       = atom.config.get('codic.casing', {scope});
    const acronymStyle = atom.config.get('codic.acronymStyle', {scope});

    if (accessToken === '') {
      const message = '設定画面よりAccess Tokenを設定してください。' +
        'Access Tokenは、codicにサインアップ後、APIステータスのページより取得できます。';
      atom.notifications.addError(message, {dismissable: true});
      return;
    }

    request
      .get('https://api.codic.jp/v1/engine/translate.json')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({text, casing, acronym_style: acronymStyle})
      .end((err, res) => {
        if (err || !res.ok) {
          atom.notifications.addError(res.body.errors[0].message, {dismissable: true});
          return;
        }

        if (!res.body[0].successful) {
          atom.notifications.addError('翻訳に失敗しました。');
          return;
        }

        editor.insertText(res.body[0]['translated_text']);
      });
  }
};
