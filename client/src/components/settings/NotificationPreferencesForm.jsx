// NotificationPreferencesForm.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Package,
  ShoppingCart,
  Receipt,
  CreditCard,
  Wallet,
  AlertTriangle,
  Settings,
  Loader2,
} from "lucide-react";

const notificationTypes = [
  {
    key: "low_stock",
    label: "Low Stock Alerts",
    description: "Get notified when products fall below threshold",
    icon: Package,
    color: "text-amber-500",
  },
  {
    key: "new_sale",
    label: "New Sale",
    description: "Notification when a new sale is recorded",
    icon: ShoppingCart,
    color: "text-green-500",
  },
  {
    key: "invoice_generated",
    label: "Invoice Generated",
    description: "When a new invoice is automatically created",
    icon: Receipt,
    color: "text-blue-500",
  },
  {
    key: "pending_payment",
    label: "Pending Payment",
    description: "Reminders for unpaid invoices",
    icon: CreditCard,
    color: "text-orange-500",
  },
  {
    key: "expense_summary",
    label: "Expense Summary",
    description: "Daily/weekly expense reports",
    icon: Wallet,
    color: "text-purple-500",
  },
  {
    key: "high_expense",
    label: "High Expense Alert",
    description: "When expenses exceed expected limits",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    key: "system",
    label: "System Notifications",
    description: "Updates, maintenance, and system alerts",
    icon: Settings,
    color: "text-muted-foreground",
  },
];

const NotificationPreferencesForm = ({ preferences, onSave, isLoading }) => {
  const [formData, setFormData] = useState(preferences);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleMasterToggle = (enabled) => {
    setFormData((prev) => ({
      ...prev,
      alertsEnabled: enabled,
    }));
  };

  const handleThresholdChange = (value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setFormData((prev) => ({
        ...prev,
        lowStockThreshold: num,
      }));
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Master Toggle */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Control which notifications you receive and how
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-input/30 border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Enable All Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Master switch for all notification types
                </p>
              </div>
            </div>

            <Switch
              checked={formData.alertsEnabled}
              onCheckedChange={handleMasterToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Threshold */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-lg">
            <Package className="w-5 h-5 text-amber-500" />
            Stock Alert Settings
          </CardTitle>
          <CardDescription>
            Configure when to receive low stock warnings
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="threshold" className="min-w-[180px]">
                Default Low Stock Threshold
              </Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => handleThresholdChange(e.target.value)}
                className="w-24 bg-input/50 border-border/50"
                disabled={!formData.alertsEnabled}
              />
              <span className="text-sm text-muted-foreground">units</span>
            </div>

            <p className="text-xs text-muted-foreground">
              You'll receive an alert when product stock falls below this number
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual Notification Types */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Notification Types
          </CardTitle>
          <CardDescription>
            Enable or disable specific notification categories
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              const enabled =
                formData.alertsEnabled && formData.notifications[type.key];

              return (
                <div
                  key={type.key}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    enabled
                      ? "bg-input/30 border-border/50"
                      : "bg-muted/20 border-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${
                        enabled ? "bg-input" : "bg-muted/30"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          enabled ? type.color : "text-muted-foreground/50"
                        }`}
                      />
                    </div>

                    <div>
                      <p
                        className={`font-medium ${
                          enabled ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {type.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={formData.notifications[type.key]}
                    onCheckedChange={() => handleToggle(type.key)}
                    disabled={!formData.alertsEnabled}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="min-w-[120px]">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </form>
  );
};

export default NotificationPreferencesForm;
