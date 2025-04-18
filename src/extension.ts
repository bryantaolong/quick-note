// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hello-world" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('hello-world.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from hello-world');
	});

	context.subscriptions.push(disposable);

	// Add a command to create a note file
	const createNoteCommand = vscode.commands.registerCommand('quickNote.createNote', async () => {
		const noteName = await vscode.window.showInputBox({
			prompt: 'Enter the name of your note file',
			placeHolder: 'example: my-note.md'
		});

		if (!noteName) {
			vscode.window.showErrorMessage('Note creation canceled.');
			return;
		}

		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open. Please open a folder to create a note.');
			return;
		}

		const folderUri = workspaceFolders[0].uri;
		const noteUri = vscode.Uri.joinPath(folderUri, noteName);

		try {
			await vscode.workspace.fs.writeFile(noteUri, new Uint8Array());
			vscode.window.showInformationMessage(`Note created: ${noteUri.fsPath}`);

			// Open the note in the editor
			const document = await vscode.workspace.openTextDocument(noteUri);
			await vscode.window.showTextDocument(document);

			// After opening the note in the editor, trigger the dictation command
			await vscode.commands.executeCommand('workbench.action.editorDictation.start');
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to create note: ${error}`);
		}
	});

	context.subscriptions.push(createNoteCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
