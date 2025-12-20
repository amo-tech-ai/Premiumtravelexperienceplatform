/**
 * Export & Share Menu
 * Trip export and sharing functionality
 */

import React, { useState } from 'react';
import {
  Download,
  Share2,
  Link2,
  Calendar,
  FileJson,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  Users,
  Lock,
  Globe,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  downloadICalendar,
  downloadJSON,
  downloadCSV,
  copyTripLink,
  shareTripNative,
  printTrip,
} from '../../lib/services/export';
import { getCollaborationService, SharePermission } from '../../lib/services/collaboration';
import { useTripDetails } from '../trip-details/TripDetailsContext';

interface ExportShareMenuProps {
  tripId: string;
  tripName: string;
  tripDates: { start: Date; end: Date };
}

export function ExportShareMenu({ tripId, tripName, tripDates }: ExportShareMenuProps) {
  const { days } = useTripDetails();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareLinks, setShareLinks] = useState(
    getCollaborationService().getShareLinks(tripId)
  );

  const handleDownloadCalendar = () => {
    try {
      downloadICalendar(tripName, tripDates, days);
      toast.success('Calendar exported successfully');
    } catch (error) {
      toast.error('Failed to export calendar');
      console.error(error);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const tripData = {
        id: tripId,
        name: tripName,
        dates: tripDates,
        days,
        exportedAt: new Date().toISOString(),
      };
      downloadJSON(tripData, tripName);
      toast.success('Trip exported as JSON');
    } catch (error) {
      toast.error('Failed to export JSON');
      console.error(error);
    }
  };

  const handleDownloadCSV = () => {
    try {
      downloadCSV(days, tripName);
      toast.success('Itinerary exported as CSV');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error(error);
    }
  };

  const handlePrint = () => {
    try {
      printTrip();
      toast.success('Print dialog opened');
    } catch (error) {
      toast.error('Failed to print');
      console.error(error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyTripLink(tripId);
      setLinkCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      await shareTripNative(tripName, tripId);
      toast.success('Shared successfully');
    } catch (error: any) {
      if (error.message === 'FALLBACK_COPY') {
        toast.success('Link copied to clipboard');
      } else {
        toast.error('Failed to share');
        console.error(error);
      }
    }
  };

  const handleCreateShareLink = (permission: SharePermission) => {
    try {
      const link = getCollaborationService().createShareLink(tripId, permission);
      setShareLinks(getCollaborationService().getShareLinks(tripId));
      
      // Copy to clipboard
      navigator.clipboard.writeText(link.url);
      toast.success(`${permission} link created and copied`);
    } catch (error) {
      toast.error('Failed to create share link');
      console.error(error);
    }
  };

  const handleRevokeLink = (linkId: string) => {
    try {
      getCollaborationService().revokeShareLink(tripId, linkId);
      setShareLinks(getCollaborationService().getShareLinks(tripId));
      toast.success('Share link revoked');
    } catch (error) {
      toast.error('Failed to revoke link');
      console.error(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share & Export
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Share Trip</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Trip
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyLink}>
            {linkCopied ? (
              <Check className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <Link2 className="w-4 h-4 mr-2" />
            )}
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
            <Users className="w-4 h-4 mr-2" />
            Manage Sharing
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Export</DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={handleDownloadCalendar}>
                <Calendar className="w-4 h-4 mr-2" />
                Calendar (.ics)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadJSON}>
                <FileJson className="w-4 h-4 mr-2" />
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadCSV}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Management Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Trip</DialogTitle>
            <DialogDescription>
              Create shareable links with different permission levels
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Quick Share Links */}
            <div>
              <Label className="mb-3 block">Create Share Link</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateShareLink('view')}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-xs">View Only</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateShareLink('edit')}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Can Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCreateShareLink('admin')}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                >
                  <Lock className="w-5 h-5" />
                  <span className="text-xs">Admin</span>
                </Button>
              </div>
            </div>

            {/* Active Share Links */}
            {shareLinks.length > 0 && (
              <div>
                <Label className="mb-3 block">Active Share Links</Label>
                <div className="space-y-2">
                  {shareLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {link.permission}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {link.accessCount} views
                          </span>
                        </div>
                        <Input
                          value={link.url}
                          readOnly
                          className="text-xs h-8"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        {link.expiresAt && (
                          <p className="text-xs text-slate-500 mt-1">
                            Expires {new Date(link.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(link.url);
                            toast.success('Link copied');
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRevokeLink(link.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Lock className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Share links allow others to view or edit your trip
                without requiring an account. You can revoke access at any time.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExportShareMenu;
