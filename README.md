# ST Manager Plugin

SillyTavern 资源可视化管理插件 - 支持角色卡、世界书、预设、正则等资源的管理与备份。

## ✨ 功能特性

- 🎴 **资源管理** - 直接在酒馆内编辑角色卡、世界书、预设、正则脚本
- 💾 **智能备份** - 支持完整/增量备份，可配置定时任务（每日/每周）
- 🔄 **实时同步** - 通过酒馆 API 实时修改资源，无需重启
- 📊 **统计概览** - 查看资源数量和备份状态
- 🌐 **Web UI** - 从酒馆扩展菜单（魔法棒）直接打开完整管理界面
- ⚙️ **前端配置** - 在插件内配置后端地址，无需手动编辑文件

## 🚀 快速开始

### 安装插件

```bash
# 克隆到酒馆扩展目录
cd /path/to/SillyTavern/public/scripts/extensions/third-party
git clone https://github.com/Youzini-afk/st-manager-plugin.git st-manager

# 构建插件
cd st-manager
npm install
npm run build
```

### 启动后端服务

```bash
cd /path/to/ST-Manager
pip install -r requirements.txt
python app.py
```

后端默认运行在 `http://localhost:5000`

### 在酒馆中使用

1. **方式 A**: 点击酒馆右上角 **魔法棒图标** → 选择 **"ST Manager 资源管理"**
2. **方式 B**: 进入 **设置** → **扩展设置** → 展开 **"ST Manager 资源管理"** 面板

首次使用请在 **设置** 标签页配置后端地址并点击 **"保存并重连"**。

##  配置说明

### 后端配置 (config.json)

```json
{
  "st_data_path": "/path/to/SillyTavern/data",
  "backup": {
    "enabled": true,
    "path": "data/backups",      // 支持外部目录
    "schedule": "daily",         // daily | weekly | disabled
    "retention_days": 30
  },
  "cors": {
    "enabled": true,
    "origins": ["http://localhost:8000"]
  }
}
```

### 前端配置（插件内）

在插件 **设置** 标签页可配置：
- 后端地址（默认 `http://localhost:5000`）
- 自动连接选项
- 通知偏好设置

配置自动保存到浏览器本地存储。

## 🔌 API 使用

### 全局 JavaScript API

```javascript
// 检查插件状态
if (window.STManagerPlugin) {
  // 连接后端
  await window.STManagerPlugin.connect();

  // 触发备份
  await window.STManagerPlugin.backup.trigger({
    type: 'full',
    resources: ['characters', 'worldbooks']
  });

  // 获取备份列表
  const backups = await window.STManagerPlugin.backup.list();

  // 恢复备份
  await window.STManagerPlugin.backup.restore('backup_20240101_120000');
}
```

### 后端 REST API

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v2/health` | GET/POST | 健康检查 |
| `/api/v2/backup/trigger` | POST | 触发备份 |
| `/api/v2/backup/list` | GET | 备份列表 |
| `/api/v2/backup/restore` | POST | 恢复备份 |
| `/api/v2/backup/schedule` | GET/POST | 备份计划 |
| `/api/v2/config` | GET/POST | 配置管理 |

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 类型检查
npm run type-check

# 生产构建
npm run build
```

## � 项目结构

```
st-manager-plugin/
├── manifest.json         # 酒馆插件元数据
├── package.json          # NPM 配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 构建配置
├── INSTALLATION.md       # 详细安装指南
├── dist/                 # 构建输出
│   ├── index.iife.js     # 插件主文件
│   └── style.css         # 样式文件
└── src/
    ├── index.ts          # 插件入口
    ├── App.vue           # 主界面
    ├── types.ts          # TypeScript 类型定义
    ├── components/       # Vue 组件
    │   ├── OverviewPanel.vue   # 概览面板
    │   ├── ResourcePanel.vue   # 资源管理
    │   ├── BackupPanel.vue     # 备份管理
    │   └── SettingsPanel.vue   # 设置面板
    └── services/         # 服务层
        ├── backendApi.ts # 后端 API 封装
        └── stApi.ts      # SillyTavern API 封装
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

- GitHub: https://github.com/Youzini-afk/st-manager-plugin
- 讨论: [Issues](https://github.com/Youzini-afk/st-manager-plugin/issues)

## 📄 开源协议

MIT License
