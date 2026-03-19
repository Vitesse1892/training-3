import { randomUUID } from 'crypto';
import { SESSION_STATUS } from '../../constants/sessionStatus.js';

export const randomString = (len = 10) =>
  Array.from({ length: len }, () =>
    "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26))
  ).join('');

export const randomValidStatus = () => {
  const statuses = Object.values(SESSION_STATUS);
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const randomDuration = () => {
  const steps = 201; // 0 t/m 100 in stappen van 0.5
  const index = Math.floor(Math.random() * steps);
  return index * 0.5;
};


export const randomSession = () => ({
  title: `API Test Session - ${randomUUID()}`,
  description: randomString(30),
  status: randomValidStatus(),
  duration: randomDuration(),
});



// invalid values per veld
export const invalidFieldValues = {
  title: ["", null],
  description: ["", null],
  status: ["INVALID_STATUS", "", "Cancelled", null],
  duration: ["five", -1, , "", null]
};

// genereert volledige payloads met 1 invalide veld
export const generateInvalidUpdatePayloads = () => {

  const payloads = [];

  for (const field in invalidFieldValues) {

    for (const value of invalidFieldValues[field]) {

      const base = randomSession();

      base[field] = value;

      payloads.push({
        field,
        value,
        payload: base
      });
    }

  }

  return payloads;
};



export const randomUser = () => ({
  username: `user_${Date.now()}`,
  password: 'pw-' + Math.random().toString(36).slice(2, 8),
});

export const createUser = async (api) => {
  const user = randomUser();
  await api.post('/api/create-account', user);
  return user;
};

