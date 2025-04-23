/**
 * Slack integration utilities
 */

/**
 * Validate Slack configuration
 * @param {Object} config - Slack configuration
 * @returns {Object} Validation result
 */
export function validateSlackConfig(config) {
  const errors = {};
  
  if (!config.webhookUrl) {
    errors.webhookUrl = 'Webhook URL is required';
  } else if (!config.webhookUrl.startsWith('https://hooks.slack.com/')) {
    errors.webhookUrl = 'Invalid Slack webhook URL';
  }
  
  if (!config.channel) {
    errors.channel = 'Channel is required';
  } else if (!config.channel.startsWith('#')) {
    errors.channel = 'Channel must start with #';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Send a message to Slack
 * @param {Object} config - Slack configuration
 * @param {Object} message - Message to send
 * @returns {Promise<Object>} Response from Slack
 */
export async function sendSlackMessage(config, message) {
  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: config.channel,
        username: config.username || 'Manago Bot',
        text: message.text,
        blocks: message.blocks || undefined
      })
    });
    
    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending Slack message:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Test Slack configuration
 * @param {Object} config - Slack configuration
 * @returns {Promise<Object>} Test result
 */
export async function testSlackConfig(config) {
  const validation = validateSlackConfig(config);
  if (!validation.isValid) {
    return { 
      success: false, 
      message: 'Invalid configuration', 
      errors: validation.errors 
    };
  }
  
  const testMessage = {
    text: 'Test message from Manago',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Test message from Manago*\nIf you can see this, your Slack integration is working correctly!'
        }
      }
    ]
  };
  
  return sendSlackMessage(config, testMessage);
}