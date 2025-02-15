import Mongo from "@/utils/mongo";


export async function logAction(
  uuid: string,
  type: string,
  user: any,
  details: any,
) {
  try {
    const mongo = await Mongo.getInstance();
    const db = mongo.clientPromise.db('events');
    const collection = db.collection('log');

    const logEntry = {
      uuid,
      type,
      timestamp: new Date(),
      user,
      details,
    };

    const result = await collection.insertOne(logEntry);
    console.log('Log entry created:', result.insertedId);
  } catch (error) {
    console.error('Error logging event:', error);
  }
}

export default logAction;
