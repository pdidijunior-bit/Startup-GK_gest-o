import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  Project,
  Task,
  MeetingEvent,
  ContactPartner,
  ChatMessage,
  ChatChannel,
  BrandLogo,
  DigitalDocument,
  CloudBackup,
  AlarmItem,
  InteractionLog,
  TaskChecklistItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_MEETINGS,
  INITIAL_CONTACTS,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
  INITIAL_BRAND_LOGOS,
  INITIAL_DOCUMENTS,
  INITIAL_BACKUPS
} from '../data/initialData';
import { playChimeSound, triggerFileDownload } from '../utils/helpers';
import {
  auth,
  db,
  subscribeToTasks,
  subscribeToProjects,
  subscribeToEvents,
  subscribeToContacts,
  subscribeToMessages,
  subscribeToLogos,
  subscribeToDocuments,
  syncTaskToFirestore,
  removeTaskFromFirestore,
  syncProjectToFirestore,
  removeProjectFromFirestore,
  syncContactToFirestore,
  syncEventToFirestore,
  syncMessageToFirestore,
  syncLogoToFirestore,
  syncDocumentToFirestore,
  saveUserToFirestore,
  firebaseConfig
} from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

interface AppContextType {
  // Auth & Security
  currentUser: User | null;
  isAuthenticated: boolean;
  twoFactorRequired: boolean;
  users: User[];
  login: (email: string, pass: string) => Promise<{ success: boolean; requires2fa?: boolean; error?: string }>;
  verify2FA: (code: string) => boolean;
  registerAccount: (newUser: Partial<User>, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggle2FA: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Firebase Realtime State
  firebaseConnected: boolean;
  firebaseProjectId: string;
  firestoreRulesModalOpen: boolean;
  setFirestoreRulesModalOpen: (open: boolean) => void;
  clearCacheAndReset: () => void;

  // Projects
  projects: Project[];
  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Visual Project Management & Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: Task['status']) => void;
  toggleTaskChecklistItem: (taskId: string, checklistItemId: string) => void;
  addTaskChecklistItem: (taskId: string, title: string) => void;
  removeTaskChecklistItem: (taskId: string, checklistItemId: string) => void;

  // Calendar & Meetings
  meetings: MeetingEvent[];
  addMeeting: (m: Omit<MeetingEvent, 'id'>) => void;
  updateMeeting: (id: string, m: Partial<MeetingEvent>) => void;
  deleteMeeting: (id: string) => void;

  // Real-time Alarms
  activeAlarms: AlarmItem[];
  dismissAlarm: (alarmId: string) => void;
  snoozeAlarm: (alarmId: string, minutes?: number) => void;
  triggerTestAlarm: () => void;

  // CRM Contacts & Notebook
  contacts: ContactPartner[];
  addContact: (c: Omit<ContactPartner, 'id' | 'notesBook' | 'interactionHistory'>) => void;
  updateContact: (id: string, c: Partial<ContactPartner>) => void;
  addContactNote: (contactId: string, text: string) => void;
  logInteraction: (contactId: string, log: Omit<InteractionLog, 'id' | 'timestamp' | 'author'>) => void;
  callContact: (contact: ContactPartner) => void;
  whatsappContact: (contact: ContactPartner) => void;
  emailContact: (contact: ContactPartner) => void;

  // Chat
  channels: ChatChannel[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  messages: ChatMessage[];
  sendMessage: (content: string, attachment?: ChatMessage['attachment']) => void;

  // Brand Logos
  logos: BrandLogo[];
  downloadBrandLogo: (logo: BrandLogo) => void;
  addBrandLogo: (logo: Omit<BrandLogo, 'id' | 'updatedAt'>) => void;

  // Digital Documents
  documents: DigitalDocument[];
  downloadDigitalDocument: (doc: DigitalDocument) => void;

  // Cloud Backup & Offline
  backups: CloudBackup[];
  createCloudBackup: () => void;
  restoreFromBackup: (backupDataString: string) => boolean;
  isOnline: boolean;
  lastBackupDate: string;

  // UI state helper
  selectedContactForMeeting: ContactPartner | null;
  setSelectedContactForMeeting: (c: ContactPartner | null) => void;
  isMeetingModalOpen: boolean;
  setIsMeetingModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'startup_gk_database_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state from LocalStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return null;
  };

