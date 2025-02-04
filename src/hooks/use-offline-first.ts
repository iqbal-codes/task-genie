import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useOfflineFirstTasks(view: string) {
  const tasks = useLiveQuery(async () => {
    const query = db.tasks;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (view === "inbox") {
      return await query.where('task_list_id').equals('').toArray();
    } else if (view === "today") {
      return await query
        .where('due_date')
        .between(
          today.toISOString(),
          new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
        )
        .toArray();
    } else if (view === "upcoming") {
      return await query
        .where('due_date')
        .above(new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
        .toArray();
    }

    return await query.toArray();
  }, [view]);

  return tasks;
}

export function useOfflineFirstTaskLists() {
  return useLiveQuery(() => db.taskLists.toArray());
}