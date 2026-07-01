import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserManagementPage from "./pages/UserManagementPage";
import OnboardingWizard from "./pages/OnboardingWizard";
import BrandStrategyBuilder from "./pages/BrandStrategyBuilder";
import IngestBaseline from "./pages/IngestBaseline";
import PositioningMessaging from "./pages/PositioningMessaging";
import PersonalityStory from "./pages/PersonalityStory";
import IdentityDesigner from "./pages/IdentityDesigner";
import { ExperienceOperations } from "./pages/ExperienceOperations";
import { VisibilityGrowth } from "./pages/VisibilityGrowth";
import { GovernanceAlerts } from "./pages/GovernanceAlerts";
import AuditDetails from "./pages/AuditDetails";
import IssueDetail from "./pages/IssueDetail";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import NotificationsAlerts from "./pages/NotificationsAlerts";
import { BaselineReport } from "./pages/BaselineReport";
import { BrandCanonDashboard } from "@/components/brand-canon/BrandCanonDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/onboarding" element={<OnboardingWizard />} />
                        <Route path="/strategy-builder" element={<BrandStrategyBuilder />} />
                        <Route path="/ingest-baseline" element={<IngestBaseline />} />
                        <Route path="/positioning-messaging" element={<PositioningMessaging />} />
                        <Route path="/personality-story" element={<PersonalityStory />} />
                        <Route path="/identity-designer" element={<IdentityDesigner />} />
                        <Route path="/experience-operations" element={<ExperienceOperations />} />
                        <Route path="/visibility-growth" element={<VisibilityGrowth />} />
                        <Route path="/governance-alerts" element={<GovernanceAlerts />} />
                        <Route path="/audit-details/:category" element={<AuditDetails />} />
                        <Route path="/issue-detail/:issueId" element={<IssueDetail />} />
                        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                        <Route path="/analytics" element={<AnalyticsDashboard />} />
                        <Route path="/notifications-alerts" element={<NotificationsAlerts />} />
                        <Route path="/baseline-report" element={<BaselineReport />} />
                        <Route path="/brand-canon" element={<BrandCanonDashboard />} />
                        <Route path="/user-management" element={<UserManagementPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
