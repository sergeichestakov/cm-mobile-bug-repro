import {
  ViewPlugin,
  Decoration,
  EditorView,
  WidgetType,
} from '@codemirror/view';
import { getIndentUnit } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/rangeset';

class IndentationWidget extends WidgetType {
  toDOM(view: EditorView) {
    const indentSize = getIndentUnit(view.state);

    const wrapper = document.createElement('span');
    wrapper.className = 'cm-indentation-wrapper';

    for (let indent = 0; indent < 3; indent++) {
      const element = document.createElement('span');
      element.className = 'cm-indentation-marker';
      element.innerHTML = `${' '.repeat(indentSize)}`;
      wrapper.appendChild(element);
    }

    return wrapper;
  }
}
function addIndentationMarkers(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>();

  for (const { from, to } of view.visibleRanges) {
    let pos = from;

    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);

      if (line.text.trim().length === 0) {
        const indentationWidget = Decoration.widget({
          widget: new IndentationWidget(),
        });

        builder.add(line.from, line.from, indentationWidget);
        pos = line.to + 1;

        continue;
      }

      pos = line.to + 1;
    }
  }

  return builder.finish();
}

function createIndentMarkerPlugin() {
  return ViewPlugin.define(
    (view) => ({
      decorations: addIndentationMarkers(view),
      update(update) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = addIndentationMarkers(update.view);
        }
      },
    }),
    {
      decorations: (v) => v.decorations,
    },
  );
}

const baseTheme = EditorView.baseTheme({
  '.cm-indentation-marker': {
    display: 'inline-block',
    background:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") left repeat-y',
  },
  '.cm-indentation-wrapper': {
    position: 'absolute',
    left: '4px',
  },
})

export default function createIndentationExtension() {
  return [
    baseTheme,
    createIndentMarkerPlugin(),
  ]
}