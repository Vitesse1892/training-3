import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalTeardown() {
  const projectRoot = path.join(__dirname, '..');
  const backendDir = path.join(projectRoot, 'backend');
  const pidFile = path.join(backendDir, '.backend-test-pid');

  try {
    if (fs.existsSync(pidFile)) {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10);
      if (!Number.isNaN(pid)) {
        try {
          process.kill(pid, 'SIGTERM');
        } catch (_) {}
        // Remove pid file
        fs.unlinkSync(pidFile);
      }
    }
  } catch (e) {
    console.warn('⚠️  Global teardown warning:', e.message);
  }
}


