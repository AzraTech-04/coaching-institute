import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Batches from "./pages/Batches";
import Faculty from "./pages/Faculty";
import Attendance from "./pages/Attendance";
import Tests from "./pages/Tests";
import Leads from "./pages/Leads";
import PlaceholderPage from "./components/PlaceholderPage";
import Counselling from "./pages/Counselling";
import Admissions from "./pages/Admissions";
import Courses from "./pages/Courses";
import QuestionBank from "./pages/QuestionBank";
import Results from "./pages/Results";
import Assignments from "./pages/Assignments";
import StudyMaterials from "./pages/StudyMaterials";
import Doubts from "./pages/Doubts";
import Analytics from "./pages/Analytics";
import AttendanceAnalytics from "./pages/AttendanceAnalytics";
import BatchAnalytics from "./pages/BatchAnalytics";
import LeadConversion from "./pages/LeadConversion";
import Notifications from "./pages/Notifications";
import WhatsApp from "./pages/WhatsApp";
import SmsEmail from "./pages/SmsEmail";
import Announcements from "./pages/Announcements";
import FeesPayments from "./pages/FeesPayments";
import AIAssistant from "./pages/AIAssistant";
import Branches from "./pages/Branches";
import UsersRoles from "./pages/UsersRoles";
import Integrations from "./pages/Integrations";
import SystemSettings from "./pages/SystemSettings";
import StudentProfiles from "./pages/StudentProfiles";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          {/* Students */}
          <Route path="students" element={<Students />} />
          <Route path="students/profiles" element={<StudentProfiles />} />

          {/* Admissions */}
          <Route path="leads" element={<Leads />} />
          <Route path="admissions/counselling" element={<Counselling />} />
          <Route path="admissions" element={<Admissions />} />

          {/* Academics */}
          <Route path="academics/courses" element={<Courses />} />
          <Route path="batches" element={<Batches />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="tests" element={<Tests />} />
          <Route path="academics/question-bank" element={<QuestionBank />} />
          <Route path="academics/results" element={<Results />} />
          <Route path="academics/assignments" element={<Assignments />} />
          <Route
            path="academics/study-materials"
            element={<StudyMaterials />}
          />
          <Route path="academics/doubts" element={<Doubts />} />

          {/* Analytics */}
          <Route path="analytics/student-performance" element={<Analytics />} />
          <Route
            path="analytics/attendance"
            element={<AttendanceAnalytics />}
          />
          <Route
            path="analytics/lead-conversion"
            element={<LeadConversion />}
          />
          <Route path="analytics/batch" element={<BatchAnalytics />} />

          {/* Communication */}
          <Route
            path="communication/notifications"
            element={<Notifications />}
          />
          <Route path="communication/whatsapp" element={<WhatsApp />} />
          <Route path="communication/sms-email" element={<SmsEmail />} />
          <Route
            path="communication/announcements"
            element={<Announcements />}
          />

          {/* Standalone sections */}
          <Route path="fees" element={<FeesPayments />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="branches" element={<Branches />} />

          {/* Settings */}
          <Route path="settings/users-roles" element={<UsersRoles />} />
          <Route path="settings/integrations" element={<Integrations />} />
          <Route path="settings/system" element={<SystemSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
