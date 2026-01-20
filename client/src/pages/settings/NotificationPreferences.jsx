// NotificationPreferences.jsx (JSX version)
// NOTE: Optional page. If you already have Notifications tab inside Settings,
// you can skip this entire page + route.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import NotificationPreferencesForm from "@/components/settings/NotificationPreferencesForm";
import { settingsApi } from "@/services/settingsApi";

const NotificationPreferences = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getNotificationPreferences();
        setPreferences(data);
      } catch (error) {
        toast.error("Failed to load notification preferences");
        console.error("Error fetching preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleSave = async (prefs) => {
    try {
      await settingsApi.updateNotificationPreferences(prefs);
      setPreferences(prefs);
      toast.success("Notification preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
      throw error;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="space-y-4">
          <Link to="/settings?tab=notifications">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20">
              <Bell className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Notification Preferences
              </h1>
              <p className="text-muted-foreground">
                Configure how and when you receive alerts
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        {preferences && (
          <NotificationPreferencesForm
            preferences={preferences}
            onSave={handleSave}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationPreferences;
