// Settings.jsx (JSX version)
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Store,
  Palette,
  Bell,
  Brush,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import StoreSettingsForm from "@/components/settings/StoreSettingsForm";
import BrandingSettingsForm from "@/components/settings/BrandingSettingsForm";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationPreferencesForm from "@/components/settings/NotificationPreferencesForm";

import { settingsApi } from "@/services/settingsApi";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [storeSettings, setStoreSettings] = useState(null);
  const [brandingSettings, setBrandingSettings] = useState(null);
  const [notificationPrefs, setNotificationPrefs] = useState(null);

  const activeTab = searchParams.get("tab") || "store";

  // ✅ Only for notifications section scroll (optional)
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);

        const [settingsData, notifData] = await Promise.all([
          settingsApi.getSettings(),
          settingsApi.getNotificationPreferences(),
        ]);

        setStoreSettings(settingsData.store);
        setBrandingSettings(settingsData.branding);
        setNotificationPrefs(notifData);
      } catch (error) {
        toast.error("Failed to load settings");
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  const handleSaveStore = async (settings) => {
    try {
      await settingsApi.updateSettings({ store: settings });
      setStoreSettings(settings);
      toast.success("Store settings saved successfully");
    } catch (error) {
      toast.error("Failed to save store settings");
      throw error;
    }
  };

  const handleSaveBranding = async (settings) => {
    try {
      await settingsApi.updateSettings({ branding: settings });
      setBrandingSettings(settings);
      toast.success("Branding settings saved successfully");
    } catch (error) {
      toast.error("Failed to save branding settings");
      throw error;
    }
  };

  const handleSaveNotifications = async (prefs) => {
    try {
      await settingsApi.updateNotificationPreferences(prefs);
      setNotificationPrefs(prefs);
      toast.success("Notification preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save notification preferences");
      throw error;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20">
                <SettingsIcon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your store preferences and configurations
                </p>
              </div>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
          >
            <TabsList className="bg-card/50 border border-border/50 p-1 h-auto flex-wrap">
              <TabsTrigger
                value="store"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Store</span>
              </TabsTrigger>

              <TabsTrigger
                value="branding"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Brush className="w-4 h-4" />
                <span className="hidden sm:inline">Branding</span>
              </TabsTrigger>

              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>

              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            {/* Store */}
            <TabsContent value="store" className="space-y-6 mt-6">
              {storeSettings && (
                <StoreSettingsForm
                  settings={storeSettings}
                  onSave={handleSaveStore}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            {/* Branding */}
            <TabsContent value="branding" className="space-y-6 mt-6">
              {brandingSettings && (
                <BrandingSettingsForm
                  settings={brandingSettings}
                  onSave={handleSaveBranding}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance" className="space-y-6 mt-6">
              <AppearanceSettings />
            </TabsContent>

            {/* ✅ Notifications (UPDATED ONLY THIS PART) */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage alerts, updates, and reminders
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    // already on notifications tab, but keeps URL consistent
                    setSearchParams({ tab: "notifications" });

                    // optional: scroll nicely to form
                    setTimeout(() => {
                      notificationsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 0);
                  }}
                >
                  <SettingsIcon className="h-4 w-4" />
                  Preferences
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>

              <div ref={notificationsRef} />

              {notificationPrefs && (
                <NotificationPreferencesForm
                  preferences={notificationPrefs}
                  onSave={handleSaveNotifications}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
