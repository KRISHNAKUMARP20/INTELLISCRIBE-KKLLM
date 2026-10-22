import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Feature Views
import { LandingPage } from './features/landing/LandingPage';
import { DashboardView } from './features/dashboard/DashboardView';
import { DocumentsView } from './features/documents/DocumentsView';
import { CoursesView } from './features/courses/CoursesView';
import { LessonViewer } from './features/lessons/LessonViewer';
import { SummaryView } from './features/summaries/SummaryView';
import { FlashcardsView } from './features/flashcards/FlashcardsView';
import { QuizView } from './features/quizzes/QuizView';
import { AiTutorView } from './features/ai-tutor/AiTutorView';
import { RevisionNotesView } from './features/lessons/RevisionNotesView';
import { RevisionPlannerView } from './features/revision-planner/RevisionPlannerView';
import { SettingsView } from './features/settings/SettingsView';
import { AiNotebookView } from './features/notebook/AiNotebookView';
import { Menu, X } from 'lucide-react';

export default function App() {
  const store = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect OAuth redirect callback
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authProvider = params.get('auth_provider');
    const authUser = params.get('auth_user');

    if (authProvider && authUser) {
      try {
        const parsed = JSON.parse(decodeURIComponent(authUser));
        const userName = parsed.name || 'Student';
        const userEmail = parsed.email || '';
        store.login(userName, userEmail, parsed.avatar_url);
        store.setActiveTab('dashboard');
        // Clean URL params cleanly
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to parse OAuth user:', e);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const authError = params.get('auth_error');
    if (authError) {
      console.warn('Authentication status:', authError);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleQuickStartDemo = () => {
    store.setSelectedDocId('doc_dsa');
    store.setSelectedCourseId('crs_dsa');
    store.setSelectedLessonId('l1');
    store.setSelectedQuizId('qz_dsa');
    store.setActiveTab('dashboard');
  };

  // Screen 1: Full-screen Landing Page (shown when user is logged out OR on landing tab)
  if (!store.isLoggedIn || store.activeTab === 'landing') {
    return (
      <LandingPage
        isLoggedIn={store.isLoggedIn}
        setActiveTab={(tab) => {
          store.setActiveTab(tab);
        }}
        onQuickStartDemo={() => {
          handleQuickStartDemo();
        }}
        onLoginSuccess={(name, email, avatarUrl) => {
          store.login(name, email, avatarUrl);
          store.setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070A13] text-slate-100 flex font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Mobile Menu Drawer Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center border border-indigo-400/30"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Navigation matching reference image */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform lg:static lg:transform-none transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={store.activeTab}
          setActiveTab={(tab) => {
            store.setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          setCourseSubTab={store.setCourseSubTab}
          onLogout={store.logout}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar matching Priya S / Student */}
        <Navbar
          user={store.user}
          setUser={store.setUser}
          notifications={store.notifications}
          setIsSearchOpen={store.setIsSearchOpen}
          setActiveTab={store.setActiveTab}
          onLogout={store.logout}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />


        {/* Views Container */}
        <main className="flex-1 overflow-y-auto">
          {/* Screen 2: Dashboard */}
          {store.activeTab === 'dashboard' && (
            <DashboardView
              user={store.user}
              activeCourse={store.activeCourse}
              activeLesson={store.activeLesson}
              activeDoc={store.activeDocument}
              documents={store.documents}
              dueFlashcards={store.dueFlashcards}
              weakTopics={store.weakTopics}
              quizzes={store.quizzes}
              setActiveTab={store.setActiveTab}
              setSelectedDocId={store.setSelectedDocId}
              setSelectedCourseId={store.setSelectedCourseId}
              setSelectedLessonId={store.setSelectedLessonId}
            />
          )}

          {/* Screen 3: Upload Document */}
          {store.activeTab === 'documents' && (
            <DocumentsView
              documents={store.documents}
              selectedDocId={store.selectedDocId}
              setSelectedDocId={store.setSelectedDocId}
              uploadAndProcessDocument={store.uploadAndProcessDocument}
              setActiveTab={store.setActiveTab}
              setSelectedCourseId={store.setSelectedCourseId}
              setQuizzes={store.setQuizzes}
              setSelectedQuizId={store.setSelectedQuizId}
              setDocuments={store.setDocuments}
              userEmail={store.user.email}
            />
          )}

          {/* Screen 4: Generated Course Overview & Sub-tab Router */}
          {store.activeTab === 'courses' && (
            <>
              {store.courseSubTab === 'overview' && (
                <CoursesView
                  courses={store.courses}
                  selectedCourseId={store.selectedCourseId}
                  setSelectedCourseId={store.setSelectedCourseId}
                  setSelectedLessonId={store.setSelectedLessonId}
                  setActiveTab={store.setActiveTab}
                  courseSubTab={store.courseSubTab}
                  setCourseSubTab={store.setCourseSubTab}
                />
              )}

              {store.courseSubTab === 'summary' && (
                <SummaryView
                  summary={store.activeSummary}
                  activeDoc={store.activeDocument}
                  documentTitle={store.activeCourse?.title || store.activeDocument?.title || 'Uploaded Document Summary'}
                  courseSubTab={store.courseSubTab}
                  setCourseSubTab={store.setCourseSubTab}
                  setActiveTab={store.setActiveTab}
                />
              )}

              {store.courseSubTab === 'flashcards' && (
                <FlashcardsView
                  flashcards={store.filteredFlashcards}
                  documentTitle={store.activeCourse?.title || store.activeDocument?.title || 'Course Flashcards'}
                  reviewFlashcard={store.reviewFlashcard}
                  awardXp={store.awardXp}
                  courseSubTab={store.courseSubTab}
                  setCourseSubTab={store.setCourseSubTab}
                  setActiveTab={store.setActiveTab}
                />
              )}

              {store.courseSubTab === 'quizzes' && (
                <QuizView
                  quizzes={store.quizzes}
                  selectedQuizId={store.selectedQuizId}
                  setSelectedQuizId={store.setSelectedQuizId}
                  awardXp={store.awardXp}
                />
              )}

              {store.courseSubTab === 'notes' && (
                <RevisionNotesView
                  course={store.activeCourse}
                  summary={store.activeSummary}
                  documentTitle={store.activeCourse?.title || store.activeDocument?.title}
                  courseSubTab={store.courseSubTab}
                  setCourseSubTab={store.setCourseSubTab}
                  setActiveTab={store.setActiveTab}
                />
              )}

              {store.courseSubTab === 'lessons' && (
                <LessonViewer
                  course={store.activeCourse}
                  lesson={store.activeLesson}
                  setSelectedLessonId={store.setSelectedLessonId}
                  completeLesson={store.completeLesson}
                  setActiveTab={store.setActiveTab}
                  sendTutorMessage={store.sendTutorMessage}
                />
              )}
            </>
          )}

          {/* Screen 5: AI Generated Summary */}
          {store.activeTab === 'summaries' && (
            <SummaryView
              summary={store.activeSummary}
              activeDoc={store.activeDocument}
              documentTitle={store.activeCourse?.title || store.activeDocument?.title || 'Uploaded Document Summary'}
              courseSubTab="summary"
              setCourseSubTab={store.setCourseSubTab}
              setActiveTab={store.setActiveTab}
            />
          )}

          {/* Screen 6: AI Generated Flashcards */}
          {store.activeTab === 'flashcards' && (
            <FlashcardsView
              flashcards={store.filteredFlashcards}
              documentTitle={store.activeCourse?.title || store.activeDocument?.title || 'Course Flashcards'}
              reviewFlashcard={store.reviewFlashcard}
              awardXp={store.awardXp}
              courseSubTab="flashcards"
              setCourseSubTab={store.setCourseSubTab}
              setActiveTab={store.setActiveTab}
            />
          )}

          {/* Screen 7: AI Generated Quiz */}
          {store.activeTab === 'quizzes' && (
            <QuizView
              quizzes={store.quizzes}
              selectedQuizId={store.selectedQuizId}
              setSelectedQuizId={store.setSelectedQuizId}
              awardXp={store.awardXp}
            />
          )}

          {/* Screen 8: AI Tutor */}
          {store.activeTab === 'ai-tutor' && (
            <AiTutorView
              messages={store.tutorMessages}
              sendMessage={store.sendTutorMessage}
              documentTitle={store.activeDocument?.title || store.activeCourse?.title || 'Uploaded Document'}
              socraticMode={store.socraticMode}
              setSocraticMode={store.setSocraticMode}
            />
          )}

          {/* Screen 9: Study Planner & Focus Pomodoro */}
          {store.activeTab === 'revision-planner' && (
            <RevisionPlannerView
              tasks={store.revisionTasks}
              setTasks={store.setRevisionTasks}
              exams={store.exams}
              pomodoroRunning={store.pomodoroRunning}
              setPomodoroRunning={store.setPomodoroRunning}
              pomodoroSeconds={store.pomodoroSeconds}
              setPomodoroSeconds={store.setPomodoroSeconds}
              pomodoroMode={store.pomodoroMode}
              setPomodoroMode={store.setPomodoroMode}
              soundscape={store.soundscape}
              setSoundscape={store.setSoundscape}
              awardXp={store.awardXp}
              setActiveTab={store.setActiveTab}
            />
          )}

          {/* Lesson Viewer if directly selected */}
          {store.activeTab === 'lessons' && (
            <LessonViewer
              course={store.activeCourse}
              lesson={store.activeLesson}
              setSelectedLessonId={store.setSelectedLessonId}
              completeLesson={store.completeLesson}
              setActiveTab={store.setActiveTab}
              sendTutorMessage={store.sendTutorMessage}
            />
          )}

          {/* Settings View */}
          {store.activeTab === 'settings' && (
            <SettingsView
              user={store.user}
              setUser={store.setUser}
              documentCount={store.documents.length}
            />
          )}

          {/* AI Notebook (KKLLM Studio) */}
          {store.activeTab === 'notebook' && <AiNotebookView />}

          {/* Fallback to DashboardView if activeTab is unrecognized to prevent black screen */}
          {![
            'dashboard',
            'documents',
            'courses',
            'summaries',
            'flashcards',
            'quizzes',
            'ai-tutor',
            'revision-planner',
            'lessons',
            'settings',
            'notebook',
          ].includes(store.activeTab) && (
            <DashboardView
              user={store.user}
              activeCourse={store.activeCourse}
              activeLesson={store.activeLesson}
              activeDoc={store.activeDocument}
              documents={store.documents}
              dueFlashcards={store.dueFlashcards}
              weakTopics={store.weakTopics}
              quizzes={store.quizzes}
              setActiveTab={store.setActiveTab}
              setSelectedDocId={store.setSelectedDocId}
              setSelectedCourseId={store.setSelectedCourseId}
              setSelectedLessonId={store.setSelectedLessonId}
            />
          )}
        </main>
      </div>

      {/* Global Search Shortcut Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={store.isSearchOpen}
        onClose={() => store.setIsSearchOpen(false)}
        setActiveTab={store.setActiveTab}
        documents={store.documents}
        courses={store.courses}
        flashcards={store.flashcards}
        quizzes={store.quizzes}
        setSelectedDocId={store.setSelectedDocId}
        setSelectedCourseId={store.setSelectedCourseId}
        setSelectedLessonId={store.setSelectedLessonId}
      />
    </div>
  );
}
