# Node twillo OTP manage

``A nodejs package for verify mobile number , OTP or send sms by twilio. It's build over twilio node SDK.``

## Documentation
 - [Oficial twillo doc](https://www.twilio.com/docs/verify/quickstarts/node-express)
## Installation
```bash
  npm install node-twillo-otp-manager
```
### Inislize client
```js
const accountSID = 'YOUR TWIILO ACCOUND SID';
const authToken = 'YOUR TWILLO AUTH TOKEN';
const serviceSID = "YOUR SERVICESID"
const otpManager = require('node-twillo-otp-manager')(accountSID ,authToken , serviceSID);
```
### Create serviceSID
```js
const friendlyName = "Your service name"; // required
const OTPLenght = "OTP lenght" // default 6
const options = {}; // non required
const res = await otpManager.createServiceSID(friendlyName , OTPLenght , options);
const serviceSID = res?.sid
```
### Send OTP 
```js
const phone = "+918545624541" // phone number with contary code
const res = await otpManager.sendOTP(phone);
console.log('OTP send status : -' , res)
```
### Verify OTP 
```js
const phone = "+918545624541" // phone number with contary code
const OTP = "YOU OTP";
const res = await otpManager.verifyOTP(phone , OTP);
console.log('OTP verify status : -' , res)
```
### Send custem sms
```js
const body = "YOU SMS BODY";
const to = '+915245652145' // recever phone number with contary code
const from  = 'YOUR twillo number';
const res = await otpManager.sendSMS(body , to , from)
console.log('sms send status : -' , res)
```

## 🔗 Let's in touch
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)

