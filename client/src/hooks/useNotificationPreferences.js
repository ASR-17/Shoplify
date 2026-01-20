import { useCallback, useEffect, useState } from "react";
import { settingsApi } from "@/services/settingsApi";
import { toast } from "sonner";

export default function useNotificationPreferences() {
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [error, setError] = useState(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await settingsApi.getNotificationPreferences();
      // backend returns { success:true, ...prefs } so remove success
      const { success, ...prefs } = data;
      setPreferences(prefs);
    } catch (err) {
      setError(err);
      console.error("fetchPreferences error:", err);
      toast.error("Failed to load notification preferences");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const savePreferences = async (prefs) => {
    const data = await settingsApi.updateNotificationPreferences(prefs);
    const { success, ...updated } = data;
    setPreferences(updated);
    toast.success("Notification preferences saved");
    return updated;
  };

  return {
    isLoading,
    error,
    preferences,
    refetch: fetchPreferences,
    savePreferences,
  };
}
