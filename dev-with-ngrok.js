require('dotenv').config();
const { spawn } = require('child_process');
const ngrok = require('ngrok');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Start Next.js development server
    const next = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
    });

    // Wait for Next.js to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Start ngrok tunnel
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTH_TOKEN,
    });

    console.log(`\n🚀 Next.js server running at: http://localhost:${PORT}`);
    console.log(`🌐 Public URL: ${url}`);

    // Handle cleanup
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await ngrok.kill();
      next.kill();
      process.exit();
    });

  } catch (error) {
    console.error('Error starting development server:', error);
    process.exit(1);
  }
}

start(); 