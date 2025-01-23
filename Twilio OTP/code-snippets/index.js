const twiilo = require('./manager');
/**
 *
 * @param {String} accountSid
 * @param {String} authToken
 * @param {String} serviceSID
 * @returns {Object} twiilo APIs methods
 */
module.exports = (accountSid, authToken, serviceSID) => {
  const twiiloOTPManager = new twiilo(accountSid, authToken, serviceSID);
  return twiiloOTPManager;
};