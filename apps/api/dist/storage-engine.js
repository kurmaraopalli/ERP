"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageEngine = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Check if a file or directory exists.
 * Replaces the deprecated fs.exists which doesn't work with promisify.
 */
async function fileExists(filePath) {
    try {
        await fs_1.default.promises.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
class StorageEngine {
    constructor(config) {
        this.config = config;
        this.dataDir = config.dataDir;
        this.backupDir = config.backupDir || path_1.default.join(config.dataDir, 'backups');
    }
    async initialize() {
        if (!(await fileExists(this.dataDir))) {
            await fs_1.default.promises.mkdir(this.dataDir, { recursive: true });
        }
        if (this.config.enableBackups && !(await fileExists(this.backupDir))) {
            await fs_1.default.promises.mkdir(this.backupDir, { recursive: true });
        }
    }
    async read(collection, id) {
        const filePath = this.getFilePath(collection, id);
        if (!(await fileExists(filePath))) {
            return null;
        }
        try {
            const content = await fs_1.default.promises.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        }
        catch (error) {
            throw new Error(`Failed to read ${filePath}: ${error}`);
        }
    }
    async readAll(collection) {
        const collectionDir = path_1.default.join(this.dataDir, collection);
        if (!(await fileExists(collectionDir))) {
            return [];
        }
        try {
            const files = await fs_1.default.promises.readdir(collectionDir);
            const data = [];
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const id = file.replace('.json', '');
                    const item = await this.read(collection, id);
                    if (item) {
                        data.push(item);
                    }
                }
            }
            return data;
        }
        catch (error) {
            throw new Error(`Failed to read collection ${collection}: ${error}`);
        }
    }
    async write(collection, id, data) {
        const filePath = this.getFilePath(collection, id);
        const collectionDir = path_1.default.dirname(filePath);
        if (!(await fileExists(collectionDir))) {
            await fs_1.default.promises.mkdir(collectionDir, { recursive: true });
        }
        // Create backup if enabled
        if (this.config.enableBackups && await fileExists(filePath)) {
            await this.createBackup(collection, id);
        }
        // Atomic write pattern: write to temp file, then rename
        const tempPath = `${filePath}.tmp`;
        const content = JSON.stringify(data, null, 2);
        try {
            await fs_1.default.promises.writeFile(tempPath, content, 'utf-8');
            await fs_1.default.promises.rename(tempPath, filePath);
        }
        catch (error) {
            // Clean up temp file if write fails
            if (await fileExists(tempPath)) {
                await fs_1.default.promises.unlink(tempPath);
            }
            throw new Error(`Failed to write ${filePath}: ${error}`);
        }
    }
    async delete(collection, id) {
        const filePath = this.getFilePath(collection, id);
        if (await fileExists(filePath)) {
            // Create backup before deletion if enabled
            if (this.config.enableBackups) {
                await this.createBackup(collection, id);
            }
            await fs_1.default.promises.unlink(filePath);
        }
    }
    async deleteCollection(collection) {
        const collectionDir = path_1.default.join(this.dataDir, collection);
        if (await fileExists(collectionDir)) {
            await fs_1.default.promises.rm(collectionDir, { recursive: true, force: true });
        }
    }
    async transaction(operation) {
        try {
            return await operation();
        }
        catch (error) {
            throw new Error(`Transaction failed: ${error}`);
        }
    }
    getFilePath(collection, id) {
        return path_1.default.join(this.dataDir, collection, `${id}.json`);
    }
    async createBackup(collection, id) {
        const filePath = this.getFilePath(collection, id);
        const timestamp = Date.now();
        const backupPath = path_1.default.join(this.backupDir, collection, `${id}_${timestamp}.json`);
        const backupDir = path_1.default.dirname(backupPath);
        if (!(await fileExists(backupDir))) {
            await fs_1.default.promises.mkdir(backupDir, { recursive: true });
        }
        await fs_1.default.promises.copyFile(filePath, backupPath);
    }
    async listBackups(collection, id) {
        const backupDir = path_1.default.join(this.backupDir, collection);
        if (!(await fileExists(backupDir))) {
            return [];
        }
        const files = await fs_1.default.promises.readdir(backupDir);
        if (id) {
            return files.filter(file => file.startsWith(`${id}_`));
        }
        return files;
    }
    async restoreBackup(collection, id, timestamp) {
        const backupPath = path_1.default.join(this.backupDir, collection, `${id}_${timestamp}.json`);
        const filePath = this.getFilePath(collection, id);
        if (!(await fileExists(backupPath))) {
            throw new Error(`Backup not found: ${backupPath}`);
        }
        await fs_1.default.promises.copyFile(backupPath, filePath);
    }
}
exports.StorageEngine = StorageEngine;
exports.default = StorageEngine;
