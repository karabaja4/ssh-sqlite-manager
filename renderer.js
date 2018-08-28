// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const { ipcRenderer } = require('electron');
const Dialogs = require('dialogs');
const csv=require("csvtojson");
const dialogs = Dialogs(opts={});

let executingQuery = false;
let executingTables = false;
let cm = null;

function isExecuting() {
    return executingQuery || executingTables;
}

function setExecuting(type, state) {
    saveConfig();
    const select = document.getElementById("tables");
    //const txtarea = document.getElementById("query-text");
    if (type == "query") {
        const button = executeButton();
        button.classList.remove("disabled");
        if (state) {
            button.classList.add("disabled");
            button.innerHTML = "Executing...";
        } else {
            button.innerHTML = "Execute Query";
        }
        executingQuery = state;
    } else if (type == "table") {
        const button = loadTablesButton();
        button.classList.remove("disabled");
        if (state) {
            button.classList.add("disabled");
            button.innerHTML = "Loading...";
        } else {
            button.innerHTML = "Load Tables";
        }
        executingTables = state;
    }
    select.disabled = state;
    //txtarea.disabled = state;
}

function getQuery() {
    return cm ? cm.getSelection() || cm.getValue() : null;
}

function getValue(id) {
    return document.getElementById(id).value;
}

function executeButton() {
    return document.getElementById("execute-query-button");
}

function loadTablesButton() {
    return document.getElementById("load-tables-button");
}

function getTableHtml(html) {
    return `<table id="result-table">${html}</table>`;
}

function getMessageHtml(html, isError) {
    return `<div id="result-message" class="${(isError ? "error" : "success")}">${html}</div>`;
}

function assignSelectionEventsTable(tableId, tableInfo) {
    const table = document.getElementById(tableId);
    if (table && tableInfo) {
        const cells = table.getElementsByTagName("td");
        for (let i = 0; i < cells.length; i++) {
            const editCell = cells[i];
            const editRow = editCell.parentNode;
            const getHeaderForCell = (cell) => {
                const th = table.rows[0].cells[cell.cellIndex];
                return th.nodeName == "TH" ? th.innerHTML : null;
            }
            const editCellHeader = getHeaderForCell(editCell);
            if (editCellHeader) {
                editCell.ondblclick = function() {
                    dialogs.prompt(editCellHeader, this.innerHTML, (newValue) => {
                        if (newValue) {
                            let pkValue = null;
                            for (let j = 0; j < editRow.children.length; j++) {
                                const child = editRow.children[j];
                                if (getHeaderForCell(child) == tableInfo.primaryKey) {
                                    pkValue = child.innerHTML;
                                }
                            }
                            if (pkValue) {
                                doUpdate(tableInfo.tableName, getHeaderForCell(editCell), newValue, tableInfo.primaryKey, pkValue, () => {
                                    editCell.innerHTML = newValue;
                                });
                            }
                        }
                    });
                }
            }
        }
    }
}

function assignSelectedRowsEvents(tableId) {
    const table = document.getElementById(tableId);
    if (table) {
        const click = function() {
            const rows = table.getElementsByTagName("tr");
            for (let i = 0; i < rows.length; i++) {
                rows[i].classList.remove("selected");
            }
            this.classList.toggle("selected");
        };
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) { 
            rows[i].onclick = click;
        }
    }
}

function setResult(html, isError, tableInfo) {
    if (!html && !isError) {
        html = "Query executed successfully.";
    }
    const isTable = html.startsWith("<TR>");
    const content = isTable ? getTableHtml(html) : getMessageHtml(html, isError);
    document.getElementById("result").innerHTML = content;
    assignSelectionEventsTable("result-table", tableInfo);
    assignSelectedRowsEvents("result-table");
}

function setTableList(list) {
    const tables = list.split("\n");
    const select = document.getElementById("tables");
    select.options.length = 0;
    tables.forEach(table => {
        const option = document.createElement("option");
        option.text = table;
        option.ondblclick = () => {
            const cmd = `SELECT * FROM ${table} LIMIT 1000`;
            doExecuteQuery(cmd, table);
        }
        select.add(option);
    });
}

function command(params, query) {
    const cmd = `sqlite3 ${params ? params.join(" ") + " " : ""}${getValue("path")} "${query}"`;
    return cmd;
}

