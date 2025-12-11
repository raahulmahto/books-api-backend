const request = require('supertest');
const app = require('../src/app'); // <-- use app, not index

describe('Health Check', () => {
  it('returns API running', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
