import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  History, 
  RefreshCw, 
  Download, 
  Upload, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Archive,
  Clock
} from "lucide-react";

interface BackupVersion {
  id: string;
  version: string;
  timestamp: string;
  creator: string;
  description: string;
  components: {
    brands: number;
    colors: number;
    messaging: number;
    legal: number;
    boilerplates: number;
  };
  status: "active" | "archived" | "corrupted";
  size: string;
  checksum: string;
}

interface BrandCanonRestoreProps {
  currentVersion: string;
  onRestore: (version: BackupVersion) => void;
  onCreateBackup: (description: string) => void;
}

const mockBackups: BackupVersion[] = [
  {
    id: "v1.2.5",
    version: "1.2.5",
    timestamp: "2024-01-15T10:30:00Z",
    creator: "John Smith",
    description: "Pre-rebrand backup with complete brand guidelines",
    components: { brands: 15, colors: 48, messaging: 12, legal: 8, boilerplates: 25 },
    status: "active",
    size: "2.4 MB",
    checksum: "a1b2c3d4e5f6"
  },
  {
    id: "v1.2.4",
    version: "1.2.4", 
    timestamp: "2024-01-10T14:15:00Z",
    creator: "Sarah Johnson",
    description: "Monthly backup - all color tokens updated",
    components: { brands: 15, colors: 45, messaging: 12, legal: 8, boilerplates: 23 },
    status: "active",
    size: "2.3 MB",
    checksum: "b2c3d4e5f6a1"
  },
  {
    id: "v1.2.3",
    version: "1.2.3",
    timestamp: "2024-01-05T09:45:00Z", 
    creator: "Mike Wilson",
    description: "Emergency backup before legal compliance updates",
    components: { brands: 14, colors: 45, messaging: 11, legal: 6, boilerplates: 23 },
    status: "archived",
    size: "2.1 MB",
    checksum: "c3d4e5f6a1b2"
  },
  {
    id: "v1.2.2",
    version: "1.2.2",
    timestamp: "2023-12-20T16:20:00Z",
    creator: "Emily Davis",
    description: "Year-end backup with audit trail",
    components: { brands: 14, colors: 42, messaging: 11, legal: 6, boilerplates: 22 },
    status: "archived", 
    size: "2.0 MB",
    checksum: "d4e5f6a1b2c3"
  },
  {
    id: "v1.2.1",
    version: "1.2.1",
    timestamp: "2023-12-15T11:10:00Z",
    creator: "Alex Brown",
    description: "Corrupted during server migration",
    components: { brands: 0, colors: 0, messaging: 0, legal: 0, boilerplates: 0 },
    status: "corrupted",
    size: "0 KB",
    checksum: "corrupted"
  }
];

export const BrandCanonRestore = ({ currentVersion, onRestore, onCreateBackup }: BrandCanonRestoreProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBackup, setSelectedBackup] = useState<BackupVersion | null>(null);
  const [isCreateBackupOpen, setIsCreateBackupOpen] = useState(false);
  const [newBackupDescription, setNewBackupDescription] = useState("");
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const filteredBackups = mockBackups.filter(backup => {
    if (statusFilter !== "all" && backup.status !== statusFilter) return false;
    if (searchQuery && !backup.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !backup.creator.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleRestore = async (backup: BackupVersion) => {
    if (backup.status === "corrupted") {
      toast({
        title: "Cannot Restore",
        description: "This backup is corrupted and cannot be restored.",
        variant: "destructive"
      });
      return;
    }

    onRestore(backup);
    setIsRestoreConfirmOpen(false);
    setSelectedBackup(null);
    
    toast({
      title: "Restore Initiated",
      description: `Restoring Brand Canon to version ${backup.version}. This may take a few moments.`,
    });
  };

  const handleCreateBackup = () => {
    if (!newBackupDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description for the backup.",
        variant: "destructive"
      });
      return;
    }

    onCreateBackup(newBackupDescription);
    setNewBackupDescription("");
    setIsCreateBackupOpen(false);
    
    toast({
      title: "Backup Created", 
      description: "A new backup of the Brand Canon has been created successfully.",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Backup Uploaded",
        description: `Backup file "${file.name}" has been uploaded and verified.`,
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "archived": return "secondary";
      case "corrupted": return "destructive";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "archived": return <Archive className="w-4 h-4" />;
      case "corrupted": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Brand Canon Backup & Restore
              </CardTitle>
              <CardDescription>
                Manage Brand Canon versions and restore from backups
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateBackupOpen} onOpenChange={setIsCreateBackupOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    Create Backup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Backup</DialogTitle>
                    <DialogDescription>
                      Create a backup of the current Brand Canon state
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Backup Description</Label>
                      <Textarea
                        id="description"
                        value={newBackupDescription}
                        onChange={(e) => setNewBackupDescription(e.target.value)}
                        placeholder="Describe the purpose of this backup..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateBackupOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBackup}>Create Backup</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept=".json,.bak"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="backup-upload"
                />
                <label htmlFor="backup-upload" className="cursor-pointer">
                  {isUploading ? "Uploading..." : "Upload Backup"}
                </label>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border border-primary rounded-lg bg-primary/5">
              <div className="text-xl font-bold text-primary">{currentVersion}</div>
              <div className="text-sm text-muted-foreground">Current Version</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{mockBackups.filter(b => b.status === "active").length}</div>
              <div className="text-sm text-muted-foreground">Active Backups</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{mockBackups.length}</div>
              <div className="text-sm text-muted-foreground">Total Backups</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Input
              placeholder="Search backups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="corrupted">Corrupted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Backup List */}
      <div className="space-y-3">
        {filteredBackups.map((backup) => (
          <Card 
            key={backup.id} 
            className={`transition-all ${backup.status === "corrupted" ? "opacity-60" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(backup.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Version {backup.version}</span>
                        <Badge variant={getStatusColor(backup.status)}>
                          {backup.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(backup.timestamp), "MMM d, yyyy 'at' h:mm a")} • by {backup.creator}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm mb-2 truncate">{backup.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Brands: {backup.components.brands}</span>
                      <span>Colors: {backup.components.colors}</span>
                      <span>Messaging: {backup.components.messaging}</span>
                      <span>Size: {backup.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  {backup.status !== "corrupted" && (
                    <AlertDialog open={isRestoreConfirmOpen && selectedBackup?.id === backup.id} onOpenChange={setIsRestoreConfirmOpen}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedBackup(backup)}
                          className="flex items-center gap-2"
                          disabled={backup.version === currentVersion}
                        >
                          <RotateCcw className="w-4 h-4" />
                          {backup.version === currentVersion ? "Current" : "Restore"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Restore</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to restore to version {backup.version}? This will replace the current Brand Canon configuration and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setSelectedBackup(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRestore(backup)}>
                            Restore Version
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBackups.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No backups found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters or search query."
                  : "Create your first backup to enable version control."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};