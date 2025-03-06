import { db } from "../firebase.js";
import {
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase-admin/auth";

export const getAllUsers = async (req, res) => {
  try {
    const limit = req.query.limit;
    const usersCollection = query(collection(db, "Users"));
    const userSnapshot = await getDocs(usersCollection);
    const users = userSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    if (!isNaN(limit) && limit > 0) {
      return res.status(200).json(users.slice(0, limit));
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const usersCollection = query(collection(db, "Users"));
    const userSnapshot = await getDocs(usersCollection);
    const users = userSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    const user = users.find((u) => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({
        status: res.statusCode,
        message: "User not Found!",
      });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      status: res.statusCode,
      message: "All fields are required",
    });
  }

  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
    });

    const users = await addDoc(collection(db, "Users"), {
      email,
      id: userRecord.uid
    });

    if (users || userRecord) {
      return res.status(200).json({
        status: res.statusCode,
        message: "User created successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const editUser = async (req, res) => {
  const { email, password } = req.body;
  const ID = req.params.id;
  if (!email || !password) {
    return res.status(401).json({
      status: res.statusCode,
      message: "All fields are required",
    });
  }

  try {
    const users = await updateDoc(doc(db, "Users", ID), {
      email,
      password,
    });

    if (users) {
      return res.status(200).json({
        status: res.statusCode,
        message: "Updated Successfullly",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const ID = req.params.id;
    const users = await deleteDoc(doc(db, "Users", ID));

    return res.status(200).json({
      status: res.statusCode,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};
