import { Client, Account, Databases, ID, Query, Storage } from "appwrite";
import {
  encryptPassword,
  getErrorMessage,
} from "../functions/helper.function.js";
import "dotenv";

const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERCOLLECTIONID,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKETID,
  apiKey: process.env.NEXT_PUBLIC_APPWRITE_API_KEY,
  chatCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID,
  roomCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHATROOMID,
};

console.log(appwriteConfig);

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export const createUser = async ({ email, password, file }) => {
  try {
    const uploadDocument = await uploadFile(email, file);
    const fileRes = await getFile(uploadDocument.$id);

    console.log(fileRes);

    const newAccount = await account.create(
      ID.unique(),
      email.toLowerCase(),
      password,
      email.toLowerCase()
    );
    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    // const getInitials = avatars.getInitials(email);

    const encryptedPassword = await encryptPassword(password);

    const createDb = await createUserInDb(
      newAccount,
      email.toLowerCase(),
      fileRes.href,
      encryptedPassword
    );

    if (!createDb) {
      throw new Error("Failed to create user in database");
    }

    await signin({ email, password });

    return createDb;
  } catch (e) {
    throw new Error(getErrorMessage(e) || "An unknown error occurred");
  }
};

export const signin = async ({ email, password }) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created:", session);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const logoutUser = async () => {
  return await account.deleteSession("current");
};

export const updatePassword = async (password, oldPassword) => {
  try {
    return await account.updatePassword(password, oldPassword);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    const currentDbUser = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      "",
      [Query.equal("accountId", currentAccount.$id)]
    );

    return { session: currentAccount, db: currentDbUser };
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUser = async (data) => {
  try {
    const currentUser = await getAccount();
    const updateRes = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.db.documents[0].$id,
      data
    );
    return updateRes;
  } catch (e) {
    throw new Error(e);
  }
};

export const emailOtp = async () => {
  try {
    const currentUser = await getAccount();
    return await account.createEmailToken(
      currentUser.session.$id,
      currentUser.session.email,
      true
    );
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
    return getUser.documents[0];
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

export const uploadFile = async (fileId, file) => {
  const fid = fileId.replace("@", "_").replace(".", "");
  try {
    return await storage.createFile(appwriteConfig.bucketId, fid, file);
  } catch (error) {
    throw new Error(error);
  }
};

export const getFile = async (fileId) => {
  try {
    return await storage.getFileView(appwriteConfig.bucketId, fileId);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllFiles = async () => {
  try {
    return await storage.listFiles(appwriteConfig.bucketId);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllUsers = async () => {
  try {
    return await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );
  } catch (error) {
    throw new Error(error);
  }
};

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
    console.log(error);

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
