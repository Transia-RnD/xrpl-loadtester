const dotenv = require('dotenv')
dotenv.config();
const xrpl = require('xrpl')

const client = new xrpl.Client(process.env.XRPL_WSS_URL);
client.connect()

async function createPayment(userContext, events, done) {
  try {
    const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED)
    const tx = {
      TransactionType: 'Payment',
      Account: wallet.classicAddress,
      Amount: '1000000',
      Destination: 'rhfbXVZP7JFTFwAuhoqmeXCjSdMyHo5Gc8',
    };
    const txResult = await client.autofill(tx);
    const signed = wallet.sign(txResult);
    const command = { 'command': 'submit', 'tx_blob': signed.tx_blob };
    userContext.vars.data = command;
    return done();
  } catch (error) {
    console.log(error);
    // if (client.isConnected) { await client.disconnect(); };
    // throw error;
  }
}

module.exports = { createPayment };