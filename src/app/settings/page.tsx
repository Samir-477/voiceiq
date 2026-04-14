'use client';

import { Settings, Bell, Users, ShieldCheck } from 'lucide-react';

const categories = [
  {
    icon: Settings,
    title: 'General Settings',
    description: 'Configure date format, timezone, and language',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Set up alert thresholds and notification channels',
  },
  {
    icon: Users,
    title: 'User Management',
    description: 'Add, edit, or remove admin users and roles',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    description: 'Manage authentication, SSO, and access policies',
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Settings
        </h1>
        <p className="text-[13px] font-normal mt-0.5">
          <span className="text-red-400">Configure system preferences </span>
          <span className="text-gray-500">and user management</span>
        </p>
      </div>

      <div className="px-8 pb-10 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {categories.map(({ icon: Icon, title, description }) => (
            <button
              key={title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5 text-left hover:shadow-md hover:border-red-100 transition-all duration-150 group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <Icon size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900 mb-0.5">{title}</p>
                <p className="text-[12px] text-red-400 leading-snug">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
