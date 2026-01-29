import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup() {
  console.log('🔄 Running database reset before tests...');
  
  try {
    // Run reset-db.sh from the project root
    const projectRoot = path.join(__dirname, '..');
    execSync('./reset-db.sh', { 
      cwd: projectRoot, 
      stdio: 'inherit',
      shell: true 
    });
    console.log('✅ Database reset completed successfully');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    // Don't fail the tests if reset fails, just warn
    console.warn('⚠️  Continuing with tests despite database reset failure');
  }

  // Start backend server for tests
  const projectRoot = path.join(__dirname, '..');
  const backendDir = path.join(projectRoot, 'backend');
  const pidFile = path.join(backendDir, '.backend-test-pid');

  console.log('🚀 Starting backend server for tests...');
  const child = spawn('npm', ['run', 'start'], {
    cwd: backendDir,
    detached: true,
    stdio: 'ignore',
    shell: true,
  });
  // Detach and store PID to terminate later in global teardown
  child.unref();
  try {
    fs.writeFileSync(pidFile, String(child.pid));
  } catch (e) {
    console.warn('⚠️  Could not write backend PID file:', e.message);
  }

  // Wait for backend health
  const waitSeconds = 30;
  let healthy = false;
  for (let i = 0; i < waitSeconds; i++) {
    try {
      execSync('curl -sf http://localhost:3001/health | cat', { stdio: 'ignore' });
      healthy = true;
      break;
    } catch (_) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  if (healthy) {
    console.log('✅ Backend server is up (http://localhost:3001)');
  } else {
    console.error('❌ Backend server did not become healthy in time');
  }
}
