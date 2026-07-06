import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

export interface StorageConfig {
  dataDir: string;
  backupDir?: string;
  enableBackups?: boolean;
}

export interface Transaction<T> {
  data: T;
  timestamp: number;
  id: string;
}

export class StorageEngine {
  private config: StorageConfig;
  private dataDir: string;
  private backupDir: string;

  constructor(config: StorageConfig) {
    this.config = config;
    this.dataDir = config.dataDir;
    this.backupDir = config.backupDir || path.join(config.dataDir, 'backups');
  }

  async initialize(): Promise<void> {
    if (!(await exists(this.dataDir))) {
      await mkdir(this.dataDir, { recursive: true });
    }
    if (this.config.enableBackups && !(await exists(this.backupDir))) {
      await mkdir(this.backupDir, { recursive: true });
    }
  }

  async read<T>(collection: string, id: string): Promise<T | null> {
    const filePath = this.getFilePath(collection, id);
    
    if (!(await exists(filePath))) {
      return null;
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      throw new Error(`Failed to read ${filePath}: ${error}`);
    }
  }

  async readAll<T>(collection: string): Promise<T[]> {
    const collectionDir = path.join(this.dataDir, collection);
    
    if (!(await exists(collectionDir))) {
      return [];
    }

    try {
      const files = await fs.promises.readdir(collectionDir);
      const data: T[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const id = file.replace('.json', '');
          const item = await this.read<T>(collection, id);
          if (item) {
            data.push(item);
          }
        }
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to read collection ${collection}: ${error}`);
    }
  }

  async write<T>(collection: string, id: string, data: T): Promise<void> {
    const filePath = this.getFilePath(collection, id);
    const collectionDir = path.dirname(filePath);

    if (!(await exists(collectionDir))) {
      await mkdir(collectionDir, { recursive: true });
    }

    // Create backup if enabled
    if (this.config.enableBackups && await exists(filePath)) {
      await this.createBackup(collection, id);
    }

    // Atomic write pattern: write to temp file, then rename
    const tempPath = `${filePath}.tmp`;
    const content = JSON.stringify(data, null, 2);

    try {
      await writeFile(tempPath, content, 'utf-8');
      await fs.promises.rename(tempPath, filePath);
    } catch (error) {
      // Clean up temp file if write fails
      if (await exists(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
      throw new Error(`Failed to write ${filePath}: ${error}`);
    }
  }

  async delete(collection: string, id: string): Promise<void> {
    const filePath = this.getFilePath(collection, id);

    if (await exists(filePath)) {
      // Create backup before deletion if enabled
      if (this.config.enableBackups) {
        await this.createBackup(collection, id);
      }
      await fs.promises.unlink(filePath);
    }
  }

  async deleteCollection(collection: string): Promise<void> {
    const collectionDir = path.join(this.dataDir, collection);

    if (await exists(collectionDir)) {
      await fs.promises.rm(collectionDir, { recursive: true, force: true });
    }
  }

  async transaction<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw new Error(`Transaction failed: ${error}`);
    }
  }

  private getFilePath(collection: string, id: string): string {
    return path.join(this.dataDir, collection, `${id}.json`);
  }

  private async createBackup(collection: string, id: string): Promise<void> {
    const filePath = this.getFilePath(collection, id);
    const timestamp = Date.now();
    const backupPath = path.join(this.backupDir, collection, `${id}_${timestamp}.json`);
    const backupDir = path.dirname(backupPath);

    if (!(await exists(backupDir))) {
      await mkdir(backupDir, { recursive: true });
    }

    await fs.promises.copyFile(filePath, backupPath);
  }

  async listBackups(collection: string, id?: string): Promise<string[]> {
    const backupDir = path.join(this.backupDir, collection);
    
    if (!(await exists(backupDir))) {
      return [];
    }

    const files = await fs.promises.readdir(backupDir);
    
    if (id) {
      return files.filter(file => file.startsWith(`${id}_`));
    }
    
    return files;
  }

  async restoreBackup(collection: string, id: string, timestamp: number): Promise<void> {
    const backupPath = path.join(this.backupDir, collection, `${id}_${timestamp}.json`);
    const filePath = this.getFilePath(collection, id);

    if (!(await exists(backupPath))) {
      throw new Error(`Backup not found: ${backupPath}`);
    }

    await fs.promises.copyFile(backupPath, filePath);
  }
}

export default StorageEngine;
