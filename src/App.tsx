import { useEffect, useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CpuMonitor } from "./components/CpuMonitor";
import { MemoryMonitor } from "./components/MemoryMonitor";

interface CpuInfo {
  overall: number;
  per_core: number[];
}

interface MemoryInfo {
  used: number;
  total: number;
  percentage: number;
}

interface DataPoint {
  time: number;
  value: number;
}

const HISTORY_LENGTH = 60;

function App() {
  const [cpuInfo, setCpuInfo] = useState<CpuInfo | null>(null);
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo | null>(null);
  const [cpuHistory, setCpuHistory] = useState<DataPoint[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<DataPoint[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [cpu, memory] = await Promise.all([
        invoke<CpuInfo>("get_cpu_usage"),
        invoke<MemoryInfo>("get_memory_usage"),
      ]);

      setCpuInfo(cpu);
      setMemoryInfo(memory);

      setCpuHistory((prev) => {
        const newHistory = [...prev, { time: 0, value: cpu.overall }];
        return newHistory
          .slice(-HISTORY_LENGTH)
          .map((point, index, arr) => ({
            ...point,
            time: index - arr.length + 1,
          }));
      });

      setMemoryHistory((prev) => {
        const newHistory = [...prev, { time: 0, value: memory.percentage }];
        return newHistory
          .slice(-HISTORY_LENGTH)
          .map((point, index, arr) => ({
            ...point,
            time: index - arr.length + 1,
          }));
      });
    } catch (error) {
      console.error("Failed to fetch system info:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">System Monitor</h1>
      </header>
      <main className="grid gap-6 md:grid-cols-2">
        <CpuMonitor cpuInfo={cpuInfo} history={cpuHistory} />
        <MemoryMonitor memoryInfo={memoryInfo} history={memoryHistory} />
      </main>
    </div>
  );
}

export default App;
