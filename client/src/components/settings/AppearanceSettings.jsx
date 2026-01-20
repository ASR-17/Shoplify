// AppearanceSettings.jsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Sun, Moon, Monitor, Check } from "lucide-react";
import { toast } from "sonner";

const themes = [
  {
    value: "light",
    label: "Light",
    icon: <Sun className="w-6 h-6" />,
    description: "Classic light theme for daytime use",
  },
  {
    value: "dark",
    label: "Dark",
    icon: <Moon className="w-6 h-6" />,
    description: "Easy on the eyes for night owls",
  },
  {
    value: "system",
    label: "System",
    icon: <Monitor className="w-6 h-6" />,
    description: "Automatically match your device settings",
  },
];

const AppearanceSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setSelectedTheme(saved);
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;

    if (theme === "system") {
      const systemDark = window
        .matchMedia("(prefers-color-scheme: dark)")
        .matches;
      root.classList.toggle("dark", systemDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    toast.success(`Theme changed to ${theme}`);
  };

  // keep in sync if theme = system and OS theme changes
  useEffect(() => {
    if (selectedTheme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mql.addEventListener?.("change", onChange);

    return () => mql.removeEventListener?.("change", onChange);
  }, [selectedTheme]);

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="w-5 h-5 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base">Theme</Label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.value}
                type="button"
                onClick={() => handleThemeChange(theme.value)}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 hover:border-primary/50 ${
                  selectedTheme === theme.value
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-input/30"
                }`}
              >
                {selectedTheme === theme.value && (
                  <div className="absolute top-3 right-3">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl ${
                    selectedTheme === theme.value
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {theme.icon}
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground">{theme.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {theme.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="pt-4 border-t border-border/50">
          <Label className="text-base mb-4 block">Preview</Label>

          <div className="p-4 rounded-xl bg-input/30 border border-border/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Sample Card Title</p>
                <p className="text-sm text-muted-foreground">
                  This is how your content will appear
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm">Primary Button</Button>
              <Button size="sm" variant="outline">
                Secondary
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
