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

export const getAllDocuments = async (req, res) => {
  try {
    const limit = req.query.limit;
    const documentsCollection = query(collection(db, "Documents"));
    const documentSnapshot = await getDocs(documentsCollection);
    const documents = documentSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    if (!isNaN(limit) && limit > 0) {
      return res.status(200).json(documents.slice(0, limit));
    }

    return res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const getDocument = async (req, res) => {
  try {
    const ID = req.params.id;
    const documentsCollection = query(collection(db, "Documents"));
    const documentSnapshot = await getDocs(documentsCollection);
    const documents = documentSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const document = documents.find((u) => u.id === ID);

    if (document) {
      return res.status(200).json(document);
    } else {
      return res.status(404).json({
        status: res.statusCode,
        message: "Document not found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const createDocument = async (req, res) => {
  try {
    const {
      personInCharge,
      status,
      uploadedFileUrl,
      dateSubmitted,
      expiration,
      name,
    } = req.body;

    if (
      !name ||
      !uploadedFileUrl ||
      !personInCharge ||
      !dateSubmitted ||
      !expiration ||
      !status
    ) {
      return res.status(401).json({
        status: res.statusCode,
        message: "Unprocessable Content",
      });
    }

    await addDoc(collection(db, "Documents"), {
      personInCharge,
      status,
      uploadedFileUrl,
      dateSubmitted,
      expiration,
      renewal: "N/A",
      name,
    });

    res.status(200).json({
      status: res.statusCode,
      message: "Created Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const ID = req.params.id;
    const { name, personInCharge, status, uploadedFileUrl } = req.body;

    if (!name || !status) {
      return res.status(401).json({
        status: res.statusCode,
        message: "Unprocessable Content",
      });
    }

    await updateDoc(doc(db, "Documents", ID), {
      name,
      personInCharge,
      status,
      uploadedFileUrl,
    });

    res.status(200).json({
      status: res.statusCode,
      message: "Updated Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const ID = req.params.id;

    const documentsCollection = await getDocs(collection(db, "Documents"));
    const document = documentsCollection.docs.find((u) => u.id === ID);

    if (!document) {
      return res.status(404).json({
        status: res.statusCode,
        message: "Document not found",
      });
    }

    await deleteDoc(doc(db, "Documents", ID));

    return res.status(200).json({
      status: res.statusCode,
      message: "Delete Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: res.statusCode,
      message: error.message,
    });
  }
};