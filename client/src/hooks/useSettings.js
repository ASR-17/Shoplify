import { useCallback, useEffect, useState } from "react";
import { settingsApi } from "@/services/settingsApi";
import { toast } from "sonner";

export default function useSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [storeSettings, setStoreSettings] = useState(null);
  const [brandingSettings, setBrandingSettings] = useState(null);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await settingsApi.getSettings();
      setStoreSettings(data.store);
      setBrandingSettings(data.branding);
    } catch (err) {
      setError(err);
      console.error("fetchSettings error:", err);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveStoreSettings = async (store) => {
    const res = await settingsApi.updateSettings({ store });
    setStoreSettings(res.store);
    toast.success("Store settings saved");
    return res.store;
  };

  const saveBrandingSettings = async (branding) => {
    const res = await settingsApi.updateSettings({ branding });
    setBrandingSettings(res.branding);
    toast.success("Branding settings saved");
    return res.branding;
  };

  return {
    isLoading,
    error,
    storeSettings,
    brandingSettings,
    refetch: fetchSettings,
    saveStoreSettings,
    saveBrandingSettings,
  };
}
