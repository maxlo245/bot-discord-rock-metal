// src/utils/logger.js
const LEVELS = { info: '🔵', warn: '🟡', error: '🔴', success: '🟢', debug: '⚪' };

function timestamp() {
  return new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
}

function log(level, message, ...args) {
  const icon = LEVELS[level] || '⚪';
  const prefix = `[${timestamp()}] ${icon} [${level.toUpperCase()}]`;
  if (level === 'error') {
    console.error(prefix, message, ...args);
  } else {
    console.log(prefix, message, ...args);
  }
}

module.exports = {
  info:    (msg, ...a) => log('info', msg, ...a),
  warn:    (msg, ...a) => log('warn', msg, ...a),
  error:   (msg, ...a) => log('error', msg, ...a),
  success: (msg, ...a) => log('success', msg, ...a),
  debug:   (msg, ...a) => log('debug', msg, ...a),
};
