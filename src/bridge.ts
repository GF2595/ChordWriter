import { contextBridge, ipcRenderer } from "electron";

const _window = {
    minimize: (): void => ipcRenderer.send('window/minimize'),
    maximize: (): void => ipcRenderer.send('window/maximize'),
    close: (): void => ipcRenderer.send('window/close')
};

export const API = {
    window: _window
};

contextBridge.exposeInMainWorld('api', API);
