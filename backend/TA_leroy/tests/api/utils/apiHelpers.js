import * as testData from './testData.js';

export const createMultipleSessions = async (api, count) => {

  const payloads = [];
  const responses = [];

  for (let i = 0; i < count; i++) {
    const payload = testData.randomSession();
    console.log("FINAL PAYLOAD SENT:", payload);
    const res = await api.post('/api/sessions', payload );

    console.log('RES STATUS:', res.status());
    console.log('RES TEXT:', await res.text());

    console.log('TYPE OF api:', typeof api);
    console.log('api.constructor.name:', api.constructor.name);

    if (res.status() !== 201) {
      console.error("CREATE FAILED:", payload);
      console.error(await res.text());
    }

    const body = await res.json();

    payloads.push(payload);
    responses.push(body);
  }

  return { payloads, responses };
};

export const getSession = (api, id) =>
  api.get(`/api/sessions/${id}`);

export const updateSession = (api, id) =>
  api.put(`/api/sessions/${id}`, { json: data });

export const deleteSession = (api, id) =>
  api.delete(`/api/sessions/${id}`);