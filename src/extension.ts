// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as file from 'fs';
import * as vscode from 'vscode';
import { TaskTreeDataProvider } from './task-data-provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "prefs-explorer" is now active!');

    function provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
        const circularStruct: {
            innerValue: any;
        } = {
            innerValue: undefined
        };

        circularStruct.innerValue = circularStruct;

        const cmd: vscode.Command = {
            command: 'circularCommand',
            arguments: [circularStruct],
            title: 'Circular',
            tooltip: 'circular tooltip'
        };
        return [cmd];
    }

    vscode.languages.registerCodeActionsProvider({ pattern: '**/*.txt' }, {
        provideCodeActions: provideCodeActions
    });

    vscode.commands.registerCommand('circularCommand', () => {
        vscode.window.showInformationMessage('called the circular command');
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.showConfig', async () => {
        let key = await vscode.window.showInputBox({ prompt: 'Enter preference key' });
        const value = vscode.workspace.getConfiguration(key);
        console.info((JSON.stringify(value)));
        vscode.window.showInformationMessage(JSON.stringify(value));

        //const value= vscode.workspace.getConfiguration('tasks');
    });

    disposable = vscode.commands.registerCommand('extension.runTaskFromExt', async () => {
        let label = await vscode.window.showInputBox({ prompt: 'Enter task label' });
        let allTasks: vscode.Task[] = await vscode.tasks.fetchTasks();
        for (let task of allTasks) {
            //console.log(JSON.stringify(task));
            if (task.name === label) {
                console.log('found task ' + label);
                vscode.tasks.executeTask(task);
            }
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.runTaskByLabel', async (label: string) => {
        let allTasks: vscode.Task[] = await vscode.tasks.fetchTasks();
        for (let task of allTasks) {
            //console.log(JSON.stringify(task));
            if (task.name === label) {
                console.log('found task ' + label);
                vscode.tasks.executeTask(task);
            }
        }
    });
    context.subscriptions.push(disposable);


    disposable = vscode.commands.registerCommand('extension.showTasks', async () => {
        let label = await vscode.window.showInputBox({ prompt: 'Enter task label' });
        let allTasks: vscode.Task[] = await vscode.tasks.fetchTasks();
        for (let task of allTasks) {
            console.log(JSON.stringify(task, undefined, 3));
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.showUIKind', async () => {
        let label = await vscode.window.showInformationMessage('ui kind is: ' + vscode.UIKind[vscode.env.uiKind]);
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.showExtensionUri', async () => {

        let label = await vscode.window.showInformationMessage('extensionURI is: ' + context.extensionUri);
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.readFile', async () => {
        const result = await vscode.window.showOpenDialog({ canSelectFiles: true });
        if (Array.isArray(result)) {

            const start = new Date();


            await vscode.workspace.fs.readFile(result[0]);

            const end = new Date();

            let label = await vscode.window.showInformationMessage(`reading the file took ${end.getTime() - start.getTime()} ms`);
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.tasks.registerTaskProvider("prefsExplorerTask", {
        provideTasks: (token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> => {
            console.info('providing tasks');

            if (vscode.workspace.workspaceFolders) {
                return [
                    new vscode.Task({
                        "type": "prefsExplorerTask",
                        "foo": "first"
                    }, vscode.workspace.workspaceFolders[0],
                        "name", "prefsExplorer", new vscode.ShellExecution("foobar1")),
                    new vscode.Task({
                        "type": "prefsExplorerTask",
                        "foo": "second"
                    }, vscode.TaskScope.Workspace,
                        "global name", "prefsExplorer", new vscode.ShellExecution("foobar"))
                ];
            } else {
                return [];
            }
        },
        resolveTask: (task: vscode.Task, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> => {
            console.info('resolving task');
            return task;
        }
    });

    context.subscriptions.push(disposable);

    context.subscriptions.push(disposable);

    disposable = vscode.window.registerTreeDataProvider("executeTasksView", new TaskTreeDataProvider());


}

// this method is called when your extension is deactivated
export function deactivate() { }
