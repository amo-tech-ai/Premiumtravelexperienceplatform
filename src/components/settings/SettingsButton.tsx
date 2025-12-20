/**
 * Settings Button
 * Floating action button to access app settings
 */

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { APIKeyModal } from './APIKeyModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const SettingsButton: React.FC<{ className?: string }> = ({ className }) => {
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAPIKeyModal(true)}
              className={className}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>AI Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <APIKeyModal
        open={showAPIKeyModal}
        onOpenChange={setShowAPIKeyModal}
      />
    </>
  );
};
