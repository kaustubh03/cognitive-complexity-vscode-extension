const vscode = require('vscode');
const { programOutput } = require('cognitive-complexity-ts');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.checkComplexity', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }


    displayCognitiveComplexity(editor.document)  
  });

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument),
    vscode.workspace.onDidSaveTextDocument(onDidSaveTextDocument),
    disposable,
  );
}

async function onDidOpenTextDocument(document) {
  await displayCognitiveComplexity(document);
}

async function onDidSaveTextDocument(document) {
  await displayCognitiveComplexity(document);
}

async function displayCognitiveComplexity (document) {
    const editor = vscode.window.activeTextEditor;
    console.log(document);
    const complexity = programOutput(document.fileName);
    console.log('hey', complexity);
    complexity.then(result => {
      const jsonResult = JSON.parse(result);
      console.log(jsonResult);
      const fileNameArr = document.fileName.split('/')
      const fileName = fileNameArr[fileNameArr.length - 1];
      vscode.window.showInformationMessage(`Cognitive Complexity: ${jsonResult[fileName].score}`)
      
      // Display the complexity for each function
      displayFunctionComplexityAsTooltip(editor, jsonResult[fileName].inner);
    });
}

const getTextDecorationThreshold = (score, threshold) => {
  // func.score > threshold ? 'wavy underline' : undefined
  console.log('sas',threshold)

  if(score < 10 || score === 0) {
    return new vscode.ThemeColor('editorInfo.foreground');
  }
  else if(score > 10 && score < threshold) {
    return new vscode.ThemeColor('editorWarning.foreground');
  }
  if(score > threshold) {
    return new vscode.ThemeColor('editorError.foreground')
  }
}
const getScoreDescription = (score, threshold) => {
  if(score < 10 || score === 0) {
    return (`\n\nThe cognitive complexity of this function is within the recommended range. Good job on keeping the complexity low!`);
  }
  else if(score > 10 && score < threshold) {
    return (`\n\nThe cognitive complexity of this function is relatively high. Consider breaking it down into smaller, more focused functions.`);
  }
  if(score > threshold) {
    return (`\n\nThe cognitive complexity of this function is above the configured threshold of ${threshold}. Consider refactoring to improve the maintainability of your code.`);
  }
}

function displayFunctionComplexityAsTooltip(editor, functions) {
  console.log(editor);
  // Get the cognitive complexity threshold from the extension settings
  const config = vscode.workspace.getConfiguration('cognitiveComplexity');
  const threshold = config.get('threshold', 15);
  for (const func of functions) {
    const range = new vscode.Range(
      new vscode.Position(func.line - 1, func.column - 1),
      new vscode.Position(func.line - 1, func.column - 1 + func.name.length)
    );
     editor.setDecorations(
      vscode.window.createTextEditorDecorationType({
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

function deactivate() {}

module.exports = {
  activate,
  deactivate
};