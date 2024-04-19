# What it is?

The Cognitive Complexity Checker is a Visual Studio Code (VSCode) extension that helps developers maintain the quality and readability of their codebase by highlighting functions with high cognitive complexity. Cognitive complexity is a measure of how "difficult" a function is to understand, and this extension provides visual cues and information to help developers identify and address areas of their code that may require refactoring or further optimization.

## Features:

Cognitive Complexity Highlighting: The extension automatically highlights the lines of code for  functions cognitive complexity, using different colors to indicate the severity of the issue.

Hover Tooltips: When the user hovers over a highlighted function, the extension displays a tooltip with the cognitive complexity score and a brief description of the potential issues.

Configurable Threshold: The extension allows users to configure the cognitive complexity threshold, enabling them to customize the sensitivity of the highlighting based on their team's coding standards and preferences.

By providing these features, the Cognitive Complexity Checker extension helps developers identify and address areas of their code that may be difficult to maintain or understand, ultimately improving the overall quality and readability of the codebase.

## How to Use
Configure the Extension: (Optional) If you would like to change the default cognitive complexity threshold, you can do so by opening the extension's settings. To do this, go to the Extensions view, find the "Cognitive Complexity Checker" extension, and click on the "Extension Settings" link.

Check Cognitive Complexity: Open a file in VSCode, and activate extension using CMD+SHIFT+0 (For mac) or CTRL+SHIFT+0 (For windows) extension will automatically highlight function’s cognitive complexity. You can hover over the highlighted lines to see the cognitive complexity score and a description of the potential issues. Also, it will show an information message for the whole file.
Highlighting Logic:

If complexity is less than 10 → The function underline will be blue.

If complexity is greater than 10 and less than or equal to threshold →  The function underline will be yellow.

if Complexity is greater than threshold value → The function underline will be wavy and red.

  
Alternatively you can goto the command palette and search for Check Cognitive Complexity.


Deactivate the Extension: If you need to temporarily deactivate the extension, you can do so by pressing Ctrl+Shift+D (or the shortcut you have configured in the extension's settings).
 

By following these steps, you can start using the Cognitive Complexity Checker extension to improve the quality and readability of your codebase.

How Complexity is calculated?
The npm package used beneath is npm: cognitive-complexity-ts which has its specification as below.

The Cognitive Complexity Checker extension assigns a complexity score to various code structures in a Javascript/TypeScript project. This score represents the level of cognitive effort required to understand and maintain the code.

Code Structures and Their Complexity Scores
The extension calculates complexity scores for the following code structures:

Functions: Each function is assigned a complexity score based on the total complexity of the code within it.

Classes: Each class is assigned a complexity score based on the total complexity of all its methods and properties.

Namespaces: Each namespace is assigned a complexity score based on the total complexity of all the code within it.

Types: Each type (including unions, intersections, and mapped types) is assigned a complexity score based on its structure.

Files: Each file is assigned a complexity score based on the total complexity of all the code within it.

Complexity Increments
The extension calculates the complexity score by applying the following rules:

Inherent Cost: Certain code structures, such as if, else, switch, for, while, catch, and recursive references, increase the complexity score by 1.

Nesting Increments: Nested structures, such as if, switch, for, while, and mapped types, increase the complexity score by a number equal to the depth of the nesting.

The depth of the code is determined by the number of nested structures. For example, an if statement inside a for loop would have a depth of 2.

Differences from Sonar Source Guidelines
The Cognitive Complexity Checker extension has made some adjustments to the guidelines set by Sonar Source in the Cognitive Complexity whitepaper. These changes include:

Assigning complexity scores to classes, namespaces, and types, in addition to functions.

Treating recursive references to functions, classes, and types as inherent complexity increments, not just recursive calls.

Not counting the & and | operators as inherent complexity increments, as they are not used as eager boolean operators in JavaScript/TypeScript.

These modifications were made to better suit the specific features and characteristics of the JavaScript/TypeScript language and to provide more detailed and useful information to the users of the extension.

Future Plans
Adding support for various other programming languages.

Create a custom scoring matrix which eliminates use of the npm package.

Complexity Heatmap generator for the project for better visibility.

 