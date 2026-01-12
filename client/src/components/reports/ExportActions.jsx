import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ExportActions = ({ onExport, onPrint }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(format);
      toast({
        title: "Export Started",
        description: `Your ${format.toUpperCase()} file is being prepared for download.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description:
          "There was an error exporting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    onPrint();
    toast({
      title: "Print Preview",
      description: "Opening print preview...",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => handleExport("csv")}
              className="cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-emerald-500" />
              Export as CSV
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleExport("excel")}
              className="cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
              Export as Excel
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleExport("pdf")}
              className="cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-rose-500" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={handlePrint}
          className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Printer className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
              disabled={isExporting}
            >
              <Download className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => handleExport("csv")}
              className="cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-emerald-500" />
              Export as CSV
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleExport("excel")}
              className="cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
              Export as Excel
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleExport("pdf")}
              className="cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2 text-rose-500" />
              Export as PDF
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handlePrint}
              className="cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ExportActions;
