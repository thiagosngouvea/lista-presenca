// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBMLXPOEtaymi0hwWAuTdw43_4foXgFB0",
  authDomain: "lista-presenca-bb7a0.firebaseapp.com",
  projectId: "lista-presenca-bb7a0",
  storageBucket: "lista-presenca-bb7a0.firebasestorage.app",
  messagingSenderId: "269021005383",
  appId: "1:269021005383:web:1ce453fc1a6f678c569362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Function to add a guest to the list
export const addGuest = async (guestData: {
  name: string;
  hasCompanions: boolean;
  companions?: string[];
}) => {
  try {
    const dataToSave: {
      name: string;
      hasCompanions: boolean;
      createdAt: Date;
      companions?: string[];
    } = {
      name: guestData.name,
      hasCompanions: guestData.hasCompanions,
      createdAt: new Date(),
    };

    // Only add companions field if it exists and has values
    if (guestData.hasCompanions && guestData.companions && guestData.companions.length > 0) {
      dataToSave.companions = guestData.companions;
    }

    const docRef = await addDoc(collection(db, "guests"), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error("Error adding guest: ", error);
    throw error;
  }
};

// Function to get all guests
export const getGuests = async () => {
  try {
    const q = query(collection(db, "guests"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting guests: ", error);
    throw error;
  }
};

// Function to add an intention (yes/no response)
export const addIntention = async (intentionData: {
  name: string;
  willAttend: boolean;
}) => {
  try {
    const docRef = await addDoc(collection(db, "intentions"), {
      ...intentionData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding intention: ", error);
    throw error;
  }
};

// Function to get all intentions
export const getIntentions = async () => {
  try {
    const q = query(collection(db, "intentions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting intentions: ", error);
    throw error;
  }
};
