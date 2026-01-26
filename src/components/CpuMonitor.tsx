import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "./Chart";

interface CpuInfo {
  overall: number;
  per_core: number[];
}

interface DataPoint {
  time: number;
  value: number;
}

interface CpuMonitorProps {
  cpuInfo: CpuInfo | null;
  history: DataPoint[];
}

export function CpuMonitor({ cpuInfo, history }: CpuMonitorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          CPU Usage
        </CardTitle>
        <span className="text-3xl font-bold">
          {cpuInfo ? `${cpuInfo.overall.toFixed(1)}%` : "--"}
        </span>
      </CardHeader>

      <CardContent>
        <Chart data={history} color="hsl(var(--chart-1))" label="CPU" />

        {cpuInfo && cpuInfo.per_core.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {cpuInfo.per_core.map((usage, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Core {index}
                </span>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${usage}%`,
                      backgroundColor: `hsl(${220 - usage * 1.2}, 80%, 50%)`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {usage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
