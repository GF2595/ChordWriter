import { Song } from '@model/song';
import { contextBridge, ipcRenderer } from 'electron';

const _window = {
    minimize: (): void => ipcRenderer.send('window/minimize'),
    maximize: (): void => ipcRenderer.send('window/maximize'),
    close: (): void => ipcRenderer.send('window/close'),
    openFile: (): Promise<any> => ipcRenderer.invoke('dialog/openFile'),
    saveToNewFile: (fileContents: string): Promise<any> =>
        ipcRenderer.invoke('dialog/saveFile', fileContents),
    print: (): void => ipcRenderer.send('print'),
    showPdf: (song: Song): void => ipcRenderer.send('action/showPdf', song),
};

export const API = {
    window: _window,
};

contextBridge.exposeInMainWorld('api', API);
