import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  MapPin, 
  Edit2, 
  Check, 
  X, 
  Share2,
  Bookmark,
  MoreVertical,
  Download,
  Trash2
} from 'lucide-react';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router';
import { cn } from '../../ui/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '../../ui/sheet';
import { toast } from 'sonner@2.0.3';
import { ExportShareMenu } from '../../trip/ExportShareMenu';
import { NotificationPanel } from '../../notifications/NotificationPanel';

interface TripHeaderProps {
  tripId?: string;
  title: string;
  destination: string;
  dates: string;
  travelers: number;
  onTitleChange?: (newTitle: string) => void;
  onInvite?: () => void;
  isSaved?: boolean;
  showSavePrompt?: boolean;
}

export const TripHeader = ({ 
  tripId,
  title: initialTitle, 
  destination,
  dates,
  travelers,
  onTitleChange,
  onInvite,
  isSaved = false,
  showSavePrompt = false
}: TripHeaderProps) => {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle);
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setTitle(tempTitle);
      onTitleChange?.(tempTitle);
      setIsEditingTitle(false);
      toast.success('Trip title updated');
    }
  };

  const handleCancelEdit = () => {
    setTempTitle(title);
    setIsEditingTitle(false);
  };

  const handleInvite = () => {
    setShowInviteSheet(true);
    onInvite?.();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/trip/${tripId || 'demo'}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  const handleDownload = () => {
    toast.info('PDF export coming soon');
  };

  return (
    <>
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="flex-shrink-0 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>

              <div className="min-w-0 flex-1">
                {isEditingTitle ? (
                  /* Editing State */
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1 px-3 py-1.5 text-lg font-semibold text-slate-900 bg-slate-50 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      onClick={handleSaveTitle}
                      className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  /* Display State */
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                        {title}
                      </h1>
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{destination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{dates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Save Prompt (for non-authenticated users) */}
              {showSavePrompt && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:block"
                >
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Sign up to save trip
                  </Button>
                </motion.div>
              )}

              {/* Invite */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleInvite}
                className="border-slate-200 hover:bg-slate-50"
              >
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Invite</span>
              </Button>

              {/* More Menu */}
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="hover:bg-slate-100"
                >
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </Button>

                <AnimatePresence>
                  {showMoreMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMoreMenu(false)}
                      />
                      {/* Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                      >
                        <button
                          onClick={() => {
                            handleCopyLink();
                            setShowMoreMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                        >
                          <Share2 className="w-4 h-4 text-slate-500" />
                          <span>Copy link</span>
                        </button>
                        <button
                          onClick={() => {
                            handleDownload();
                            setShowMoreMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                        >
                          <Download className="w-4 h-4 text-slate-500" />
                          <span>Download PDF</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => {
                            toast.error('Are you sure? This cannot be undone.');
                            setShowMoreMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete trip</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Sheet */}
      <Sheet open={showInviteSheet} onOpenChange={setShowInviteSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Invite Collaborators</SheetTitle>
            <SheetDescription>
              Share this trip with friends and plan together
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Share Link */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Share Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`ilovemedellin.com/trip/${tripId || 'demo'}`}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
                />
                <Button onClick={handleCopyLink} size="sm">
                  Copy
                </Button>
              </div>
            </div>

            {/* Email Invites */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Invite by Email
              </label>
              <input
                type="email"
                placeholder="friend@example.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button className="w-full mt-2" size="sm">
                Send Invite
              </Button>
            </div>

            {/* Collaborators List (if any) */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Collaborators
              </h4>
              <div className="text-sm text-slate-500 italic">
                No collaborators yet
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};