import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { settingsApi } from "@/services/settingsApi";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [branding, setBranding] = useState(null);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsApi.getSettings(); // should call GET /settings/me
      setStore(data?.store ?? null);
      setBranding(data?.branding ?? null);
    } catch (e) {
      setStore(null);
      setBranding(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      store,
      branding,
      refreshSettings,
      setStore,
      setBranding,
    }),
    [isLoading, store, branding]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};
