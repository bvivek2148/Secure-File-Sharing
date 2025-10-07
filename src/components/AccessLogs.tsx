import { Clock, User, Activity } from 'lucide-react';
import { AccessLog, storageManager } from '../utils/storage';

interface AccessLogsProps {
  logs: AccessLog[];
}

const actionColors: Record<AccessLog['action'], string> = {
  upload: 'bg-green-100 text-green-800',
  view: 'bg-blue-100 text-blue-800',
  download: 'bg-purple-100 text-purple-800',
  decrypt: 'bg-amber-100 text-amber-800',
  share: 'bg-teal-100 text-teal-800',
};

const actionLabels: Record<AccessLog['action'], string> = {
  upload: 'Uploaded',
  view: 'Viewed',
  download: 'Downloaded',
  decrypt: 'Decrypted',
  share: 'Shared',
};

export function AccessLogs({ logs }: AccessLogsProps) {
  const users = storageManager.getAllUsers();

  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.displayName : 'Unknown User';
  };

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 border border-slate-200 text-center">
        <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">No access logs available</p>
        <p className="text-slate-400 text-sm mt-2">
          Activity logs will appear here once files are accessed
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Activity className="w-6 h-6 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Access Logs</h2>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {logs.map((log, index) => (
          <div
            key={index}
            className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">
                    {getUserName(log.userId)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      actionColors[log.action]
                    }`}
                  >
                    {actionLabels[log.action]}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  {log.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
