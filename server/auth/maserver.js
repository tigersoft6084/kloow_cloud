const fetchMaserverUserData = async (log, pwd) => {
  try {
    const { default: fetch } = await import('node-fetch');

    // Step 1: Authenticate with maserver
    const loginResponse = await fetch('https://maserver.click/wp-json/custom/v1/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ log, pwd })
    });

    const loginResult = await loginResponse.json();

    if (!loginResult.status) {
      return { success: false, message: loginResult.data || 'Invalid credentials' };
    }

    // Step 2: Fetch membership data
    const membershipResponse = await fetch(
      `https://maserver.click/?ihc_action=api-gate&ihch=o1dWeElW6C9Ra7qY7y0Te4tg0rEp&action=get_user_levels&uid=${loginResult.data.uid}`
    );
    const membershipResult = await membershipResponse.json();
    const membership = Object.values(membershipResult.response)[0];
    if (membership?.is_expired !== false) {
      return {
        success: false,
        message: 'Membership is expired. Please renew your subscription.'
      };
    }
    return {
      success: true,
      user: {
        uid: loginResult.data.uid,
        username: log,
        server: 'maserver',
        membership_expire_time: membership?.expire_time || null
      }
    };
  } catch (error) {
    return { success: false, message: `Authentication error: ${error.message}` };
  }
};

module.exports = { fetchMaserverUserData };
