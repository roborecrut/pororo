import { useStore } from '../store/useStore';
import { MODE_LABELS, MODE_ICONS, Mode } from '../types';
import { formatTime } from '../utils/helpers';
import { format, parseISO } from 'date-fns';

export default function HistoryPage() {
  const { allStats } = useStore();

  // Flatten all sessions and sort by date
  const allSessions = allStats
    .flatMap(stats => stats.sessions)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const completedSessions = allSessions.filter(s => s.completed);

  // Group sessions by date
  const sessionsByDate: Record<string, typeof completedSessions> = {};
  completedSessions.forEach(session => {
    const date = session.completedAt.split('T')[0];
    if (!sessionsByDate[date]) sessionsByDate[date] = [];
    sessionsByDate[date].push(session);
  });

  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📋 История сессий
        </h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {completedSessions.length} сессий
        </span>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Нет завершённых сессий</h3>
          <p className="text-sm text-gray-400">
            Завершите свой первый помодоро, чтобы увидеть его здесь
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📅</span>
                {format(parseISO(date), 'd MMMM yyyy', { locale: undefined })}
                <span className="text-xs font-normal text-gray-400">
                  ({sessionsByDate[date].length} сессий)
                </span>
              </h3>
              <div className="space-y-2">
                {sessionsByDate[date].map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: { id: string; mode: Mode; duration: number; completedAt: string; completed: boolean } }) {
  const modeColors: Record<Mode, string> = {
    focus: 'border-red-200 bg-red-50/50',
    shortBreak: 'border-emerald-200 bg-emerald-50/50',
    longBreak: 'border-blue-200 bg-blue-50/50',
  };

  const iconColors: Record<Mode, string> = {
    focus: 'text-red-500',
    shortBreak: 'text-emerald-500',
    longBreak: 'text-blue-500',
  };

  const time = format(parseISO(session.completedAt), 'HH:mm');

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${modeColors[session.mode]} transition-transform hover:scale-[1.01]`}>
      <div className="flex items-center gap-3">
        <span className={`text-xl ${iconColors[session.mode]}`}>
          {MODE_ICONS[session.mode]}
        </span>
        <div>
          <div className="text-sm font-medium text-gray-700">
            {MODE_LABELS[session.mode]}
          </div>
          <div className="text-xs text-gray-400">
            {session.duration} мин
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{time}</span>
        <span className="text-green-500 text-sm">✓</span>
      </div>
    </div>
  );
}
