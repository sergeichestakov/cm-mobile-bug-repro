import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab, defaultKeymap } from "@codemirror/commands";
import createIndentationPlugin from './indentation';

const doc = `
Hello CodeMirror

  This is an example

    Of a doc

      With a bunch of lines

  

  That are indented random amounts


With some empty lines in between.
`

let startState = EditorState.create({
  doc,
  extensions: [
    // Custom plugin that inserts widgets into empty lines:
    createIndentationPlugin(),

    keymap.of(defaultKeymap),
    keymap.of([indentWithTab]),
  ],
})

new EditorView({
  state: startState,
  parent: document.body
})