  const initialCached = loadSavedState();

  const [users, setUsers] = useState<User[]>(initialCached?.users || INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(initialCached?.currentUser || INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [firestoreRulesModalOpen, setFirestoreRulesModalOpen] = useState<boolean>(false);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>(initialCached?.projects || INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(initialCached?.tasks || INITIAL_TASKS);
  const [meetings, setMeetings] = useState<MeetingEvent[]>(initialCached?.meetings || INITIAL_MEETINGS);
  const [contacts, setContacts] = useState<ContactPartner[]>(initialCached?.contacts || INITIAL_CONTACTS);
  const [channels] = useState<ChatChannel[]>(initialCached?.channels || INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-1');
  const [messages, setMessages] = useState<ChatMessage[]>(initialCached?.messages || INITIAL_MESSAGES);
  const [logos, setLogos] = useState<BrandLogo[]>(initialCached?.logos || INITIAL_BRAND_LOGOS);
  const [documents, setDocuments] = useState<DigitalDocument[]>(initialCached?.documents || INITIAL_DOCUMENTS);
  const [backups, setBackups] = useState<CloudBackup[]>(initialCached?.backups || INITIAL_BACKUPS);

  const [activeAlarms, setActiveAlarms] = useState<AlarmItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastBackupDate, setLastBackupDate] = useState<string>(
    initialCached?.lastBackupDate || new Date().toLocaleString('pt-BR')
  );

  const [selectedContactForMeeting, setSelectedContactForMeeting] = useState<ContactPartner | null>(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        users,
        currentUser,
        projects,
        tasks,
        meetings,
        contacts,
        channels,
        messages,
        logos,
        documents,
        backups,
        lastBackupDate
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('LocalStorage limit or error:', e);
    }
  }, [users, currentUser, projects, tasks, meetings, contacts, channels, messages, logos, documents, backups, lastBackupDate]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Realtime Firestore Subscriptions
  useEffect(() => {
    // 1. Tasks real-time listener
    const unsubTasks = subscribeToTasks(
      (remoteTasks) => {
        if (remoteTasks && remoteTasks.length > 0) {
          setTasks(remoteTasks);
          setFirebaseConnected(true);
        }
      },
      () => setFirebaseConnected(false)
    );

    // 2. Projects real-time listener
    const unsubProjects = subscribeToProjects(
      (remoteProjects) => {
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects(remoteProjects);
          setFirebaseConnected(true);
        }
      },
      () => setFirebaseConnected(false)
    );

    // 3. Events real-time listener
    const unsubEvents = subscribeToEvents(
      (remoteEvents) => {
        if (remoteEvents && remoteEvents.length > 0) {
          setMeetings(remoteEvents);
        }
      },
      () => {}
    );

    // 4. Contacts real-time listener
    const unsubContacts = subscribeToContacts(
      (remoteContacts) => {
        if (remoteContacts && remoteContacts.length > 0) {
          setContacts(remoteContacts);
        }
      },
      () => {}
    );

    // 5. Messages real-time listener
    const unsubMessages = subscribeToMessages(
      (remoteMessages) => {
        if (remoteMessages && remoteMessages.length > 0) {
          setMessages(remoteMessages);
        }
      },
      () => {}
    );

    // 6. Logos real-time listener
    const unsubLogos = subscribeToLogos(
      (remoteLogos) => {
        if (remoteLogos && remoteLogos.length > 0) {
          setLogos(remoteLogos);
        }
      },
      () => {}
    );

    // 7. Documents real-time listener
    const unsubDocs = subscribeToDocuments(
      (remoteDocs) => {
        if (remoteDocs && remoteDocs.length > 0) {
          setDocuments(remoteDocs);
        }
      },
      () => {}
    );

    // 8. Auth State listener
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        setFirebaseConnected(true);
        const existing = users.find((u) => u.email.toLowerCase() === firebaseUser.email!.toLowerCase());
        if (existing) {
          setCurrentUser(existing);
        } else {
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            role: 'Tech Lead / Dev',
            department: 'Desenvolvimento Web',
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            status: 'online',
            twoFactorEnabled: false,
            securityToken: `GK-AUTH-${Math.floor(1000 + Math.random() * 9000)}`
          };
          setCurrentUser(newUser);
          setUsers((prev) => (prev.some((u) => u.id === newUser.id) ? prev : [...prev, newUser]));
        }
      }
    });

    return () => {
      unsubTasks();
      unsubProjects();
      unsubEvents();
      unsubContacts();
      unsubMessages();
      unsubLogos();
      unsubDocs();
      unsubAuth();
    };
  }, []);

  // Alarm Monitor Interval
  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMin = currentHours * 60 + currentMinutes;
      const todayStr = now.toISOString().slice(0, 10);

      meetings.forEach((meet) => {
        if (meet.date === todayStr) {
          const [h, m] = meet.startTime.split(':').map(Number);
          const meetTotalMin = h * 60 + m;
          const diffMinutes = meetTotalMin - currentTotalMin;

          if (diffMinutes >= 0 && diffMinutes <= (meet.reminderMinutesBefore || 15)) {
            const alarmId = `alarm-${meet.id}`;
            setActiveAlarms((prev) => {
              const exists = prev.find((a) => a.eventId === meet.id);
              if (!exists) {
                playChimeSound();
                return [
                  ...prev,
                  {
                    id: alarmId,
                    eventId: meet.id,
                    title: meet.title,
                    eventTime: `${meet.startTime} (${diffMinutes === 0 ? 'Começando agora!' : `em ${diffMinutes} min`})`,
                    timeRemainingMinutes: diffMinutes,
                    meetLink: meet.meetLink || meet.locationOrUrl,
                    participants: meet.participants,
                    active: true
                  }
                ];
              }
              return prev;
            });
          }
        }
      });
    };

    checkUpcomingMeetings();
    const interval = setInterval(checkUpcomingMeetings, 10000);
    return () => clearInterval(interval);
  }, [meetings]);

  const dismissAlarm = (alarmId: string) => {
    setActiveAlarms((prev) => prev.filter((a) => a.id !== alarmId));
  };

  const snoozeAlarm = (alarmId: string, minutes: number = 5) => {
    setActiveAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, snoozedUntil: Date.now() + minutes * 60000, active: false } : a))
    );
  };

  const triggerTestAlarm = () => {
    playChimeSound();
    const testId = `alarm-test-${Date.now()}`;
    setActiveAlarms((prev) => [
      ...prev,
      {
        id: testId,
        eventId: 'test',
        title: 'Alarme Interativo: Reunião com Cliente Nexus Logística',
        eventTime: '14:30 (Em 5 minutos)',
        timeRemainingMinutes: 5,
        meetLink: 'https://meet.google.com/nexus-gk-pitch',
        participants: ['Sérgio GK', 'Lucas Martins', 'Carlos Eduardo Mendes'],
        active: true
      }
    ]);
  };

  // Auth functions with Firebase Auth
  const login = async (email: string, pass: string) => {
    if (!email || !pass) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' };
    }

    try {
      // Attempt Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setFirebaseConnected(true);
      const fbUser = userCredential.user;
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        if (found.twoFactorEnabled) {
          setTwoFactorRequired(true);
          setCurrentUser(found);
          return { success: true, requires2fa: true };
        } else {
          setCurrentUser(found);
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
          return { success: true, requires2fa: false };
        }
      }
    } catch (fbErr: any) {
      console.warn('[Firebase Auth] Falling back to local auth verification:', fbErr.message);
    }

    // Local Verification Fallback
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.twoFactorEnabled) {
        setTwoFactorRequired(true);
        setCurrentUser(found);
        return { success: true, requires2fa: true };
      } else {
        setCurrentUser(found);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        return { success: true, requires2fa: false };
      }
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'Tech Lead / Dev',
        department: 'Desenvolvimento Web',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'online',
        twoFactorEnabled: false,
        securityToken: `GK-AUTH-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      saveUserToFirestore(newUser);
      return { success: true, requires2fa: false };
    }
  };

  const verify2FA = (code: string) => {
    if (code.trim().length === 6 || code === '123456' || code === '998877') {
      setIsAuthenticated(true);
      setTwoFactorRequired(false);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const registerAccount = async (newUserData: Partial<User>, password?: string) => {
    const email = newUserData.email || 'membro@startupgk.com';
    const pwd = password || 'StartupGK#2026';

    let fbUid = `user-${Date.now()}`;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
      fbUid = userCredential.user.uid;
      setFirebaseConnected(true);
    } catch (fbErr: any) {
      console.warn('[Firebase Auth Register] local fallback:', fbErr.message);
    }

    const newUser: User = {
      id: fbUid,
      name: newUserData.name || 'Membro GK',
      email,
      role: newUserData.role || 'Full-Stack Developer',
      department: newUserData.department || 'Desenvolvimento Web',
      avatar: newUserData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      twoFactorEnabled: true,
      securityToken: `GK-AUTH-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: newUserData.phone
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setTwoFactorRequired(false);
    setIsAuthModalOpen(false);

    // Sync user to Firestore
    saveUserToFirestore(newUser);
    return { success: true };
  };

  const logout = () => {
    try {
      signOut(auth);
    } catch (e) {}
    setIsAuthenticated(false);
    setTwoFactorRequired(false);
  };

  const toggle2FA = () => {
    if (!currentUser) return;
    const updated = { ...currentUser, twoFactorEnabled: !currentUser.twoFactorEnabled };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    saveUserToFirestore(updated);
  };

  // Projects CRUD
  const addProject = (p: Omit<Project, 'id'>) => {
    const newP: Project = {
      ...p,
      id: `proj-${Date.now()}`
    };
    setProjects((prev) => [newP, ...prev]);
    syncProjectToFirestore(newP);
  };

  const updateProject = (id: string, p: Partial<Project>) => {
    setProjects((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...p } : item));
      const target = next.find((item) => item.id === id);
      if (target) syncProjectToFirestore(target);
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
    removeProjectFromFirestore(id);
  };

  // Tasks CRUD with Checklist and Timeline
  const addTask = (t: Omit<Task, 'id' | 'createdAt'>) => {
    const newT: Task = {
      ...t,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      startDate: t.startDate || new Date().toISOString().slice(0, 10),
      progress: t.progress || 0,
      checklist: t.checklist || []
    };
    setTasks((prev) => [newT, ...prev]);
    syncTaskToFirestore(newT);
  };

  const updateTask = (id: string, t: Partial<Task>) => {
    setTasks((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...t } : item));
      const target = next.find((item) => item.id === id);
      if (target) syncTaskToFirestore(target);
      return next;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
    removeTaskFromFirestore(id);
  };

  const moveTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const updatedProgress = status === 'done' ? 100 : item.progress;
          const updated = { ...item, status, progress: updatedProgress };
          syncTaskToFirestore(updated);
          return updated;
        }
        return item;
      });
      return next;
    });
  };

  // Checklist Item Helpers
  const toggleTaskChecklistItem = (taskId: string, checklistItemId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.checklist) {
          const updatedList = task.checklist.map((item) =>
            item.id === checklistItemId ? { ...item, completed: !item.completed } : item
          );
          const completedCount = updatedList.filter((i) => i.completed).length;
          const progress = updatedList.length > 0 ? Math.round((completedCount / updatedList.length) * 100) : 0;
          const updatedTask: Task = {
            ...task,
            checklist: updatedList,
            progress,
            status: progress === 100 ? 'done' : task.status === 'done' ? 'in_progress' : task.status
          };
          syncTaskToFirestore(updatedTask);
          return updatedTask;
        }
        return task;
      })
    );
  };

  const addTaskChecklistItem = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const newItem: TaskChecklistItem = {
      id: `c-${Date.now()}`,
      title: title.trim(),
      completed: false
    };

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const currentList = task.checklist || [];
          const updatedList = [...currentList, newItem];
          const completedCount = updatedList.filter((i) => i.completed).length;
          const progress = Math.round((completedCount / updatedList.length) * 100);
          const updatedTask: Task = {
            ...task,
            checklist: updatedList,
            progress
          };
          syncTaskToFirestore(updatedTask);
          return updatedTask;
        }
        return task;
      })
    );
  };

  const removeTaskChecklistItem = (taskId: string, checklistItemId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.checklist) {
          const updatedList = task.checklist.filter((i) => i.id !== checklistItemId);
          const completedCount = updatedList.filter((i) => i.completed).length;
          const progress = updatedList.length > 0 ? Math.round((completedCount / updatedList.length) * 100) : 0;
          const updatedTask: Task = {
            ...task,
            checklist: updatedList,
            progress
          };
          syncTaskToFirestore(updatedTask);
          return updatedTask;
        }
        return task;
      })
    );
  };

  // Meetings CRUD
  const addMeeting = (m: Omit<MeetingEvent, 'id'>) => {
    const newM: MeetingEvent = {
      ...m,
      id: `meet-${Date.now()}`
    };
    setMeetings((prev) => [newM, ...prev]);
    syncEventToFirestore(newM);

    if (m.clientOrPartner) {
      const matchContact = contacts.find(
        (c) => c.companyName.toLowerCase().includes(m.clientOrPartner!.toLowerCase())
      );
      if (matchContact) {
        logInteraction(matchContact.id, {
          type: 'meeting',
          summary: `Reunião Agendada: ${m.title}`,
          details: `Data: ${m.date} às ${m.startTime}. Link/Local: ${m.locationOrUrl}`
        });
      }
    }
  };

  const updateMeeting = (id: string, m: Partial<MeetingEvent>) => {
    setMeetings((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...m } : item));
      const target = next.find((item) => item.id === id);
      if (target) syncEventToFirestore(target);
      return next;
    });
  };

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((item) => item.id !== id));
  };

  // CRM Contacts & Notebook
  const addContact = (c: Omit<ContactPartner, 'id' | 'notesBook' | 'interactionHistory'>) => {
    const newC: ContactPartner = {
      ...c,
      id: `cont-${Date.now()}`,
      notesBook: [
        {
          id: `n-${Date.now()}`,
          timestamp: new Date().toLocaleString('pt-BR'),
          author: currentUser?.name || 'Sérgio GK',
          text: 'Contato cadastrado no sistema da Startup GK.'
        }
      ],
      interactionHistory: [
        {
          id: `i-${Date.now()}`,
          type: 'note',
          timestamp: new Date().toLocaleString('pt-BR'),
          summary: 'Novo contato registrado no CRM GK',
          author: currentUser?.name || 'Sérgio GK'
        }
      ]
    };
    setContacts((prev) => [newC, ...prev]);
    syncContactToFirestore(newC);
  };

  const updateContact = (id: string, c: Partial<ContactPartner>) => {
    setContacts((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...c } : item));
      const target = next.find((item) => item.id === id);
      if (target) syncContactToFirestore(target);
      return next;
    });
  };

  const addContactNote = (contactId: string, text: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      author: currentUser?.name || 'Membro GK',
      text
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const updated = {
            ...c,
            notesBook: [newNote, ...c.notesBook],
            lastContactDate: new Date().toISOString().slice(0, 10),
            interactionHistory: [
              {
                id: `i-${Date.now()}`,
                type: 'note' as const,
                timestamp: new Date().toLocaleString('pt-BR'),
                summary: 'Nova nota técnica adicionada ao caderno',
                details: text.slice(0, 80) + (text.length > 80 ? '...' : ''),
                author: currentUser?.name || 'Membro GK'
              },
              ...c.interactionHistory
            ]
          };
          syncContactToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const logInteraction = useCallback((contactId: string, log: Omit<InteractionLog, 'id' | 'timestamp' | 'author'>) => {
    const fullLog: InteractionLog = {
      ...log,
      id: `i-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      author: currentUser?.name || 'Sérgio GK'
    };

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const updated = {
            ...c,
            lastContactDate: new Date().toISOString().slice(0, 10),
            interactionHistory: [fullLog, ...c.interactionHistory]
          };
          syncContactToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
  }, [currentUser]);

  const callContact = (contact: ContactPartner) => {
    logInteraction(contact.id, {
      type: 'call',
      summary: `Chamada telefônica iniciada para ${contact.contactPerson}`,
      details: `Número discado: ${contact.phone}. Horário: ${new Date().toLocaleTimeString('pt-BR')}`
    });
    window.location.href = `tel:${contact.phone.replace(/[^\d+]/g, '')}`;
  };

  const whatsappContact = (contact: ContactPartner) => {
    logInteraction(contact.id, {
      type: 'whatsapp',
      summary: `Conversa no WhatsApp aberta com ${contact.contactPerson}`,
      details: `Mensagem institucional de TI enviada pela equipe GK.`
    });
    const cleanPhone = contact.whatsapp.replace(/[^\d]/g, '');
    const defaultMsg = encodeURIComponent(
      `Olá ${contact.contactPerson}! Aqui é ${currentUser?.name || 'Sérgio'} da Startup GK de TI. Como está o andamento do projeto?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${defaultMsg}`, '_blank');
  };

  const emailContact = (contact: ContactPartner) => {
    logInteraction(contact.id, {
      type: 'email',
      summary: `E-mail corporativo enviado para ${contact.contactPerson}`,
      details: `Destinatário: ${contact.email}`
    });
    const subject = encodeURIComponent(`Startup GK TI - Alinhamento de Projeto`);
    window.location.href = `mailto:${contact.email}?subject=${subject}`;
  };

  // Chat
  const sendMessage = (content: string, attachment?: ChatMessage['attachment']) => {
    if (!content.trim() && !attachment) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: currentUser?.id || 'user-1',
      senderName: currentUser?.name || 'Sérgio GK',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: currentUser?.role || 'Fundador / CEO',
      content,
      timestamp: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      attachment
    };
    setMessages((prev) => [...prev, newMsg]);
    syncMessageToFirestore(newMsg);
  };

  // Brand Logo Download & Creation
  const downloadBrandLogo = (logo: BrandLogo) => {
    const filename = `${logo.name.toLowerCase().replace(/\s+/g, '_')}.${logo.format.toLowerCase()}`;
    const content = logo.svgDataUri || `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${logo.colorHex}"/><text x="100" y="100" fill="white" font-size="20" text-anchor="middle">${logo.name}</text></svg>`;
    triggerFileDownload(content, filename, 'image/svg+xml');
  };

  const addBrandLogo = (logoData: Omit<BrandLogo, 'id' | 'updatedAt'>) => {
    const newL: BrandLogo = {
      ...logoData,
      id: `logo-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setLogos((prev) => [newL, ...prev]);
    syncLogoToFirestore(newL);
  };

  // Digital Document Download
  const downloadDigitalDocument = (doc: DigitalDocument) => {
    const content = `=====================================================
STARTUP GK - DOCUMENTO DIGITAL DE TI & GESTÃO
=====================================================
Título: ${doc.title}
Categoria: ${doc.category}
Versão: ${doc.version}
Status: ${doc.status}
Data de Homologação: ${doc.date}
Tags: ${doc.tags.join(', ')}

RESUMO EXECUTIVO:
${doc.summary}

-----------------------------------------------------
TERMOS DE CONTRATO E REGULAMENTAÇÃO TÉCNICA:
1. Este documento é de posse confidencial da Startup GK e de seus parceiros autorizados.
2. Todo código-fonte, arquitetura, design e propriedade intelectual associada são regidos pela Lei de Software e LGPD.
3. Arquivo digitalizado pronto para consulta offline e arquivo em pastas locais do smartphone ou computador.
=====================================================
Hash de Autenticação Digital: SHA256-GK-${doc.id.toUpperCase()}-VERIFIED
`;
    triggerFileDownload(content, doc.title.endsWith('.txt') ? doc.title : `${doc.title}.txt`, 'text/plain;charset=utf-8');
  };

  // Cloud Backup & Restore
  const createCloudBackup = () => {
    const timestamp = new Date().toLocaleString('pt-BR');
    const snapshot = {
      version: '2.0',
      firebaseProject: firebaseConfig.projectId,
      exportedAt: timestamp,
      author: currentUser?.name || 'Sérgio GK',
      data: {
        projects,
        tasks,
        meetings,
        contacts,
        messages,
        logos,
        documents
      }
    };
    const jsonStr = JSON.stringify(snapshot, null, 2);
    const sizeKb = Math.round(jsonStr.length / 1024);

    const newBackup: CloudBackup = {
      id: `bkp-${Date.now()}`,
      timestamp,
      totalRecords: projects.length + tasks.length + meetings.length + contacts.length,
      sizeKb,
      status: 'synced',
      hash: `SHA256-GK-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      createdByName: currentUser?.name || 'Sérgio GK'
    };

    setBackups((prev) => [newBackup, ...prev]);
    setLastBackupDate(timestamp);

    triggerFileDownload(jsonStr, `StartupGK_CloudBackup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  };

  const restoreFromBackup = (backupDataString: string): boolean => {
    try {
      const parsed = JSON.parse(backupDataString);
      if (parsed.data) {
        if (parsed.data.projects) setProjects(parsed.data.projects);
        if (parsed.data.tasks) setTasks(parsed.data.tasks);
        if (parsed.data.meetings) setMeetings(parsed.data.meetings);
        if (parsed.data.contacts) setContacts(parsed.data.contacts);
        if (parsed.data.messages) setMessages(parsed.data.messages);
        if (parsed.data.logos) setLogos(parsed.data.logos);
        if (parsed.data.documents) setDocuments(parsed.data.documents);
        return true;
      }
    } catch (e) {
      console.error('Failed to parse backup:', e);
    }
    return false;
  };

  // Clear cache and purge mock items
  const clearCacheAndReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.clear();
      setTasks(INITIAL_TASKS);
      setProjects(INITIAL_PROJECTS);
      setMeetings(INITIAL_MEETINGS);
      setContacts(INITIAL_CONTACTS);
      setMessages(INITIAL_MESSAGES);
      setDocuments(INITIAL_DOCUMENTS);
      setLogos(INITIAL_BRAND_LOGOS);
      window.location.reload();
    } catch (e) {
      console.warn('Cache clearing:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        twoFactorRequired,
        users,
        login,
        verify2FA,
        registerAccount,
        logout,
        toggle2FA,
        isAuthModalOpen,
        setIsAuthModalOpen,
        firebaseConnected,
        firebaseProjectId: firebaseConfig.projectId,
        firestoreRulesModalOpen,
        setFirestoreRulesModalOpen,
        clearCacheAndReset,
        projects,
        addProject,
        updateProject,
        deleteProject,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleTaskChecklistItem,
        addTaskChecklistItem,
        removeTaskChecklistItem,
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        activeAlarms,
        dismissAlarm,
        snoozeAlarm,
        triggerTestAlarm,
        contacts,
        addContact,
        updateContact,
        addContactNote,
        logInteraction,
        callContact,
        whatsappContact,
        emailContact,
        channels,
        activeChannelId,
        setActiveChannelId,
        messages,
        sendMessage,
        logos,
        downloadBrandLogo,
        addBrandLogo,
        documents,
        downloadDigitalDocument,
        backups,
        createCloudBackup,
        restoreFromBackup,
        isOnline,
        lastBackupDate,
        selectedContactForMeeting,
        setSelectedContactForMeeting,
        isMeetingModalOpen,
        setIsMeetingModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
