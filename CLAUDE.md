# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Tauri v2（Rustバックエンド）とReact 19（TypeScriptフロントエンド）で構築されたクロスプラットフォームのデスクトップシステム監視アプリケーション。リアルタイムのCPUとメモリ使用率を履歴チャートとともに表示する。

## 開発コマンド

```bash
# ホットリロード付きフル開発環境（Tauri + Vite）
npm run tauri dev

# 現在のプラットフォーム向けプロダクションビルド
npm run tauri build

# フロントエンドのみの開発サーバー
npm run dev

# TypeScriptチェック + フロントエンドビルド
npm run build
```

## アーキテクチャ

```text
Frontend (React/TypeScript)          Backend (Rust/Tauri)
┌─────────────────────────┐         ┌─────────────────────────┐
│ App.tsx                 │         │ lib.rs                  │
│  - 1秒ポーリング間隔    │ invoke()│  - Mutex付きAppState    │
│  - 60エントリの履歴     │────────>│  - sysinfoライブラリ    │
│                         │         │                         │
│ CpuMonitor / MemoryMonitor        │ Commands:               │
│  - Chart.tsx (Recharts) │<────────│  - get_cpu_usage()      │
│  - プログレスバー       │  JSON   │  - get_memory_usage()   │
└─────────────────────────┘         └─────────────────────────┘
```

**データフロー:** フロントエンドが毎秒Tauriコマンドをポーリング → Rustがsysinfoクレートでシステム情報を更新 → シリアライズされた構造体を返却 → フロントエンドがチャート履歴用の循環バッファを管理

## 主要ファイル

- `src/App.tsx` - メインコンポーネント、状態管理、Tauriコマンド呼び出し
- `src-tauri/src/lib.rs` - Rustコマンド（`get_cpu_usage`, `get_memory_usage`）、AppState定義
- `src-tauri/tauri.conf.json` - ウィンドウ設定、バンドル設定、アプリ識別子
- `src/components/Chart.tsx` - 履歴可視化用の再利用可能なRechartsラッパー

## Tauriコマンドインターフェース

```typescript
// フロントエンドから呼び出し
invoke<CpuInfo>("get_cpu_usage"); // → { overall: f32, per_core: Vec<f32> }
invoke<MemoryInfo>("get_memory_usage"); // → { used: u64, total: u64, percentage: f32 }
```

## 技術スタック

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Rust, Tauri v2, sysinfo crate
- **パスエイリアス:** `@/*` → `./src/*`
