const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('surveyAPI', {
  saveResults: (results) => ipcRenderer.invoke('save-results', results),
});
