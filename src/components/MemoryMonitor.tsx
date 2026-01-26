import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "./Chart";

interface MemoryInfo {
  used: number;
  total: number;
  percentage: number;
}

interface DataPoint {
  time: number;
  value: number;
}

interface MemoryMonitorProps {
  memoryInfo: MemoryInfo | null;
  history: DataPoint[];
}

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

export function MemoryMonitor({ memoryInfo, history }: MemoryMonitorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Memory Usage
        </CardTitle>
        <span className="text-3xl font-bold">
          {memoryInfo ? `${memoryInfo.percentage.toFixed(1)}%` : "--"}
        </span>
      </CardHeader>

      <CardContent>
        <Chart data={history} color="hsl(var(--chart-2))" label="Memory" />

        {memoryInfo && (
          <div className="mt-6">
            <div className="h-3 rounded-full bg-secondary overflow-hidden mb-4">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${memoryInfo.percentage}%`,
                  backgroundColor: `hsl(${160 - memoryInfo.percentage * 1.2}, 70%, 45%)`,
                }}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Used</span>
                <span className="text-sm font-medium">
                  {formatBytes(memoryInfo.used)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-medium">
                  {formatBytes(memoryInfo.total)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Free</span>
                <span className="text-sm font-medium">
                  {formatBytes(memoryInfo.total - memoryInfo.used)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
