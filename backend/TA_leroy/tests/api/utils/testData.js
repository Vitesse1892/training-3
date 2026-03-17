import { randomUUID } from 'crypto';

export const randomString = (len = 10) =>
  Array.from({ length: len }, () =>
    "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26))
  ).join('');

export const randomSession = () => ({
  title: `API Test Session - ${randomUUID()}`,
  description: randomString(30),
  status: "Pending",
  duration: 2.5,
});

// export const updateSessionData = () => ({
//   title: `API Test Session Updated - ${randomUUID()}`,
//   description: 'Updated via Playwright API test',
//   status: 'In Progress',
//   duration: 3.0,
// });

// invalid values per veld
export const invalidFieldValues = {
  title: ["", 123, null, "a".repeat(10000)],
  description: [999, null],
  status: ["INVALID_STATUS", "", "Cancelled"],
  duration: ["five", -1, null]
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

