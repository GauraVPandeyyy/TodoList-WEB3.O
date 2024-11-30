module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache's default port
      network_id: "*",       // Matches any network
    },
  },
  // Specify the Solidity version
  compilers: {
    solc: {
      version: "0.8.0",      // Match your Solidity version
    },
  },
};
