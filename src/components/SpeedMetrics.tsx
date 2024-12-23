import React from "react";
import { Timer } from "lucide-react";

interface SpeedMetricsProps {
  lastResponseTime: number | null;
  averageResponseTime: number | null;
}

export const SpeedMetrics = ({ lastResponseTime, averageResponseTime }: SpeedMetricsProps) => {
  return (
    <div className="flex items-center gap-4 bg-black/30 p-3 rounded-lg border border-racing-blue/30">
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4 text-racing-yellow" />
        <span className="text-sm text-white">Last:</span>
        <span className="font-mono text-racing-yellow">
          {lastResponseTime ? `${lastResponseTime}ms` : "-"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-white">Avg:</span>
        <span className="font-mono text-racing-yellow">
          {averageResponseTime ? `${averageResponseTime}ms` : "-"}
        </span>
      </div>
    </div>
  );
};