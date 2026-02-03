# ST Manager 插件故障排除指南

## ❌ 问题：Extension "ST Manager" failed to load: [object Event]

### 原因分析

这个错误通常由以下原因导致：

1. **插件文件路径不正确** ✅ 已修复
2. **插件依赖的资源加载失败**
3. **JavaScript 语法错误或运行时错误**
4. **与其他插件冲突**

---

## ✅ 解决方案

### 方案 1：更新到最新版本

**最新提交已修复此问题**，请更新插件：

```bash
cd /path/to/SillyTavern/public/scripts/extensions/third-party/st-manager
git pull
npm install
npm run build
```

然后重启 SillyTavern 并刷新浏览器。

---

### 方案 2：检查文件结构

确保插件目录结构正确：

```
third-party/
└── st-manager/
    ├── manifest.json          ✅ 必需
    ├── package.json
    ├── dist/                  ✅ 必需
    │   ├── index.iife.js     ✅ 必需
    │   └── style.css         ✅ 必需
    └── src/
        └── ...
```

**关键检查点**：

1. `manifest.json` 中的路径应为：
   ```json
   {
     "js": "dist/index.iife.js",
     "css": "dist/style.css"
   }
   ```

2. `dist/` 目录必须存在且包含编译后的文件

3. 如果缺少 `dist/` 目录，运行：
   ```bash
   npm run build
   ```

---

### 方案 3：查看浏览器控制台

按 `F12` 打开开发者工具，查看 Console 标签页：

#### 正常日志应显示：

```
[ST Manager] Plugin v1.0.0 initializing...
[ST Manager] Settings panel registered via ST_API
[ST Manager] Vue app mounted
[ST Manager] Backend connection: Failed
[ST Manager] Extension menu button added
[ST Manager] Global API exposed as window.STManagerPlugin
[ST Manager] Plugin initialized successfully
```

#### 如果出现错误：

- **Vue 相关错误** → 可能是依赖未安装，运行 `npm install`
- **网络错误 (Failed to load)** → 检查文件路径和权限
- **语法错误 (SyntaxError)** → 重新编译插件
- **模块加载错误 (Cannot find module)** → 检查 `node_modules/` 是否存在

---

### 方案 4：手动安装（推荐）

如果 Git 克隆方式有问题，尝试手动安装：

1. 下载最新 Release 版本（待发布）或下载源码
2. 解压到 `third-party/st-manager/`
3. 进入目录运行：
   ```bash
   npm install
   npm run build
   ```
4. 检查 `dist/` 目录是否生成
5. 重启 SillyTavern

---

### 方案 5：检查权限

在 Windows 上，确保：
- SillyTavern 目录没有只读权限
- 杀毒软件没有阻止文件访问

在 Linux/Mac 上：
```bash
chmod -R 755 /path/to/third-party/st-manager
```

---

### 方案 6：清除缓存

有时浏览器缓存会导致问题：

1. 按 `Ctrl + Shift + R` (Windows/Linux) 或 `Cmd + Shift + R` (Mac) 强制刷新
2. 或清除浏览器缓存后重新加载

---

### 方案 7：禁用其他插件测试

如果怀疑插件冲突：

1. 暂时禁用其他第三方插件
2. 只保留 ST Manager 插件
3. 测试是否能正常加载
4. 逐个启用其他插件，找出冲突源

---

## 🔍 调试模式

### 开启详细日志

在插件加载前，在浏览器控制台运行：

```javascript
localStorage.setItem('stm_debug', 'true');
```

然后刷新页面，插件会输出更详细的调试信息。

### 检查全局 API

在浏览器控制台运行：

```javascript
console.log(window.STManagerPlugin);
```

如果返回 `undefined`，说明插件未成功加载。

如果返回对象，说明插件已部分加载，但可能 UI 初始化失败。

---

## 🐛 已知问题

### 问题 1：Vue 版本冲突

**症状**: 控制台显示 "Vue is already defined"

**解决**: 确保 SillyTavern 版本 >= 1.12.0

### 问题 2：CORS 错误

**症状**: 控制台显示 "blocked by CORS policy"

**解决**: 
1. 确保后端服务已启动
2. 检查 `config.json` 中 `cors.enabled` 为 `true`
3. 确认 `cors.origins` 包含酒馆访问地址

### 问题 3：后端连接失败

**症状**: 显示 "后端连接失败" 或 "离线"

**解决**: 参考 [INSTALLATION.md](INSTALLATION.md#问题-2-无法连接后端)

---

## 📞 获取帮助

如果以上方法都无效，请：

1. **收集信息**:
   - SillyTavern 版本
   - 插件版本
   - 浏览器控制台完整错误信息
   - 插件目录文件列表 (`ls -la` 或 `dir`)

2. **提交 Issue**:
   - GitHub: https://github.com/Youzini-afk/st-manager-plugin/issues
   - 标题: `[Bug] Extension failed to load`
   - 附上收集的信息

3. **临时解决方案**:
   - 使用独立的 Web UI 版本（Python 后端）
   - 访问 `http://localhost:5000` 直接使用

---

## 📝 更新记录

### 2024-XX-XX (v1.0.1)

- ✅ **修复**: 修正 manifest.json 文件路径配置
- ✅ **改进**: 添加完整的错误捕获和日志输出
- ✅ **优化**: 更友好的错误提示信息

### 2024-XX-XX (v1.0.0)

- 🎉 初始版本发布
