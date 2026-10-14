import { useStore } from '../store/useStore';
import { getWeekDates, getStatsForDate, formatShortDate, formatDuration } from '../utils/helpers';
import { BigStatCard } from '../components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StatsPage() {
  const { allStats, completedPomodoros } = useStore();
  const weekDates = getWeekDates();

  // Weekly data
  const weeklyData = weekDates.map(date => {
    const stats = getStatsForDate(allStats, date);
    return {
      date: formatShortDate(date),
      minutes: stats.totalFocusMinutes,
      sessions: stats.focusSessions,
    };
  });

  // Today stats
  const todayDate = weekDates[weekDates.length - 1];
  const todayStats = getStatsForDate(allStats, todayDate);

  // Total stats
  const totalMinutes = allStats.reduce((sum, s) => sum + s.totalFocusMinutes, 0);
  const totalSessions = allStats.reduce((sum, s) => sum + s.focusSessions, 0);
  const totalDays = allStats.length;
  const avgMinutesPerDay = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;

  // Streak calculation
  let streak = 0;
  for (let i = weekDates.length - 1; i >= 0; i--) {
    const stats = getStatsForDate(allStats, weekDates[i]);
    if (stats.focusSessions > 0) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📊 Статистика
      </h1>

      {/* Big stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <BigStatCard
          icon="🍅"
          label="Всего помодоро"
          value={completedPomodoros}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <BigStatCard
          icon="⏱️"
          label="Общее время"
          value={formatDuration(totalMinutes)}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <BigStatCard
          icon="📅"
          label="Активных дней"
          value={totalDays}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <BigStatCard
          icon="🔥"
          label="Серия дней"
          value={`${streak} дн.`}
          subtitle={`~${avgMinutesPerDay} мин/день`}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Focus minutes chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Минуты фокуса за неделю
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`${value} мин`, 'Фокус']}
                />
                <Bar dataKey="minutes" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Сессии за неделю
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [`${value}`, 'Сессий']}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#10b981"
                  fill="#d1fae5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Today's breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Сегодня в деталях
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600">{todayStats.focusSessions}</div>
            <div className="text-xs text-gray-500 mt-1">Сессий фокуса</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">{todayStats.totalFocusMinutes}</div>
            <div className="text-xs text-gray-500 mt-1">Минут фокуса</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {todayStats.totalFocusMinutes > 0 ? Math.round(todayStats.totalFocusMinutes / 60 * 10) / 10 : 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Часов</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{todayStats.completedPomodoros}</div>
            <div className="text-xs text-gray-500 mt-1">Помодоро</div>
          </div>
        </div>
      </div>
    </div>
  );
}
