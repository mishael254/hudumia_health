const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generate2FASecret = async (username) => {
  const secret = speakeasy.generateSecret({
    name: `HudumiaHealth (${username})`,
  });

  const qrCode = await qrcode.toDataURL(secret.otpauth_url);

  return { ascii: secret.ascii, qrCode };
};



module.exports = { generate2FASecret, verify2FAToken };
