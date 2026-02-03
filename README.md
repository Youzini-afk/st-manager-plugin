# ST Manager Plugin

SillyTavern 资源可视化管理插件 - 支持角色卡、世界书、预设、正则等资源的管理与备份。

## 📦 功能特性

- 🎴 **资源管理** - 直接在酒馆内编辑角色卡、世界书、预设、正则脚本
- 💾 **备份功能** - 支持手动/定期备份到任意目录（不限于酒馆内部）
- 🔄 **实时同步** - 通过酒馆 API 实时修改资源
- 📊 **统计概览** - 查看资源数量和备份状态

## 🚀 安装方式

### 方式 1：手动编译安装

```bash
# 1. 进入插件目录
cd st-manager-plugin

# 2. 安装依赖
npm install

# 3. 编译
npm run build

# 4. 复制到酒馆扩展目录
# Windows:
xcopy /E /I dist "E:\SillyTavern\public\scripts\extensions\third-party\st-manager"
# Linux/Mac:
cp -r dist/* /path/to/SillyTavern/public/scripts/extensions/third-party/st-manager/

# 5. 复制 manifest.json
copy manifest.json "E:\SillyTavern\public\scripts\extensions\third-party\st-manager\"
```

### 方式 2：使用预编译版本

从 [Releases](https://github.com/Dadihu123/ST-Manager/releases) 下载最新版本，解压到酒馆扩展目录。

## 🔧 配置说明

### 后端服务

插件需要配合 Python 后端服务使用。后端提供备份、恢复等文件系统操作。

```bash
# 启动后端服务（默认端口 5000，建议改为 5001）
python app.py
```

### config.json 配置项

```json
{
  "st_data_path": "E:/SillyTavern/data",  // 酒馆数据目录
  "backup": {
    "enabled": true,           // 启用定期备份
    "path": "E:/Backups/ST",   // 备份目录（可以是任意路径）
    "schedule": "daily",       // daily | weekly | disabled
    "hour": 3,                 // 执行时间（小时）
    "retention_days": 30       // 保留天数
  },
  "cors": {
    "enabled": true,
    "origins": ["http://localhost:8000"]  // 酒馆地址
  }
}
```

## 📁 项目结构

```
st-manager-plugin/
├── package.json          # NPM 配置
├── manifest.json         # 酒馆插件元数据
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 构建配置
└── src/
    ├── index.ts          # 插件入口
    ├── App.vue           # 主界面
    ├── types.ts          # 类型定义
    ├── components/       # Vue 组件
    │   ├── OverviewPanel.vue   # 概览面板
    │   ├── ResourcePanel.vue   # 资源管理
    │   ├── BackupPanel.vue     # 备份管理
    │   └── SettingsPanel.vue   # 设置面板
    └── services/         # 服务层
        ├── backendApi.ts # 后端 API 调用
        └── stApi.ts      # 酒馆 API 封装
```

## 🔌 API 说明

### 前端 API (window.STManagerPlugin)

```javascript
// 连接后端
await window.STManagerPlugin.connect();

// 触发备份
const result = await window.STManagerPlugin.backup.trigger({
  resources: ['characters', 'worldbooks'],
  incremental: true
});

// 获取备份列表
const backups = await window.STManagerPlugin.backup.list();

// 恢复备份
await window.STManagerPlugin.backup.restore('20240101_120000');
```

### 后端 API (/api/v2/)

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v2/health` | GET/POST | 健康检查 |
| `/api/v2/backup/trigger` | POST | 触发备份 |
| `/api/v2/backup/list` | GET | 备份列表 |
| `/api/v2/backup/restore` | POST | 恢复备份 |
| `/api/v2/backup/delete` | DELETE | 删除备份 |
| `/api/v2/backup/schedule` | GET/POST | 备份计划 |
| `/api/v2/config` | GET/POST | 配置管理 |
| `/api/v2/track-change` | POST | 变更追踪 |

## 🛠️ 开发

```bash
# 开发模式（热更新）
npm run dev

# 类型检查
npm run typecheck

# 生产构建
npm run build
```

## 📋 依赖说明

### 前端依赖
- Vue 3
- TypeScript
- Vite

### 后端依赖（可选）
- APScheduler（定时备份功能）

```bash
pip install apscheduler
```

## 📄 License

MIT License
