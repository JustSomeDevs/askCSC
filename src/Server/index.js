/**
 *  askcsc server.js -- serves html (with shared client-server code)
 *  @author Albert Hermida
 *  - es6/7 modules "use strict"; by default
 */
import Server from './Server/Server.js';
import config from './config.js';
import cluster from 'cluster';
import readline from 'readline';
import os from 'os';
import dns from 'dns';

// Determine if development flag was called
const dev = process.argv.includes('dev');

// Creates new servers
function runServer(options) {
  const server = new Server(options);
  server.start();
  return server;
}

// Metadata about process
const meta = {};
meta.failedInstances = 0;
meta.requestsServed = 0;
meta.numCPUs = config.numCPUs;

// Log Error & Stats on uncaught exception
process.on('uncaughtException', err => {
  console.error('Caught exception', err, err.stack);
  console.error(`\nFailed with: ${meta.failedInstances} failed instances`);

  // fail --> exit
  process.exit();
});

/**
 *  Manage Clusters
 */
if (cluster.isMaster) {

  // All processes
  const processes = [];

  // Set Master Cluster -- Important to note -- cluster.settings
  cluster.setupMaster();

  // spin up new clusters proportional to numCPUs -->
  for (let i = 0; i < config.numCPUs; i++) {
    let fork = cluster.fork();

    // push process id into processes
    processes.push(fork.process.pid);
  }

  // Log Requests From Cluster
  cluster.on('message', msg => {
    if (msg.cmd && msg.cmd == 'notifyRequest') {
      meta.requestsServed++;
    }
  });

  /**
   *  Handle Worker Failure
   *  Can only happen 30 times to mitigate real bugs.
   */
  cluster.on('exit', (worker) => {
    if (meta.failedProcesses < 30) {

      // if worker fails -- restart new one & log dead one
      console.log(`Worker pid: ${worker.process.pid} failed -- restarting.`);

      // delete old process
      delete processes[processes.indexOf(worker.process.pid)];

      // spin up the new one & add to failed number
      const fork = cluster.fork();

      // push process id into processes
      processes.push(fork.process.pid);

      // keep count of how many fails
      meta.failedProcesses++;
    } else {

      // Quit if there are over 30 process failures
      console.log('30 workers failed, shutting down');
      process.exit();
    }
  });

  // timestamp
  const date = new Date();

  // get hour
  const hr = date.getHours() % 12;
  const hour = [
    `${hr === 0 ? 12 : hr}:`,
    `${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`,
    `${date.getHours() <= 12 ? 'AM' : 'PM'}`,
  ].join('');

  const startedAt = [
    `Server started at ${hour} on:`,
    ` ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`,
  ].join('');

  // Log start
  console.log(startedAt);

  // if we're in our dev environment, start it up
  if (dev) {

    // create prompt
    console.log('You can type: "exit" or "quit" to shut down the app.');
    console.log('Type: "stats" to get info about the server.');

    // set up user interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let getLine = () => {
      rl.question('Command: ', answer => {
        if (answer == 'exit' || answer == 'quit') {
          process.exit(0);
        }
        if (answer == 'stats') {

          // Log metadata
          console.log(`CPU cores: ${meta.numCPUs}`);
          console.log(`Requests served: ${meta.requestsServed}`);
          console.log(`Failed instances: ${meta.failedInstances}`);

          // Log Processes
          console.log(`Master ID: ${process.pid}`);
          console.log(`Worker IDs: ${processes.join(',')}`);
        }
        getLine('Command:');
      });
    };

    // Log IP
    dns.lookup(os.hostname(), (err, address) => {
      console.log(`IP Address: ${address}`);
      
      // start up command line loop
      getLine();
    });
  } else {
    console.log('\nType CTRL-c to exit');
  }
} else {

  /**
   * Spin up new Server if not cluster master
   * called from that nifty class we wrote, will create a Koa server in the
   * cluster for every core that we have.
   */
  runServer(config);
}
