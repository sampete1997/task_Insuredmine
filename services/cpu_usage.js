const os = require('os');
const { exec } = require('child_process');

let lastRestart = 0;
const RESTART_COOLDOWN = 60000; // 1 minute

const run_cpu_usage = () => {
    console.log('Monitoring CPU usage...');

    setInterval(() => {
        const cpuLoad = os.loadavg()[0];
        const cpuCount = os.cpus().length;
        const cpuUsagePercent = (cpuLoad / cpuCount) * 100;

        console.log('CPU Usage:', cpuUsagePercent.toFixed(2), '%');

        const now = Date.now();
        if (cpuUsagePercent > 70 && now - lastRestart > RESTART_COOLDOWN) {
            console.log('CPU Usage high, restarting all PM2 apps...');
            exec('pm2 restart all', (err, stdout, stderr) => {
                if (err) {
                    console.error('PM2 restart error:', err);
                } else {
                    console.log(stdout);
                    lastRestart = now;
                }
            });
        }
    }, 5000);
}

module.exports = { run_cpu_usage };
