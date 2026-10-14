import { ReactNode } from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

export default function StatsCard({ icon, label, value, color, bgColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-4 text-center transition-transform hover:scale-[1.02]`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

interface BigStatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
  bgColor: string;
  children?: ReactNode;
}

export function BigStatCard({ icon, label, value, subtitle, color, bgColor, children }: BigStatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-5 transition-transform hover:scale-[1.01]`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
      {children}
    </div>
  );
}
