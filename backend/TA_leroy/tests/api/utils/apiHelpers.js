import { expect } from '@playwright/test';
import * as testData from './testData.js';
import * as apiHelpers from './apiHelpers.js';
import * as assertions from './assertions.js';

export const createMultipleSessions = async (api, count) => {

  const requestPayloads = [];
  const createdSessions = [];
  const fetchedSessionsById = [];

  for (let i = 0; i < count; i++) {
    // 1. Genereer willekeurige maar valide payload
    const payload = testData.randomSession();
    requestPayloads.push(payload);

    // 2. POST /sessions met deze payload
    const postRes = await createSessionJson(api, payload);
    createdSessions.push(postRes);

    // 3. GET op basis van ID uit create response, en response opslaan in fetchedSessions
    const fetchedRes = await getSessionJson(api, postRes.id);
    fetchedSessionsById.push(fetchedRes);
  }

  return { requestPayloads, createdSessions, fetchedSessionsById };
};

//Session endpoints
export const getSession = async (api, id) => {
  api.get(`/api/sessions/${id}`);
};

export const getSessionJson = async (api, id) => {
  const res = await api.get(`/api/sessions/${id}`);
  assertions.expectOk(res);
  return await res.json();
};

export const createSession = (api, payload) =>
  api.post('/api/sessions', payload);

export const createSessionJson = async (api, payload) => {
  const res = await api.post('/api/sessions', payload);
  assertions.expectCreated(res);
  return await res.json();
};

export const updateSession = (api, id, payload) =>
  api.put(`/api/sessions/${id}`, payload);

export const deleteSession = (api, id) =>
  api.delete(`/api/sessions/${id}`);

//Health endpoints
export const getHealth = (api) =>
  api.get('/health');

export const getHealthJson = async (api) => {
  const res = await api.get('/health');
  assertions.expectOk(res);
  return await res.json();
};





export const updateSingleFieldAndVerify = async (api, sessionId, original, field, newValue) => {
  // 1. Bouw volledige payload met originele waarden
  const payload = {
    title: original.title,
    description: original.description,
    status: original.status,
    duration: original.duration,
    [field]: newValue // overschrijft precies één veld
  };

  // 2. Update uitvoeren
  const updateRes = await updateSession(api, sessionId, payload);
  assertions.expectSuccess(updateRes);

  // 3. GET na update
  const updated = await apiHelpers.getSession(api, sessionId);

  // 4. Verwacht dat alleen het juiste veld is gewijzigd
  const expected = { ...original, [field]: newValue };

  expect(updated).toMatchObject(expected);

  // 5. Rollback naar originele staat
  await apiHelpers.updateSession(api, sessionId, original);

  return updated;
};


