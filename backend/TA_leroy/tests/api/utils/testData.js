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
  title: [
    "", 
    null,
    undefined
  ],

  description: [
    "", 
    null,
    undefined
  ],

  status: [
    "INVALID_STATUS", 
    "", 
    "Cancelled", 
    null
  ],

  duration: [
    "five", 
    -1, 
    undefined,                 //Lege waarde (undefined)
    "", 
    null 
  ]
};

export const validFieldValues = {
  title: [
    "A", // minimale lengte
    "Introduction to Playwright", // normaal
    "Advanced End-to-End Testing with Playwright and CI/CD Pipelines", // lange string

    //Speciale tekens
    "!@#$%^&*()_+-=[]{}|;:,.<>?",
    "Test & Validate @ API #1",

    //Unicode / internationale tekens
    "Cursus Nederlands – gevorderd",
    "Prüfung Einführung",
    "Sesión número 1",

    // 😊 emoji
    "Playwright 🚀",
    "Testing ✅",

    // 🔢 mix van alles
    "Test 123 !@# API 🚀"
  ],

  description: [
    "Short desc", // kort
    "Learn the basics of Playwright testing framework", // normaal
    "This is a very long description intended to test how the system handles larger text fields without breaking or truncating unexpectedly.", // lang

    //Speciale tekens
    "Beschrijving met tekens !@#$%^&*() en symbols <>?",

    //Unicode
    "Dit is een beschrijving met accenten é è ë ï ö ü",
    "Descripción con caracteres especiales ñ á",

    //Emoji
    "Testing API 🚀 works fine ✅",
  ],

  status: [
    "Completed",
    "In Progress",
  ],

  duration: [
    1,        // minimum (realistisch)
    10,       // normaal
    99999     // grotere waarde (edge maar geldig)
  ]
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

