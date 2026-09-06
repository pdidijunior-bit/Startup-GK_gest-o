import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { AlarmBanner } from './components/AlarmBanner';
import { AuthModal } from './components/AuthModal';
import { MeetingModal } from './components/MeetingModal';
import { FirestoreRulesModal } from './components/modals/FirestoreRulesModal';

import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { TasksView } from './components/views/TasksView';
import { CalendarView } from './components/views/CalendarView';
import { ChatView } from './components/views/ChatView';
import { ContactsCrmView } from './components/views/ContactsCrmView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { LogosGalleryView } from './components/views/LogosGalleryView';
import { DocumentsView } from './components/views/DocumentsView';
import { BackupSecurityView } from './components/views/BackupSecurityView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const { isAuthModalOpen, isMeetingModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Fixed Navbar */}
      <Navbar
        onToggleSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex pt-16">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobileSidebar}
          setIsOpenMobile={setIsOpenMobileSidebar}
        />

        {/* View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-5 overflow-x-hidden">
          {/* Real-time Meeting Alarm Banner */}
          <AlarmBanner />

          {/* Active View Switcher */}
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'contacts' && <ContactsCrmView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'logos' && <LogosGalleryView />}
          {activeTab === 'documents' && <DocumentsView />}
          {activeTab === 'backup' && <BackupSecurityView />}
        </main>
      </div>

      {/* Global Modals */}
      {isAuthModalOpen && <AuthModal />}
      {isMeetingModalOpen && <MeetingModal />}
      <FirestoreRulesModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
