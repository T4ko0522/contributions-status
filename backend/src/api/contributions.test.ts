import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Express } from 'express';
import express from 'express';
import request from 'supertest';
import contributions from './contributions.js';

describe('Contributions API', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/contributions', contributions);
  });

  it('should return 400 if neither github nor gitlab username is provided', async () => {
    const response = await request(app)
      .get('/api/contributions')
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('At least one of github or gitlab username is required');
  });

  it('should return image when github username is provided', async () => {
    const response = await request(app)
      .get('/api/contributions?github=octocat')
      .expect(200);

    expect(response.headers['content-type']).toContain('image/png');
  });

  it('should return image when gitlab username is provided', async () => {
    const response = await request(app)
      .get('/api/contributions?gitlab=gitlab')
      .expect(200);

    expect(response.headers['content-type']).toContain('image/png');
  });

  it('should return image when both github and gitlab usernames are provided', async () => {
    const response = await request(app)
      .get('/api/contributions?github=octocat&gitlab=gitlab')
      .expect(200);

    expect(response.headers['content-type']).toContain('image/png');
  });

  it('should accept theme parameter and return image', async () => {
    const response = await request(app)
      .get('/api/contributions?github=octocat&theme=blue')
      .expect(200);

    expect(response.headers['content-type']).toContain('image/png');
  });

  it('should use default theme when invalid theme is provided', async () => {
    const response = await request(app)
      .get('/api/contributions?github=octocat&theme=invalid')
      .expect(200);

    expect(response.headers['content-type']).toContain('image/png');
  });

  it('should accept all valid themes', async () => {
    const themes = ['default', 'gitlab', 'blue', 'purple', 'orange', 'red', 'pink'];

    for (const theme of themes) {
      const response = await request(app)
        .get(`/api/contributions?github=octocat&theme=${theme}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('image/png');
    }
  });
});

