import * as vscode from 'vscode';


export class TaskTreeDataProvider implements vscode.TreeDataProvider<vscode.Task> {

    private onDidChangeTreeDataEmitter: vscode.EventEmitter<vscode.Task>;

    readonly onDidChangeTreeData: vscode.Event<vscode.Task>;
  
    constructor() {
  
      this.onDidChangeTreeDataEmitter = new vscode.EventEmitter<vscode.Task>();
      this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;
    }
  

    getTreeItem(element: vscode.Task): vscode.TreeItem | Thenable<vscode.TreeItem> {
       return {
           label: element.name,
           command: {
               title: "Run Task",
               command: 'workbench.action.tasks.runTask',
               arguments: [
                   element.name
               ]
           }
       }
    }

    getChildren(element?: vscode.Task): vscode.ProviderResult<vscode.Task[]> {
        if (!element) {
            return vscode.tasks.fetchTasks();
        } else {
            return undefined;
        }
    }
    
}