const axios = require('axios');

/**
 * Sends WhatsApp message using Botamation API
 * @param {Object} sales
 * @returns {Boolean}
 */
async function sendWhatsappMessage(sales) {
  try {
    console.log('===== WhatsApp Debug Start =====');

    /* -------------------------------
       1️⃣ Validate required fields
    -------------------------------- */
    if (!sales || !sales.contactNumber) {
      console.error('❌ Missing contact number');
      return false;
    }

    /* -------------------------------
       2️⃣ Normalize phone number
       API requires +91XXXXXXXXXX
    -------------------------------- */
    let phone = String(sales.contactNumber).trim();

    // Remove spaces, dashes if any
    phone = phone.replace(/[\s-]/g, '');

    // Add country code if missing
    if (!phone.startsWith('+')) {
      phone = `+91${phone}`;
    }

    // Final validation (length check)
    if (!/^\+91\d{10}$/.test(phone)) {
      console.error('❌ Invalid phone format after normalization:', phone);
      return false;
    }

    /* -------------------------------
       3️⃣ Safe values (NO undefined)
    -------------------------------- */
    const asmName = String(sales.asmname || 'N/A').trim();
    const contactPerson = String(sales.contactPerson || 'Customer').trim();
    const meetingDate = new Date().toISOString().split('T')[0];

    console.log('ASM Name:', asmName);
    console.log('Contact Person:', contactPerson);
    console.log('Phone:', phone);
    console.log('Meeting Date:', meetingDate);

    console.log('===== WhatsApp Debug End =====');

    /* -------------------------------
       4️⃣ Payload (STRICT FORMAT)
    -------------------------------- */
    const payload = {
      phone: phone,
      first_name: contactPerson,
      actions: [
        {
          action: 'set_field_value',
          field_name: 'asm_name',
          value: asmName
        },
        {
          action: 'set_field_value',
          field_name: 'meeting_date',
          value: meetingDate
        },
        {
          action: 'send_flow',
          flow_id: '1769063016750'
        }
      ]
    };

    // 🔍 Final payload verification
    console.log(
      'WhatsApp Payload:',
      JSON.stringify(payload, null, 2)
    );

    /* -------------------------------
       5️⃣ API Call
    -------------------------------- */
    const whatsappRes = await axios.post(
      'https://app.botamation.in/api/users',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': '1942076.jYByk98c4uD2SijKY8GrlnGjKqXSKGrHqw'
        },
        timeout: 5000
      }
    );

    console.log('WhatsApp Response:', whatsappRes.data);

    /* -------------------------------
       6️⃣ Confirm success
    -------------------------------- */
    if (whatsappRes.data?.success === true) {
      console.log('✅ WhatsApp message sent successfully');
      return true;
    }

    console.warn('⚠️ WhatsApp API did not confirm success');
    return false;

  } catch (error) {
    console.error(
      '❌ WhatsApp API Failed:',
      error.response?.data || error.message
    );
    return false;
  }
}

module.exports = { sendWhatsappMessage };

