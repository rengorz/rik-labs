const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 540,
    minWidth: 560,
    minHeight: 460,
    title: 'Форма опитування',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('save-results', async (event, results) => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const defaultPath = path.join(os.homedir(), 'Desktop', `survey_${timestamp}.txt`);

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Зберегти результати опитування',
    defaultPath,
    filters: [{ name: 'Текстові файли', extensions: ['txt'] }],
  });

  if (canceled || !filePath) return { success: false };

  const lines = ['=== РЕЗУЛЬТАТИ ОПИТУВАННЯ ==='];
  lines.push(`Дата: ${new Date().toLocaleString('uk-UA')}`);
  lines.push('='.repeat(40));
  lines.push('');

  results.forEach(({ question, answer }, i) => {
    lines.push(`Питання ${i + 1}: ${question}`);
    lines.push(`Відповідь: ${answer}`);
    lines.push('');
  });

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  return { success: true, filePath };
});
