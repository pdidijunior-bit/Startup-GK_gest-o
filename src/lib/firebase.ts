import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  FirestoreError
} from 'firebase/firestore';
import {
  Task,
  Project,
  MeetingEvent,
  ContactPartner,
  ChatMessage,
  BrandLogo,
  DigitalDocument,
  User
} from '../types';

// Web app's Firebase configuration strictly tailored for Startup GK
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCR0ZwP7YI1aEUl2szemK4u-UDnnr7BK7E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "startup-gk-93be2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "startup-gk-93be2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "startup-gk-93be2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "760414234003",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:760414234003:web:626becfedea575e9acf466"
};

// Initialize Firebase safely without duplicate initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Realtime connection status flag
let isConnectedToFirestore = false;
let hasPermissionError = false;

export const getIsConnected = () => isConnectedToFirestore;
export const getHasPermissionError = () => hasPermissionError;

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  EVENTS: 'events',
  CONTACTS: 'contacts',
  CHAT_MESSAGES: 'chatMessages',
  CHAT_CHANNELS: 'chatChannels',
  LOGOS: 'logos',
  DOCUMENTS: 'documents',
  BACKUPS: 'backups'
} as const;

// Safe Firestore Error Logger
function handleSnapshotError(collectionName: string, error: FirestoreError, onError?: (err: Error) => void) {
  if (error.code === 'permission-denied') {
    hasPermissionError = true;
    console.info(`[Firestore] Acesso à coleção '${collectionName}' aguardando autenticação ou publicação de regras.`);
  } else {
    console.warn(`[Firestore] Erro na coleção '${collectionName}':`, error.message);
  }
  if (onError) {
    onError(error);
  }
}

// Realtime Listeners with comprehensive error handlers on all snapshot subscriptions
export function subscribeToTasks(onUpdate: (tasks: Task[]) => void, onError?: (err: Error) => void) {
  try {
    const q = collection(db, COLLECTIONS.TASKS);
    return onSnapshot(
      q,
      (snapshot) => {
        isConnectedToFirestore = true;
        hasPermissionError = false;
        const tasksList: Task[] = [];
        snapshot.forEach((docSnap) => {
          tasksList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Task, 'id'>) });
        });
        onUpdate(tasksList);
      },
      (error) => handleSnapshotError(COLLECTIONS.TASKS, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

export function subscribeToProjects(onUpdate: (projects: Project[]) => void, onError?: (err: Error) => void) {
  try {
    const q = collection(db, COLLECTIONS.PROJECTS);
    return onSnapshot(
      q,
      (snapshot) => {
        isConnectedToFirestore = true;
        hasPermissionError = false;
        const projectsList: Project[] = [];
        snapshot.forEach((docSnap) => {
          projectsList.push({ id: docSnap.id, ...(docSnap.data() as Omit<Project, 'id'>) });
        });
        onUpdate(projectsList);
      },
      (error) => handleSnapshotError(COLLECTIONS.PROJECTS, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

export function subscribeToEvents(onUpdate: (events: MeetingEvent[]) => void, onError?: (err: Error) => void) {
  try {
    const q = collection(db, COLLECTIONS.EVENTS);
    return onSnapshot(
      q,
      (snapshot) => {
        const list: MeetingEvent[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<MeetingEvent, 'id'>) });
        });
        onUpdate(list);
      },
      (error) => handleSnapshotError(COLLECTIONS.EVENTS, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

export function subscribeToContacts(onUpdate: (contacts: ContactPartner[]) => void, onError?: (err: Error) => void) {
  try {
    const q = collection(db, COLLECTIONS.CONTACTS);
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ContactPartner[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ContactPartner, 'id'>) });
        });
        onUpdate(list);
      },
      (error) => handleSnapshotError(COLLECTIONS.CONTACTS, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

export function subscribeToMessages(onUpdate: (messages: ChatMessage[]) => void, onError?: (err: Error) => void) {
  try {
    const q = query(collection(db, COLLECTIONS.CHAT_MESSAGES), orderBy('timestamp', 'asc'), limit(150));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<ChatMessage, 'id'>) });
        });
        onUpdate(list);
      },
      (error) => handleSnapshotError(COLLECTIONS.CHAT_MESSAGES, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

export function subscribeToLogos(onUpdate: (logos: BrandLogo[]) => void, onError?: (err: Error) => void) {
  try {
    const q = collection(db, COLLECTIONS.LOGOS);
    return onSnapshot(
      q,
      (snapshot) => {
        const list: BrandLogo[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<BrandLogo, 'id'>) });
        });
        onUpdate(list);
      },
      (error) => handleSnapshotError(COLLECTIONS.LOGOS, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

export function subscribeToDocuments(onUpdate: (docs: DigitalDocument[]) => void, onError?: (err: Error) => void) {
  try {
    const q = collection(db, COLLECTIONS.DOCUMENTS);
    return onSnapshot(
      q,
      (snapshot) => {
        const list: DigitalDocument[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<DigitalDocument, 'id'>) });
        });
        onUpdate(list);
      },
      (error) => handleSnapshotError(COLLECTIONS.DOCUMENTS, error, onError)
    );
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

// Write Helpers (Direct to Firestore with error resilience)
export async function syncTaskToFirestore(task: Task): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TASKS, task.id);
    await setDoc(docRef, {
      ...task,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save task:', err.message);
  }
}

export async function removeTaskFromFirestore(taskId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.TASKS, taskId);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.warn('[Firestore] Failed to delete task:', err.message);
  }
}

export async function syncProjectToFirestore(project: Project): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, project.id);
    await setDoc(docRef, {
      ...project,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save project:', err.message);
  }
}

export async function removeProjectFromFirestore(projectId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.warn('[Firestore] Failed to delete project:', err.message);
  }
}

export async function syncContactToFirestore(contact: ContactPartner): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CONTACTS, contact.id);
    await setDoc(docRef, contact, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save contact:', err.message);
  }
}

export async function syncEventToFirestore(event: MeetingEvent): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.EVENTS, event.id);
    await setDoc(docRef, event, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save event:', err.message);
  }
}

export async function syncMessageToFirestore(message: ChatMessage): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CHAT_MESSAGES, message.id);
    await setDoc(docRef, message, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to send chat message:', err.message);
  }
}

export async function syncLogoToFirestore(logo: BrandLogo): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.LOGOS, logo.id);
    await setDoc(docRef, logo, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save logo:', err.message);
  }
}

export async function syncDocumentToFirestore(document: DigitalDocument): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, document.id);
    await setDoc(docRef, document, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save document:', err.message);
  }
}

export async function saveUserToFirestore(user: User): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, user.id);
    await setDoc(docRef, user, { merge: true });
  } catch (err: any) {
    console.warn('[Firestore] Failed to save user profile:', err.message);
  }
}
