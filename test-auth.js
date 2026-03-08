require('dotenv').config();

const API_URL = `http://localhost:${process.env.PORT || 3000}/api/battery`;
const API_KEY = process.env.API_KEY || 'your_secret_api_key_here';

async function testAuth() {
  console.log('Testing unauthorized request...');
  try {
    const res = await fetch(API_URL);
    if (res.status === 401) {
      console.log('SUCCESS: Request was correctly rejected (401).');
    } else {
      console.error('FAILED: Expected 401, got', res.status);
    }
  } catch (error) {
    console.error('FAILED: Request error:', error.message);
  }

  console.log('\nTesting authorized request with header...');
  try {
    const res = await fetch(API_URL, {
      headers: { 'X-API-Key': API_KEY }
    });
    if (res.ok) {
      const data = await res.json();
      console.log('SUCCESS: Request authorized. Received data:', data);
    } else {
      console.error('FAILED: Status:', res.status, await res.text());
    }
  } catch (error) {
    console.error('FAILED: Request error:', error.message);
  }

  console.log('\nTesting authorized request with query param...');
  try {
    const res = await fetch(`${API_URL}?api_key=${API_KEY}`);
    if (res.ok) {
      const data = await res.json();
      console.log('SUCCESS: Request authorized via query. Received data:', data);
    } else {
      console.error('FAILED: Status:', res.status, await res.text());
    }
  } catch (error) {
    console.error('FAILED: Request error:', error.message);
  }
}

testAuth();
