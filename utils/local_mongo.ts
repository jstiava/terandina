// lib/mongodb.js
import { Db, MongoClient, ServerApiVersion } from 'mongodb';

const uri = String(process.env.LOCAL_MONGODB_URI);

class LocalMongo {
  private static instance: LocalMongo | null;
  private client: MongoClient;
  public clientPromise: MongoClient;

  private constructor() {
    if (process.env.NODE_ENV === 'development') {
      if (!(global as any)._mongoTestClientPromise) {
        this.client = new MongoClient(uri, {
          readPreference: 'primary',
          serverApi: {
            version: ServerApiVersion.v1,
            // strict: true,
            deprecationErrors: true,
          },
          ssl: false,
          tls: false,
          connectTimeoutMS: 50000,
        });
      }
      else {
        this.client = (global as any)._mongoTestClientPromise;
      }
    } else {
      this.client = new MongoClient(uri, {
        readPreference: 'primary',
        serverApi: {
          version: ServerApiVersion.v1,
          // strict: true,
          deprecationErrors: true,
        },
        ssl: false,
        tls: false,
        connectTimeoutMS: 50000,
      });
    }

    (global as any)._mongoTestClientPromise = this.client;
    this.clientPromise = this.client;
  }

  public static async getInstance(): Promise<LocalMongo> {
    if (!LocalMongo.instance) {
      try {
        LocalMongo.instance = new LocalMongo();
        await LocalMongo.instance.connect();
      } catch (err) {
        LocalMongo.instance = null;
        throw Error('Cannot connect to LocalMongo');
      }
    }
    return LocalMongo.instance;
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (err) {
      console.log(err);
      throw Error('Cannot connect to LocalMongo');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.close();
      console.log('Disconnected from LocalMongo.');
    } catch (err) {
      console.error('Disconnection error');
    }
  }
}


export default LocalMongo;


