const twwilo = require("twilio");
module.exports =  class {
  /**
   *
   * @param {String} accountSid Your twiilo account sid
   * @param {String} authToken Your twiilo account authToken
   */
  constructor(accountSid, authToken, serviceSID) {
    try {
      this.accountSid = accountSid;
      this.authToken = authToken;
      this.client = twwilo(this.accountSid, this.authToken);
      this.serviceSID = serviceSID ? serviceSID : null;
    } catch (err) {
      throw err;
    }
  }
  /**
   *
   * @param {String} friendlyName Your app or service name which show in message
   * @param {String} OTPLenght Lenght of otp default = 6 digit
   * @param {Object} {}
   * @returns {object} {serviceSID , status}
   */
  async createServiceSID(friendlyName, OTPLenght, option = {}) {
    try {
      friendlyName ? friendlyName : "Your otp";
      OTPLenght ? OTPLenght : "6";
      const status = await this.client.verify.v2.services.create({
        friendlyName: friendlyName,
        codeLength: OTPLenght,
        ...option,
      });
      return {
        serviceSID: status?.sid,
        status,
      };
    } catch (err) {
      throw err;
    }
  }
  /**
   *
   * @param {String} mobile => Mobile/phone number with contary code on wich you send otp like +918545652541
   */
  async sendOTP(mobile) {
    try {
      const otpSendStatus = await this.client.verify.v2
        .services(this.serviceSID)
        .verifications.create({ to: mobile, channel: "sms" });
      return otpSendStatus;
    } catch (err) {
      throw err;
    }
  }
  /**
   *
   * @param {String} mobile
   * @param {String} OTP
   * @returns {Object} response
   */
  async verifyOTP(mobile, OTP) {
    try {
      const verifyStatus = await this.client.verify.v2
        .services(this.serviceSID)
        .verificationChecks.create({
          to: mobile,
          code: OTP,
        });
      return verifyStatus;
    } catch (err) {
      throw err;
    }
  }
  /**
   * 
   * @param {String} sms body 
   * @param {String} to => recever phone number with contary code 
   * @param {String} from  => Your twiilo mobile number
   * @returns {Object} response
   */
  async sendSMS( body, to, from) {
    try {
      const message = { body, to, from };
      const status = await this.client.messages.create(message);
      return status;
    } catch (err) {
      throw err;
    }
  }
};