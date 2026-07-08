"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const storage_engine_1 = require("./storage-engine");
const auth_1 = require("./auth");
const finance_1 = __importDefault(require("./routes/finance"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const sales_1 = __importDefault(require("./routes/sales"));
const procurement_1 = __importDefault(require("./routes/procurement"));
const hr_1 = __importDefault(require("./routes/hr"));
// Load .env from project root (two levels up from apps/api/)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Initialize services — resolve data dir relative to project root
const dataDir = path_1.default.resolve(__dirname, '../../..', process.env.DATA_DIR || './data');
const storageEngine = new storage_engine_1.StorageEngine({
    dataDir,
    enableBackups: process.env.ENABLE_BACKUPS !== 'false',
});
const authService = new auth_1.AuthService({
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
        const user = await storageEngine.read('users', username);
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
// Module routes — pass shared storageEngine instance (no auth for development)
app.use('/api/finance', (0, finance_1.default)(storageEngine));
app.use('/api/inventory', (0, inventory_1.default)(storageEngine));
app.use('/api/sales', (0, sales_1.default)(storageEngine));
app.use('/api/procurement', (0, procurement_1.default)(storageEngine));
app.use('/api/hr', (0, hr_1.default)(storageEngine));
// Error handling
app.use((err, _req, res, _next) => {
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
exports.default = app;
