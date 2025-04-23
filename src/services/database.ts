import { Collection, Db, MongoClient, ObjectId, UpdateFilter } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { IUser, IUserCreate, createUser, IWatchHistoryItem, IRatingItem } from '@/models/User';
import { IContent, IContentCreate, createContent } from '@/models/Content';

export class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private users: Collection<IUser> | null = null;
  private content: Collection<IContent> | null = null;

  async connect() {
    if (!this.client) {
      this.client = await clientPromise;
      this.db = this.client.db(process.env.MONGODB_DB || 'streamx');
      this.users = this.db.collection<IUser>('users');
      this.content = this.db.collection<IContent>('content');
    }
  }

  // User operations
  async createUser(userData: IUserCreate): Promise<IUser> {
    await this.connect();
    if (!this.users) throw new Error('Database not connected');
    const user = createUser(userData);
    const result = await this.users.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async getUserByUid(uid: string): Promise<IUser | null> {
    await this.connect();
    if (!this.users) throw new Error('Database not connected');
    return this.users.findOne({ uid });
  }

  async updateUser(uid: string, update: Partial<IUser>): Promise<IUser | null> {
    await this.connect();
    if (!this.users) throw new Error('Database not connected');
    const result = await this.users.findOneAndUpdate(
      { uid },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Content operations
  async createContent(contentData: IContentCreate): Promise<IContent> {
    await this.connect();
    if (!this.content) throw new Error('Database not connected');
    const content = createContent(contentData);
    const result = await this.content.insertOne(content);
    return { ...content, _id: result.insertedId };
  }

  async getContent(id: string): Promise<IContent | null> {
    await this.connect();
    if (!this.content) throw new Error('Database not connected');
    return this.content.findOne({ _id: new ObjectId(id) });
  }

  async listContent(
    filter: Partial<IContent> = {},
    page = 1,
    limit = 20
  ): Promise<{ content: IContent[]; total: number }> {
    await this.connect();
    if (!this.content) throw new Error('Database not connected');
    const skip = (page - 1) * limit;
    const [content, total] = await Promise.all([
      this.content.find(filter).skip(skip).limit(limit).toArray(),
      this.content.countDocuments(filter),
    ]);
    return { content, total };
  }

  async updateContent(id: string, update: Partial<IContent>): Promise<IContent | null> {
    await this.connect();
    if (!this.content) throw new Error('Database not connected');
    const result = await this.content.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Watch history operations
  async addToWatchHistory(uid: string, contentId: string, progress: number): Promise<void> {
    await this.connect();
    if (!this.users) throw new Error('Database not connected');
    const historyItem: IWatchHistoryItem = {
      contentId,
      progress,
      timestamp: new Date(),
    };
    const update: UpdateFilter<IUser> = {
      $push: {
        watchHistory: {
          $each: [historyItem],
          $position: 0,
        },
      },
    };
    await this.users.updateOne({ uid }, update);
  }

  // Rating operations
  async addRating(uid: string, contentId: string, rating: number): Promise<void> {
    await this.connect();
    if (!this.users) throw new Error('Database not connected');
    if (!this.content) throw new Error('Database not connected');
    
    const ratingItem: IRatingItem = {
      contentId,
      rating,
      timestamp: new Date(),
    };

    const update: UpdateFilter<IUser> = {
      $push: { ratings: ratingItem },
    };

    // Update user's ratings
    await this.users.updateOne({ uid }, update);

    // Update content's average rating
    const content = await this.getContent(contentId);
    if (content) {
      const newTotalRatings = (content.totalRatings || 0) + 1;
      const newAverageRating =
        ((content.averageRating || 0) * (content.totalRatings || 0) + rating) / newTotalRatings;

      await this.updateContent(contentId, {
        averageRating: newAverageRating,
        totalRatings: newTotalRatings,
      });
    }
  }

  // Subscription operations
  async updateSubscription(
    uid: string,
    status: IUser['subscriptionStatus'],
    tier: IUser['subscriptionTier']
  ): Promise<void> {
    await this.connect();
    if (!this.users) throw new Error('Database not connected');
    const update: UpdateFilter<IUser> = {
      $set: {
        subscriptionStatus: status,
        subscriptionTier: tier,
        updatedAt: new Date(),
      },
    };
    await this.users.updateOne({ uid }, update);
  }
} 