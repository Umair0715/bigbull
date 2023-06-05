const axios = require('axios');

// Function to get all notifications for a payment
async function getAllNotifications(paymentId) {
  try {
    const apiUrl = `https://api.nowpayments.io/v1/payment/${paymentId}/notifications`;

    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error retrieving notifications:', error.response.data);
    throw error;
  }
}

module.exports = getAllNotifications;
// Call the function with the payment ID to retrieve notifications
