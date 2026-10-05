import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  return (
    <div className={`bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-lg ${compact ? 'p-3 text-xs' : 'p-4 text-sm'} shadow-sm flex items-start gap-3 my-4`}>
      <AlertTriangle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-amber-600 shrink-0 mt-0.5`} />
      <div>
        <span className="font-semibold">Important Safety Disclaimer:</span> This tool provides hospital discovery and routing assistance. It is not a diagnostic system and does not replace medical professionals. In a life-threatening emergency, call local emergency services immediately.
      </div>
    </div>
  );
}
