use serde::Serialize;
use sysinfo::{CpuRefreshKind, MemoryRefreshKind, RefreshKind, System};
use std::sync::Mutex;
use tauri::State;

struct AppState {
    system: Mutex<System>,
}

#[derive(Serialize)]
pub struct CpuInfo {
    pub overall: f32,
    pub per_core: Vec<f32>,
}

#[derive(Serialize)]
pub struct MemoryInfo {
    pub used: u64,
    pub total: u64,
    pub percentage: f32,
}

#[tauri::command]
fn get_cpu_usage(state: State<AppState>) -> CpuInfo {
    let mut system = state.system.lock().unwrap();
    system.refresh_cpu_all();

    let per_core: Vec<f32> = system.cpus().iter().map(|cpu| cpu.cpu_usage()).collect();
    let overall = if per_core.is_empty() {
        0.0
    } else {
        per_core.iter().sum::<f32>() / per_core.len() as f32
    };

    CpuInfo { overall, per_core }
}

#[tauri::command]
fn get_memory_usage(state: State<AppState>) -> MemoryInfo {
    let mut system = state.system.lock().unwrap();
    system.refresh_memory();

    let total = system.total_memory();
    let used = system.used_memory();
    let percentage = if total > 0 {
        (used as f64 / total as f64 * 100.0) as f32
    } else {
        0.0
    };

    MemoryInfo {
        used,
        total,
        percentage,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let system = System::new_with_specifics(
        RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything()),
    );

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            system: Mutex::new(system),
        })
        .invoke_handler(tauri::generate_handler![get_cpu_usage, get_memory_usage])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
