import { syncService } from "@/services/sync.service";
import { queryClient } from "./query-client";

type SyncState = {
  interval: NodeJS.Timeout | null;
  inProgress: boolean;
};

const syncState: SyncState = {
  interval: null,
  inProgress: false,
};

const sync = async () => {
  if (!navigator.onLine || syncState.inProgress) return;

  try {
    syncState.inProgress = true;
    await queryClient.fetchQuery({
      queryKey: ['sync'],
      queryFn: async () => {
        await syncService.syncTasks();
        await syncService.syncTaskLists();
        await syncService.pullFromServer();
        return true;
      },
      staleTime: Infinity
    });

    await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    await queryClient.invalidateQueries({ queryKey: ['taskLists'] });
  } catch (error) {
    console.error('Sync failed:', error);
  } finally {
    syncState.inProgress = false;
  }
};

export const syncManager = {
  init: () => {
    window.addEventListener("online", () => syncManager.startSync());
    window.addEventListener("offline", () => syncManager.stopSync());
  },

  startSync: (interval = 5 * 60 * 1000) => {
    if (!syncState.interval) {
      sync();
      syncState.interval = setInterval(sync, interval);
    }
  },

  stopSync: () => {
    if (syncState.interval) {
      clearInterval(syncState.interval);
      syncState.interval = null;
    }
  }
};
