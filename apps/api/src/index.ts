import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { StorageEngine } from './storage-engine';
import { AuthService } from './auth';
import financeRoutes from './routes/finance';
import inventoryRoutes from './routes/inventory';
import salesRoutes from './routes/sales';
import procurementRoutes from './routes/procurement';
import hrRoutes from './routes/hr';

// Load .env from project root (two levels up from apps/api/)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize services — resolve data dir relative to project root
const dataDir = path.resolve(__dirname, '../../..', process.env.DATA_DIR || './data');

const storageEngine = new StorageEngine({
  dataDir,
  enableBackups: process.env.ENABLE_BACKUPS !== 'false',
});

const authService = new AuthService({
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  saltRounds: 10,
});

// Initialize storage and create default user
async function initializeApp() {
  await storageEngine.initialize();
  
  // Create default admin user if not exists
  const existingUser = await storageEngine.read('users', 'admin');
  if (!existingUser) {
    const hashedPassword = await authService.hashPassword('admin123');
    const adminUser = {
      id: 'admin',
      username: 'admin',
      email: 'admin@erp.local',
      password: hashedPassword,
      roles: ['admin'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await storageEngine.write('users', 'admin', adminUser);
    console.log('Default admin user created: username=admin, password=admin123');
  }
}

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await storageEngine.read<User>('users', username);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await authService.verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = authService.generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Module routes — pass shared storageEngine instance
app.use('/api/finance', authenticateToken, financeRoutes(storageEngine));
app.use('/api/inventory', authenticateToken, inventoryRoutes(storageEngine));
app.use('/api/sales', authenticateToken, salesRoutes(storageEngine));
app.use('/api/procurement', authenticateToken, procurementRoutes(storageEngine));
app.use('/api/hr', authenticateToken, hrRoutes(storageEngine));

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Wait for initialization to complete before starting the server
initializeApp()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`ERP API server running on port ${PORT}`);
      console.log(`Data directory: ${dataDir}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  });

export default app;
