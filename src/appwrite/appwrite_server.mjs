import { Client, Databases, ID, Query } from "node-appwrite";

const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERCOLLECTIONID,
  apiKey: process.env.NEXT_PUBLIC_APPWRITE_API_KEY,
  chatCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID,
  roomCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHATROOMID,
};

console.log(appwriteConfig);

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setKey(appwriteConfig.appwriteConfig);

export const database = new Databases(client);

export const createUserInDb = async (doc, email, avatar, password) => {
  try {
    const db = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: doc.$id,
        email: email,
        avatar: avatar,
        password: password,
      }
    );
    return db;
  } catch (e) {
    throw new Error(e);
  }
};

export const getUserByEmail = async (email) => {
  try {
    const getUser = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      "",
      [Query.equal("email", email)]
    );
    return getUser;
  } catch (e) {
    throw new Error(e);
  }
};

export const getUserById = async (id) => {
  try {
    const getUser = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      id
    );
    return getUser;
  } catch (e) {
    throw new Error(e);
  }
};

export const createRoom = async ({ room, user }) => {
  try {
    await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
      process.env.NEXT_PUBLIC_APPWRITE_CHATROOMID,
      ID.unique(),
      { name: room, user }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const storeMessage = async ({ room, user, message }) => {
  try {
    await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
      process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID,
      ID.unique(),
      { room, message, user }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const getMessages = async ({ room }) => {
  try {
    return await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
      process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID,
      "",
      [Query.equal("room", room)]
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const getRooms = async () => {
  try {
    return await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.roomCollectionId,
      ""
    );
  } catch (error) {
    throw new Error(error);
  }
};
