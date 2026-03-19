import * as testData from './testData.js';

export const createMultipleSessions = async (api, count) => {

  const payloads = [];
  const responses = [];

  for (let i = 0; i < count; i++) {
    const payload = testData.randomSession();
    console.log("FINAL PAYLOAD SENT:", payload);
    const res = await api.post('/api/sessions', payload );

    if (res.status() !== 201) {
      console.error("CREATE FAILED:", payload);
      console.error(await res.text());
    }

    let body = await res.json();
    body = normalizeDates(body); // ← Normaliseer direct na create

    payloads.push(payload);
    responses.push(body);
  }

  return { payloads, responses };
};

export const getSession = async (api, id) => {
  const res = await api.get(`/api/sessions/${id}`);
  const body = await res.json();
  return normalizeDates(body);
};

export const updateSession = (api, id, payload) =>
  api.put(`/api/sessions/${id}`, payload);

export const deleteSession = (api, id) =>
  api.delete(`/api/sessions/${id}`);

function normalizeDates(obj) { //updated_at kan '2026-03-19 13:39:00', maar ook '2026-03-19T13:39:00.312Z'. Dit voorkomt falende tests door inconsistentie in date formatting tussen create en get/update responses
  return {
    ...obj,
    created_at: new Date(obj.created_at).toISOString(),
    updated_at: new Date(obj.updated_at).toISOString()
  };
}