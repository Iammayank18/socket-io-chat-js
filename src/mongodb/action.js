import { ObjectId } from "mongodb";
import { getDB } from ".";

export const createUserInDb = async (
  _id: string,
  email: string,
  avatar: URL,
  password: string
) => {
  try {
    const { getCollection } = await getDB();
    const userRes = await getCollection<{
      accountId: string;
      email: string;
      avatar: URL;
      password: string;
    }>(process.env.MONGODB_COLLECTION_USER).insertOne({
      accountId: _id,
      email: email,
      avatar: avatar,
      password: password,
    });
    return userRes;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const { getCollection } = await getDB();
    const getUser = await getCollection(
      process.env.MONGODB_COLLECTION_USER
    ).findOne({ email });
    return getUser;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserById = async (id: ObjectId) => {
  try {
    const { getCollection } = await getDB();
    const getUser = await getCollection(
      process.env.MONGODB_COLLECTION_USER
    ).findOne({ _id: id });
    return getUser;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const createRoom = async ({ room, user }) => {
  try {
    const { getCollection } = await getDB();
    const roomRes = await getCollection<{
      room: string;
      user: string;
    }>(process.env.MONGODB_COLLECTION_USER).insertOne({
      room,
      user,
    });
    return roomRes;
  } catch (error) {
    throw new Error(error);
  }
};

export const storeMessage = async ({ room, user, message }) => {
  try {
    const { getCollection } = await getDB();
    const msgRes = await getCollection<{
      room: string;
      user: string;
      message: string;
    }>(process.env.MONGODB_COLLECTION_CHAT).insertOne({
      room,
      message,
      user,
    });
    return msgRes;
  } catch (error) {
    throw new Error(error);
  }
};

export const getMessages = async ({ room }) => {
  try {
    const { getCollection } = await getDB();
    const msgRes = await getCollection<{
      room: string;
    }>(process.env.MONGODB_COLLECTION_CHAT).insertOne({
      room,
    });
    return msgRes;
  } catch (error) {
    throw new Error(error);
  }
};

export const getRooms = async () => {
  try {
    const { getCollection } = await getDB();
    const roomRes = await getCollection(process.env.MONGODB_COLLECTION_ROOM)
      .find({})
      .toArray();
    return roomRes;
  } catch (error) {
    throw new Error(error);
  }
};
