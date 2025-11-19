const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

module.exports = {
  generateQRCode
};