function getPrimaryKey(tableName, callback) {
    execute(() => {
        const cmd = `PRAGMA table_info('${tableName}')`;
        ssh.execCommand(command(["-header", "-csv"], cmd)).then((result) => {
            if (result.stdout && !result.stderr) {
                csv().fromString(result.stdout).then((json) => {
                    let pk = null;
                    for (let i = 0; i < json.length; i++) {
                        const entity = json[i];
                        if (entity.pk == "1") {
                            pk = entity.name;
                            break;
                        }
                    }
                    callback(pk);
                });
            } else {
                callback();
            }
        });
    });
}

function doUpdate(table, column, value, pkColumn, pkValue, callback) {
    if (isExecuting()) {
        return;
    }
    setExecuting("query", true);
    execute(() => {
        const cmd = `UPDATE ${table} SET ${column} = '${value}' WHERE ${pkColumn} = '${pkValue}'`;
        ssh.execCommand(command(null, cmd)).then((result) => {
            setExecuting("query", false);
            if (result.stderr) {
                dialogs.alert("Error updating row.");
            } else {
                callback();
            }
        });
    }, (err) => {
        if (err) {
            setExecuting("query", false);
            dialogs.alert(err.message);
        }
    });
}


function doLoadTables() {
    if (isExecuting()) {
        return;
    }
    setExecuting("table", true);
    execute(() => {
        const cmd = "SELECT name FROM sqlite_master WHERE type='table'";
        ssh.execCommand(command(null, cmd)).then((result) => {
            if (result.stderr) {
                dialogs.alert(result.stderr);
            } else {
                setTableList(result.stdout);
                setExecuting("table", false);
            }
        });
    }, (err) => {
        if (err) {
            dialogs.alert(err.message);
            setExecuting("table", false);
        }
    });
}

function doExecuteQuery(query, tableNameToLoadMetadata) {
    if (isExecuting()) {
        return;
    }
    if (!query) {
        setResult("No query defined.", true);
        return;
    }
    setExecuting("query", true);
    execute(() => {
        ssh.execCommand(command(["-header", "-nullvalue NULL", "-html"], query)).then((result) => {
            const finalize = (tableInfo) => {
                setResult(result.stderr || result.stdout, !!result.stderr, tableInfo);
                setExecuting("query", false);
            }
            if (tableNameToLoadMetadata) {
                getPrimaryKey(tableNameToLoadMetadata, (primaryKey) => {
                    if (!primaryKey) {
                        dialogs.alert("PK not found for table " + tableNameToLoadMetadata);
                        finalize();
                    } else {
                        finalize({primaryKey: primaryKey, tableName: tableNameToLoadMetadata});
                    }
                });
            } else {
                finalize();
            }
        });
    }, (err) => {
        if (err) {
            dialogs.alert(err.message);
            setExecuting("query", false);
            return;
        }
    });
}

function execute(onsuccess, onerror) {
    ssh.connect({
        host: getValue("hostname"),
        username: getValue("user"),
        privateKey: getValue("key")
    }).then(onsuccess).catch((err) => {
        if (onerror) {
            onerror(err);
        }
    });
}

function bind() {
    loadTablesButton().onclick = () => {
        doLoadTables();
    }
    executeButton().onclick = () => {
        doExecuteQuery(getQuery());
    }
}

ipcRenderer.on("loadTables", () => {
    doLoadTables();
});

ipcRenderer.on("executeQuery", () => {
    doExecuteQuery(getQuery());
});

function codemirror() {
    cm = window.CodeMirror(document.getElementsByClassName("query-text")[0],
    {
        autofocus: true,
        lineNumbers: true,
        mode: "text/x-sql",
        value: "",
        styleActiveLine: true,
        placeholder: "e.g. SELECT * FROM user; -- execute with Ctrl-E"
    });
}

function loadConfig() {
    const get = (name) => {
        const value = localStorage.getItem(name);
        if (value) {
            document.getElementById(name).value = value;
        }
    }
    get("hostname");
    get("path");
    get("user");
    get("key");
}

function saveConfig() {
    const set = (name) => {
        const value = document.getElementById(name).value;
        if (value) {
            localStorage.setItem(name, value);
        }
    }
    set("hostname");
    set("path");
    set("user");
    set("key");
}

bind();
codemirror();
loadConfig();