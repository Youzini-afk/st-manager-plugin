/**
 * 后端 API 服务
 * 与 Python 后端通信，处理备份、恢复等操作
 */

import type { BackupOptions, BackupResult, BackupInfo, BackupSchedule } from '../types';

// 默认后端地址
const DEFAULT_BACKEND_URL = 'http://localhost:5000';

class BackendService {
  private baseUrl: string;
  private connected: boolean = false;

  constructor(baseUrl: string = DEFAULT_BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 设置后端地址
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
    this.connected = false;
  }

  /**
   * 获取请求头
   */
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * 发送请求
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `请求失败: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 检查后端连接
   */
  async checkConnection(): Promise<boolean> {
    try {
      const result = await this.request<{ status: string; version: string }>('/api/v2/health');
      this.connected = result.status === 'ok';
      return this.connected;
    } catch (e) {
      this.connected = false;
      console.warn('[ST Manager] 后端连接失败:', e);
      return false;
    }
  }

  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return this.connected;
  }

  // ============ 备份相关 API ============

  /**
   * 触发手动备份
   */
  async triggerBackup(options?: BackupOptions): Promise<BackupResult> {
    return this.request<BackupResult>('/api/v2/backup/trigger', {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
  }

  /**
   * 获取备份列表
   */
  async listBackups(): Promise<BackupInfo[]> {
    return this.request<BackupInfo[]>('/api/v2/backup/list');
  }

  /**
   * 从备份恢复
   */
  async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    return this.request('/api/v2/backup/restore', {
      method: 'POST',
      body: JSON.stringify({ backupId }),
    });
  }

  /**
   * 删除备份
   */
  async deleteBackup(backupId: string): Promise<{ success: boolean }> {
    return this.request('/api/v2/backup/delete', {
      method: 'DELETE',
      body: JSON.stringify({ backupId }),
    });
  }

  /**
   * 获取备份计划
   */
  async getBackupSchedule(): Promise<BackupSchedule> {
    return this.request<BackupSchedule>('/api/v2/backup/schedule');
  }

  /**
   * 设置备份计划
   */
  async setBackupSchedule(schedule: BackupSchedule): Promise<{ success: boolean }> {
    return this.request('/api/v2/backup/schedule', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  // ============ 配置相关 API ============

  /**
   * 获取插件配置
   */
  async getConfig(): Promise<Record<string, any>> {
    return this.request('/api/v2/config');
  }

  /**
   * 更新插件配置
   */
  async updateConfig(config: Record<string, any>): Promise<{ success: boolean }> {
    return this.request('/api/v2/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // ============ 资源同步 API ============

  /**
   * 同步资源到酒馆
   */
  async syncToST(resourceType: string, resourceId: string): Promise<{ success: boolean }> {
    return this.request('/api/v2/sync/to-st', {
      method: 'POST',
      body: JSON.stringify({ type: resourceType, id: resourceId }),
    });
  }

  /**
   * 从酒馆同步资源
   */
  async syncFromST(resourceType: string): Promise<{ success: boolean; count: number }> {
    return this.request('/api/v2/sync/from-st', {
      method: 'POST',
      body: JSON.stringify({ type: resourceType }),
    });
  }

  /**
   * 追踪资源变更（用于增量备份）
   */
  async trackChange(resourceType: string, resourceId: string): Promise<void> {
    await this.request('/api/v2/track-change', {
      method: 'POST',
      body: JSON.stringify({
        type: resourceType,
        id: resourceId,
        timestamp: Date.now(),
      }),
    });
  }
}

// 单例导出
export const backendService = new BackendService();
export default backendService;
