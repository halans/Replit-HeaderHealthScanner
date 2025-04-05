import { 
  users, 
  type User, 
  type InsertUser, 
  type HeaderScan, 
  type InsertHeaderScan 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveHeaderScan(headerScan: InsertHeaderScan): Promise<HeaderScan>;
  getHeaderScansByUrl(url: string, limit?: number): Promise<HeaderScan[]>;
  getRecentHeaderScans(limit?: number): Promise<HeaderScan[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private headerScans: Map<number, HeaderScan>;
  private currentUserId: number;
  private currentHeaderScanId: number;

  constructor() {
    this.users = new Map();
    this.headerScans = new Map();
    this.currentUserId = 1;
    this.currentHeaderScanId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveHeaderScan(insertHeaderScan: InsertHeaderScan): Promise<HeaderScan> {
    const id = this.currentHeaderScanId++;
    const timestamp = new Date();
    const headerScan: HeaderScan = { ...insertHeaderScan, id, timestamp };
    this.headerScans.set(id, headerScan);
    return headerScan;
  }
  
  async getHeaderScansByUrl(url: string, limit: number = 10): Promise<HeaderScan[]> {
    return Array.from(this.headerScans.values())
      .filter(scan => scan.url === url)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async getRecentHeaderScans(limit: number = 10): Promise<HeaderScan[]> {
    return Array.from(this.headerScans.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
