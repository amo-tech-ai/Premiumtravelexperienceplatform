import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Check, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Home,
  AlertCircle,
  Sparkles,
  X,
  Download
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface ExtractedTerm {
  id: string;
  category: 'financial' | 'term' | 'restriction' | 'responsibility' | 'other';
  label: string;
  value: string;
  severity?: 'info' | 'warning' | 'critical';
  explanation?: string;
}

interface LeaseExtractorProps {
  onExtract?: (terms: ExtractedTerm[]) => void;
}

export function LeaseExtractor({ onExtract }: LeaseExtractorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedTerms, setExtractedTerms] = useState<ExtractedTerm[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      handleExtract(selectedFile);
    }
  };

  const handleExtract = (uploadedFile: File) => {
    setIsExtracting(true);
    
    // Simulate AI extraction (in production, this would call an API)
    setTimeout(() => {
      const mockTerms: ExtractedTerm[] = [
        {
          id: '1',
          category: 'financial',
          label: 'Monthly Rent',
          value: '$1,200 USD',
          severity: 'info'
        },
        {
          id: '2',
          category: 'financial',
          label: 'Security Deposit',
          value: '$2,400 USD (2 months)',
          severity: 'warning',
          explanation: 'Non-refundable deposit is higher than typical 1-month standard'
        },
        {
          id: '3',
          category: 'financial',
          label: 'Utilities',
          value: 'Not included - tenant pays all',
          severity: 'info'
        },
        {
          id: '4',
          category: 'term',
          label: 'Lease Duration',
          value: '12 months (1 year)',
          severity: 'info'
        },
        {
          id: '5',
          category: 'term',
          label: 'Start Date',
          value: 'January 1, 2025',
          severity: 'info'
        },
        {
          id: '6',
          category: 'term',
          label: 'Early Termination',
          value: '90 days notice + 2 months penalty',
          severity: 'critical',
          explanation: 'Early termination penalty is high - consider negotiating this term'
        },
        {
          id: '7',
          category: 'restriction',
          label: 'Pets',
          value: 'Not allowed',
          severity: 'warning'
        },
        {
          id: '8',
          category: 'restriction',
          label: 'Subletting',
          value: 'Prohibited without written consent',
          severity: 'warning'
        },
        {
          id: '9',
          category: 'restriction',
          label: 'Modifications',
          value: 'No structural changes allowed',
          severity: 'info'
        },
        {
          id: '10',
          category: 'responsibility',
          label: 'Maintenance',
          value: 'Tenant responsible for minor repairs (<$100)',
          severity: 'info'
        },
        {
          id: '11',
          category: 'responsibility',
          label: 'HOA Fees',
          value: 'Included in rent',
          severity: 'info'
        },
        {
          id: '12',
          category: 'other',
          label: 'Parking',
          value: '1 covered space included',
          severity: 'info'
        }
      ];

      setExtractedTerms(mockTerms);
      setIsExtracting(false);
      setShowResults(true);
      onExtract?.(mockTerms);
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'term': return Calendar;
      case 'restriction': return AlertCircle;
      case 'responsibility': return Home;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'term': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'restriction': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'responsibility': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'border-l-4 border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-4 border-l-amber-500 bg-amber-50';
      default: return 'border-l-4 border-l-slate-300 bg-white';
    }
  };

  // Group terms by category
  const groupedTerms = extractedTerms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = [];
    }
    acc[term.category].push(term);
    return acc;
  }, {} as Record<string, ExtractedTerm[]>);

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      {!showResults && (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              {isExtracting ? (
                <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
              ) : (
                <FileText className="w-6 h-6 text-blue-600" />
              )}
            </div>
            
            {isExtracting ? (
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Extracting Lease Terms...</h4>
                <p className="text-xs text-slate-500 mb-3">
                  AI is analyzing {file?.name}
                </p>
                <div className="w-full max-w-xs mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full animate-pulse w-2/3"></div>
                </div>
              </div>
            ) : file ? (
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">File Selected</h4>
                <p className="text-xs text-slate-500 mb-3">{file.name}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFile(null)}
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Upload Lease Document</h4>
                <p className="text-xs text-slate-500 mb-4">
                  AI will extract key terms, costs, and restrictions
                </p>
                <label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    asChild
                  >
                    <span>
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Choose PDF File
                    </span>
                  </Button>
                </label>
                <p className="text-[10px] text-slate-400 mt-2">
                  Supports PDF format only
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Extracted Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Header */}
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Lease Analysis Complete</h4>
                    <p className="text-xs text-slate-600">{file?.name}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowResults(false);
                    setFile(null);
                    setExtractedTerms([]);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-lg font-semibold text-slate-900">
                    {extractedTerms.filter(t => t.severity === 'critical').length}
                  </p>
                  <p className="text-[10px] text-slate-600">Critical Issues</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-lg font-semibold text-slate-900">
                    {extractedTerms.filter(t => t.severity === 'warning').length}
                  </p>
                  <p className="text-[10px] text-slate-600">Warnings</p>
                </div>
              </div>
            </div>

            {/* Terms by Category */}
            {Object.entries(groupedTerms).map(([category, terms]) => {
              const Icon = getCategoryIcon(category);
              
              return (
                <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className={cn("p-3 border-b border-slate-200", getCategoryColor(category))}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <h5 className="font-semibold capitalize">{category}</h5>
                      <Badge className="bg-white/50 text-xs ml-auto">
                        {terms.length}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    {terms.map((term) => (
                      <div
                        key={term.id}
                        className={cn(
                          "p-2.5 rounded-lg",
                          getSeverityColor(term.severity)
                        )}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-xs font-medium text-slate-900">{term.label}</p>
                          {term.severity === 'critical' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                          )}
                          {term.severity === 'warning' && (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-semibold mb-1">{term.value}</p>
                        {term.explanation && (
                          <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-slate-200">
                            <Sparkles className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-600 leading-relaxed italic">
                              {term.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => console.log('Download report')}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Report
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => console.log('Draft questions')}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Draft Questions
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
