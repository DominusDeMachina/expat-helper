import * as Updates from 'expo-updates';

import { useEffect, useState } from 'react';

export interface UpdateInfo {
  isUpdateAvailable: boolean;
  isUpdatePending: boolean;
  isChecking: boolean;
  isDownloading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useOTAUpdates = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    isUpdateAvailable: false,
    isUpdatePending: false,
    isChecking: false,
    isDownloading: false,
    error: null,
    lastChecked: null,
  });

  const checkForUpdates = async () => {
    if (!Updates.isEnabled) {
      setUpdateInfo(prev => ({
        ...prev,
        error: 'Updates are not enabled in this environment',
      }));
      return;
    }

    setUpdateInfo(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const update = await Updates.checkForUpdateAsync();
      setUpdateInfo(prev => ({
        ...prev,
        isUpdateAvailable: update.isAvailable,
        isChecking: false,
        lastChecked: new Date(),
      }));

      return update.isAvailable;
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        isChecking: false,
        error: error instanceof Error ? error.message : 'Failed to check for updates',
        lastChecked: new Date(),
      }));
      return false;
    }
  };

  const downloadAndApplyUpdate = async () => {
    if (!Updates.isEnabled) {
      setUpdateInfo(prev => ({
        ...prev,
        error: 'Updates are not enabled in this environment',
      }));
      return;
    }

    setUpdateInfo(prev => ({ ...prev, isDownloading: true, error: null }));

    try {
      const result = await Updates.fetchUpdateAsync();
      if (result.isNew) {
        setUpdateInfo(prev => ({
          ...prev,
          isDownloading: false,
          isUpdatePending: true,
        }));
        // Restart the app to apply the update
        await Updates.reloadAsync();
      } else {
        setUpdateInfo(prev => ({
          ...prev,
          isDownloading: false,
          isUpdateAvailable: false,
        }));
      }
    } catch (error) {
      setUpdateInfo(prev => ({
        ...prev,
        isDownloading: false,
        error: error instanceof Error ? error.message : 'Failed to download update',
      }));
    }
  };

  // Auto-check for updates on mount
  useEffect(() => {
    if (Updates.isEnabled) {
      checkForUpdates();
    }
  }, []);

  return {
    ...updateInfo,
    checkForUpdates,
    downloadAndApplyUpdate,
    isEnabled: Updates.isEnabled,
  };
}; 