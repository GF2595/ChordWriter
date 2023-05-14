import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

ipcMain.on('window/minimize', () => {
    const win = BrowserWindow.getFocusedWindow();
    win.minimize();
});

ipcMain.on('window/maximize', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
});

ipcMain.on('window/close', () => {
    app.quit();
});

ipcMain.handle('dialog/openFile', () =>
    dialog
        .showOpenDialog({
            properties: ['openFile'],
            filters: [{ extensions: ['json'], name: '*' }],
        })
        .then((value) => {
            const path = value.filePaths[0];

            if (!path) return;

            const fileJson = fs.readFileSync(path).toString();

            const fileContents = JSON.parse(fileJson);

            return fileContents;
        })
);

ipcMain.handle('dialog/openFiles', () =>
    dialog
        .showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ extensions: ['json'], name: '*' }],
        })
        .then((value) => {
            const result: any[] = [];

            value.filePaths.forEach((path) => {
                if (!path) return;

                const fileJson = fs.readFileSync(path).toString();

                result.push(JSON.parse(fileJson));
            });

            return result;
        })
);

ipcMain.on('openDevTools', () =>
    BrowserWindow.getFocusedWindow().webContents.openDevTools()
);

ipcMain.handle('dialog/saveFile', (_, fileContents) => {
    return dialog
        .showSaveDialog({
            filters: [{ extensions: ['json'], name: '*' }],
        })
        .then((value) => {
            const path = value.filePath;

            if (!path) return;

            fs.writeFileSync(path, fileContents);
        });
});

ipcMain.on('print', () => {
    const win = BrowserWindow.getFocusedWindow();

    win.webContents
        .printToPDF({
            pageSize: 'A4',
            marginsType: 1,
        })
        .then((file) =>
            dialog
                .showSaveDialog({
                    filters: [{ extensions: ['pdf'], name: '*' }],
                })
                .then((value) => {
                    const path = value.filePath;

                    if (!path) return;

                    fs.writeFileSync(path, file);
                    win.close();
                })
        );
});

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        show: false,
        height: 600,
        width: 800,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
};

app.on('browser-window-focus', () => {
    BrowserWindow.getFocusedWindow()?.removeMenu();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

