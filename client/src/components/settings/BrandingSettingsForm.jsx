// BrandingSettingsForm.jsx
import { useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Palette, Image, FileText, Upload, X, Loader2 } from "lucide-react";
import { uploadLogo } from "@/services/upload.service";


const BrandingSettingsForm = ({ settings, onSave, isLoading }) => {
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  // preview can be blob or real url
  const [previewUrl, setPreviewUrl] = useState(settings?.logoUrl || "");
  const fileInputRef = useRef(null);

  // ✅ IMPORTANT: when settings comes from API later, sync the form
  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setPreviewUrl(settings?.logoUrl || "");
    }
  }, [settings]);

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

  const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // local preview ONLY
  const preview = URL.createObjectURL(file);
  setPreviewUrl(preview);

  try {
    const data = await uploadLogo(file); // { success, url }
    if (!data?.url) throw new Error("Upload did not return url");

    // ✅ store real cloudinary URL
    setFormData((prev) => ({ ...prev, logoUrl: data.url }));
  } catch (err) {
    console.error("Logo upload failed:", err);
    // optional: reset preview if upload fails
    // setPreviewUrl("");
  }
};



  const handleRemoveLogo = () => {
    setPreviewUrl("");
    // ✅ if user had a real saved logoUrl, this removes it
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          <Palette className="w-5 h-5 text-primary" />
          Branding & Customization
        </CardTitle>
        <CardDescription>
          Customize your brand identity for invoices and documents
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4 text-muted-foreground" />
              Shop Logo
            </Label>

            <div className="flex items-start gap-6">
              {/* Logo Preview */}
              <div className="relative">
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-border/50 bg-input/30 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Shop logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Image className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                      <span className="text-xs text-muted-foreground">
                        No logo
                      </span>
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>

                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 200x200px. PNG or JPG
                  format.
                </p>

                {/* ✅ Small clarity so you don't expect it to persist */}
                <p className="text-xs text-muted-foreground">
                  Note: Logo preview works now, but the logo will save
                  permanently only after Cloudinary/backend upload is added.
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Footer Text */}
          <div className="space-y-2">
            <Label
              htmlFor="invoiceFooterText"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              Invoice Footer Text
            </Label>
            <Input
              id="invoiceFooterText"
              value={formData?.invoiceFooterText || ""}
              onChange={(e) =>
                handleChange("invoiceFooterText", e.target.value)
              }
              placeholder="e.g., Thank you for your business!"
              className="bg-input/50 border-border/50"
            />
            <p className="text-xs text-muted-foreground">
              This text appears at the bottom of every invoice
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <Label
              htmlFor="termsAndConditions"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              Terms & Conditions
            </Label>
            <Textarea
              id="termsAndConditions"
              value={formData?.termsAndConditions || ""}
              onChange={(e) =>
                handleChange("termsAndConditions", e.target.value)
              }
              placeholder="Enter your terms and conditions for invoices..."
              className="bg-input/50 border-border/50 min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              These terms will be displayed on your invoices
            </p>
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

export default BrandingSettingsForm;
