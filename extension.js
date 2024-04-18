const vscode = require('vscode');
const { programOutput } = require('cognitive-complexity-ts');

let decorations = [];
let subscriptions = [];

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.checkComplexity', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }


   displayCognitiveComplexity(editor.document, editor)  
  });
  // Register Deactivate Command
  let deactivateCommand = vscode.commands.registerCommand('extension.deactivate', deactivate);
  let event1 = vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument);
  let event2 = vscode.workspace.onDidSaveTextDocument(onDidSaveTextDocument);
  context.subscriptions.push(
    event1,
    event2,
    disposable,
    deactivateCommand
  );

  subscriptions.push(event1, event2);
}

function deactivate() {
  console.log('Deactivated');

  // Unregister all subscriptions
  subscriptions.forEach((subscription) => {
    console.log(subscription);
    subscription.dispose();
  });

  // Remove all text decorations
  decorations.forEach((decoration) => {
    console.log(decoration);
    decoration.editor.setDecorations(decoration.type, []);
  });

  // Clear the arrays
  subscriptions = [];
  decorations = [];

  vscode.window.showInformationMessage(`Cognitive Complexity Checker is now Deactivated. CMD+SHIFT+0 to reactivate.`)
}

async function onDidOpenTextDocument(document) {
  await displayCognitiveComplexity(document);
}

async function onDidSaveTextDocument(document) {
  await displayCognitiveComplexity(document);
}

async function displayCognitiveComplexity (document, editorContext) {
    const editor = editorContext ? editorContext: vscode.window.activeTextEditor;
    const complexity = programOutput(document.fileName);
    complexity.then(result => {
      const jsonResult = JSON.parse(result);
      const fileNameArr = document.fileName.split('/')
      const fileName = fileNameArr[fileNameArr.length - 1];
      vscode.window.showInformationMessage(`Cognitive Complexity: ${jsonResult[fileName].score}. ${!editorContext ? 'Press CMD+S/CTRL+S to toggle Highlighting.': ''}`)
      // Display the complexity for each function
      console.log(editor);
      if(jsonResult[fileName].inner && editor) {
        displayFunctionComplexityAsTooltip(editor, jsonResult[fileName].inner);
      }
    });
}

const getTextDecorationThreshold = (score, threshold) => {
  // func.score > threshold ? 'wavy underline' : undefined

  if(score <= 10 || score === 0) {
    return new vscode.ThemeColor('editorInfo.foreground');
  }
  else if(score > 10 && score <= threshold) {
    return new vscode.ThemeColor('editorWarning.foreground');
  }
  if(score > threshold) {
    return new vscode.ThemeColor('editorError.foreground')
  }
}
const getScoreDescription = (score, threshold) => {
  if(score <= 10 || score === 0) {
    return (`\n\nThe cognitive complexity of this function is within the recommended range. Good job on keeping the complexity low!`);
  }
  else if(score > 10 && score <= threshold) {
    return (`\n\nThe cognitive complexity of this function is relatively high. Consider breaking it down into smaller, more focused functions.`);
  }
  if(score > threshold) {
    return (`\n\nThe cognitive complexity of this function is above the configured threshold of ${threshold}. Consider refactoring to improve the maintainability of your code.`);
  }
}

function displayFunctionComplexityAsTooltip(editor, functions) {
  // Get the cognitive complexity threshold from the extension settings
  const config = vscode.workspace.getConfiguration('cognitiveComplexity');
  const threshold = config.get('threshold', 15);
  for (const func of functions) {
    const range = new vscode.Range(
      new vscode.Position(func.line - 1, 0),
      new vscode.Position(func.line - 1, editor.document.lineAt(func.line - 1).text.length)
    );
     editor.setDecorations(
      vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        overviewRulerColor: new vscode.ThemeColor('editorOverviewRuler.errorForeground'),
        color: getTextDecorationThreshold(func.score, threshold),
        textDecoration: func.score > threshold ? 'wavy underline' : 'underline',
      }),
      [{ range, hoverMessage: new vscode.MarkdownString(`**Cognitive Complexity: ${func.score}** ${getScoreDescription(func.score, threshold)}`) }]
    );
    if (func.inner && func.inner.length > 0) {
      displayFunctionComplexityAsTooltip(editor, func.inner);
    }
  }
}

exports.activate = activate;
exports.deactivate = deactivate;

module.exports = {
  activate,
  deactivate
};