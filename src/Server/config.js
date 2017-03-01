/**
 * config.js is a configuration file for the server
 * Holds Port & numCPUs
 */
import os from 'os';

const config = {
  port: process.env.PORT || '8080',
  numCPUs: process.env.PROCESSES || os.cpus().length,
  test: false
};

export default config;
