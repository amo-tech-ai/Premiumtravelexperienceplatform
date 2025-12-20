/**
 * API Key Configuration Modal
 * Allows users to input and manage their Gemini API key
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Key, Eye, EyeOff, CheckCircle2, XCircle, ExternalLink, Info } from 'lucide-react';
import { getGeminiClient } from '../../lib/ai/gemini-client';
import { toast } from 'sonner@2.0.3';

interface APIKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const APIKeyModal: React.FC<APIKeyModalProps> = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  // Load existing key on mount
  useEffect(() => {
    const existingKey = localStorage.getItem('gemini_api_key');
    if (existingKey) {
      setCurrentKey(existingKey);
      setIsValid(true);
    }
  }, []);

  // Validate API key
  const validateKey = async (key: string): Promise<boolean> => {
    if (!key || key.length < 20) {
      return false;
    }

    try {
      setIsValidating(true);
      const client = getGeminiClient();
      
      // Store temporarily to test
      const oldKey = localStorage.getItem('gemini_api_key');
      localStorage.setItem('gemini_api_key', key);
      
      // Reinitialize client with new key
      await client.initialize(key);
      
      // Test with a simple request
      const result = await client.chat('Hello', []);
      
      if (result && result.text) {
        setIsValid(true);
        return true;
      }
      
      // Restore old key if test failed
      if (oldKey) {
        localStorage.setItem('gemini_api_key', oldKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
      
      setIsValid(false);
      return false;
    } catch (error) {
      console.error('API key validation error:', error);
      setIsValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    const valid = await validateKey(apiKey.trim());

    if (valid) {
      setCurrentKey(apiKey.trim());
      toast.success('API key saved successfully!');
      onOpenChange(false);
    } else {
      toast.error('Invalid API key. Please check and try again.');
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('gemini_api_key');
    setCurrentKey(null);
    setApiKey('');
    setIsValid(null);
    toast.success('API key removed');
    onOpenChange(false);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first');
      return;
    }

    const valid = await validateKey(apiKey.trim());
    
    if (valid) {
      toast.success('API key is valid!');
    } else {
      toast.error('API key validation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Gemini API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Google Gemini API key to enable AI-powered features like intelligent recommendations, itinerary optimization, and personalized suggestions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Status */}
          {currentKey && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                API key is configured and active. AI features are enabled.
              </AlertDescription>
            </Alert>
          )}

          {!currentKey && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No API key configured. AI features will use mock responses for demonstration.
              </AlertDescription>
            </Alert>
          )}

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">Gemini API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsValid(null);
                }}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Validation Status */}
            {isValid === true && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Valid API key</span>
              </div>
            )}
            {isValid === false && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="w-4 h-4" />
                <span>Invalid API key</span>
              </div>
            )}
          </div>

          {/* How to Get API Key */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium">How to get your API key:</h4>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
              <li>Visit Google AI Studio</li>
              <li>Sign in with your Google account</li>
              <li>Click "Get API Key" in the top right</li>
              <li>Create a new API key or copy an existing one</li>
              <li>Paste it above and click "Save & Test"</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Google AI Studio
            </Button>
          </div>

          {/* Privacy Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your API key is stored locally in your browser and never sent to our servers. 
              It's used only to communicate directly with Google's Gemini API.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {currentKey && (
            <Button
              variant="outline"
              onClick={handleRemove}
              className="sm:mr-auto"
            >
              Remove Key
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleTestKey}
            disabled={!apiKey.trim() || isValidating}
          >
            {isValidating ? 'Testing...' : 'Test Key'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!apiKey.trim() || isValidating}
          >
            {isValidating ? 'Validating...' : 'Save & Test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
