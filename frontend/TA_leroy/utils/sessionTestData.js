import { SESSION_STATUS } from '../constants/sessionStatus.js';

export function createSessionContext(overrides = {}) {
  const timestamp = Date.now();
  const durations = ['1', '1,5', '2', '3'];

  return {
    title: `Session ${timestamp}`,
    description: `My test description (${timestamp})`,
    status: SESSION_STATUS.PENDING,
    durationHours: durations[Math.floor(Math.random() * durations.length)],
    ...overrides,
  };
}