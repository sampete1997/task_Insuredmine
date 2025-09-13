const express = require('express');
const { Worker } = require('worker_threads');
const apiRoutes = require('./routes/policy.route');
const { connectMongoDB } = require('./config');
const morgan = require('morgan');
const { run_cpu_usage } = require('./services/cpu_usage');
const app = express();
const cron = require('node-cron');
const { checkTimeToExecuteInsertQuery } = require('./services/schedule');
app.use(express.json());
app.use(morgan('combined'));

(async () => {
    await connectMongoDB();
})();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', apiRoutes);

// insert data to db given time and date
cron.schedule('* * * * *', async () => {
    await checkTimeToExecuteInsertQuery();
});

app.listen(3000, () => {
    console.log('Server running on port 3000')
    run_cpu_usage();
});
