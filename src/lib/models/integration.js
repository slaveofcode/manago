import prisma from '../prisma.js';

/**
 * Get all integrations for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of integrations
 */
export async function getUserIntegrations(userId) {
  return prisma.integration.findMany({
    where: { userId }
  });
}

/**
 * Get a specific integration
 * @param {string} id - Integration ID
 * @returns {Promise<Object>} Integration object
 */
export async function getIntegrationById(id) {
  return prisma.integration.findUnique({
    where: { id }
  });
}

/**
 * Get integration by type for a user
 * @param {string} userId - User ID
 * @param {string} type - Integration type (slack, github, etc.)
 * @returns {Promise<Object>} Integration object
 */
export async function getIntegrationByType(userId, type) {
  return prisma.integration.findFirst({
    where: { 
      userId,
      type
    }
  });
}

/**
 * Create a new integration
 * @param {Object} data - Integration data
 * @returns {Promise<Object>} Created integration
 */
export async function createIntegration(data) {
  return prisma.integration.create({
    data
  });
}

/**
 * Update an integration
 * @param {string} id - Integration ID
 * @param {Object} data - Updated integration data
 * @returns {Promise<Object>} Updated integration
 */
export async function updateIntegration(id, data) {
  return prisma.integration.update({
    where: { id },
    data
  });
}

/**
 * Delete an integration
 * @param {string} id - Integration ID
 * @returns {Promise<Object>} Deleted integration
 */
export async function deleteIntegration(id) {
  return prisma.integration.delete({
    where: { id }
  });
}

/**
 * Enable or disable an integration
 * @param {string} id - Integration ID
 * @param {boolean} enabled - Whether to enable or disable
 * @returns {Promise<Object>} Updated integration
 */
export async function toggleIntegration(id, enabled) {
  return prisma.integration.update({
    where: { id },
    data: { enabled }
  });
}