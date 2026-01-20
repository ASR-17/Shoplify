// StoreSettingsForm.jsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Store, MapPin, DollarSign, Clock, FileText, Loader2 } from "lucide-react";

const currencies = [
  { value: "₹", label: "₹ - Indian Rupee (INR)" },
  { value: "$", label: "$ - US Dollar (USD)" },
  { value: "€", label: "€ - Euro (EUR)" },
];

const timezones = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "America/New_York", label: "America/New York (EST)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
];

const StoreSettingsForm = ({ settings, onSave, isLoading }) => {
  const [formData, setFormData] = useState(settings);
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Store className="w-5 h-5 text-primary" />
          Store Information
        </CardTitle>
        <CardDescription>
          Configure your business details that appear on invoices and reports
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="flex items-center gap-2">
                <Store className="w-4 h-4 text-muted-foreground" />
                Store Name
              </Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
                placeholder="Enter your store name"
                className="bg-input/50 border-border/50"
                required
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Timezone
              </Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GSTIN */}
            <div className="space-y-2">
              <Label htmlFor="gstin" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                GSTIN (Optional)
              </Label>
              <Input
                id="gstin"
                value={formData.gstin || ""}
                onChange={(e) => handleChange("gstin", e.target.value)}
                placeholder="Enter GSTIN number"
                className="bg-input/50 border-border/50"
              />
            </div>
          </div>

          {/* Store Address */}
          <div className="space-y-2">
            <Label htmlFor="storeAddress" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Store Address
            </Label>
            <Textarea
              id="storeAddress"
              value={formData.storeAddress}
              onChange={(e) => handleChange("storeAddress", e.target.value)}
              placeholder="Enter your complete store address"
              className="bg-input/50 border-border/50 min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="min-w-[120px]">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StoreSettingsForm;
