'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Loader2, Plus, Trash2, Users, Globe, Sparkles } from 'lucide-react';
import MediaUploadInput from './MediaUploadInput';
import type { TeamMember } from '@/types';

export default function TeamPanel() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState<string>('loading');
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setSource(data.source || 'supabase');
      }
    } catch (e) {
      console.error('Failed to load team members:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleMemberChange = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const addMember = () => {
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: 'New Leader Profile',
      role: 'Growth Strategist & Director',
      bio: 'Deep expertise in scaling digital products, conversion architecture, and client success.',
      avatar: '/team/placeholder-founder.jpg',
      linkedin: 'https://linkedin.com/company/growmybizz',
    };
    setMembers([...members, newMember]);
    setActiveMemberIndex(members.length);
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) {
      alert('You must have at least one team member profile.');
      return;
    }
    const filtered = members.filter((_, i) => i !== index);
    setMembers(filtered);
    setActiveMemberIndex(Math.max(0, index - 1));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      });
      if (res.ok) {
        setSaved(true);
        setSource('supabase');
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save team members:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-white/40">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading Team Profiles...</span>
      </div>
    );
  }

  const currentMember = members[activeMemberIndex] || members[0];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div>
          <h2 className="text-lg font-semibold text-white">Agency Team & Leadership</h2>
          <p className="text-xs text-white/50">
            Control the team profiles, executive bios, and avatars shown on the /about page.
            Data source: <span className="font-mono text-[#477BDB]">{source}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addMember}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Member</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#477BDB] hover:bg-[#3b82d4] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : saved ? (
              <Check size={13} />
            ) : (
              <Save size={13} />
            )}
            <span>{saved ? 'Saved Live to Site!' : saving ? 'Saving...' : 'Save All Profiles'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Members Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-1 mb-2">
            Team Members ({members.length})
          </div>
          {members.map((m, idx) => (
            <div
              key={m.id || idx}
              onClick={() => setActiveMemberIndex(idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                activeMemberIndex === idx
                  ? 'bg-[#477BDB]/10 border-[#477BDB]/40 text-white'
                  : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0">
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users size={16} className="text-white/40 m-2" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{m.name}</div>
                  <div className="text-[11px] text-white/40 truncate">{m.role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeMember(idx);
                }}
                className="p-1 rounded text-white/30 hover:text-rose-400"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Member Form & Preview */}
        <div className="lg:col-span-8 space-y-6">
          {currentMember && (
            <>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="text-sm font-semibold text-white">
                    Editing: {currentMember.name}
                  </div>
                  <span className="text-[11px] font-mono text-white/40">ID: {currentMember.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={currentMember.name}
                      onChange={(e) =>
                        handleMemberChange(activeMemberIndex, 'name', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">
                      Role / Professional Title
                    </label>
                    <input
                      type="text"
                      value={currentMember.role}
                      onChange={(e) =>
                        handleMemberChange(activeMemberIndex, 'role', e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    Leadership Bio
                  </label>
                  <textarea
                    rows={3}
                    value={currentMember.bio}
                    onChange={(e) =>
                      handleMemberChange(activeMemberIndex, 'bio', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <MediaUploadInput
                    label="Profile Picture / Avatar"
                    value={currentMember.avatar || ''}
                    onChange={(url) => handleMemberChange(activeMemberIndex, 'avatar', url)}
                    helperText="Upload a professional headshot (square aspect ratio recommended)."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={currentMember.linkedin || ''}
                    onChange={(e) =>
                      handleMemberChange(activeMemberIndex, 'linkedin', e.target.value)
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c0d12] to-[#141724] border border-white/10 space-y-3 relative overflow-hidden max-w-sm">
                <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#477BDB]" /> Live Preview
                </div>
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <img
                    src={currentMember.avatar || '/team/placeholder-founder.jpg'}
                    alt={currentMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-white">{currentMember.name}</div>
                  <div className="text-xs text-[#477BDB] font-medium">{currentMember.role}</div>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{currentMember.bio}</p>
                {currentMember.linkedin && (
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-white/40">
                    <Globe size={12} className="text-[#477BDB]" />
                    <span className="truncate">{currentMember.linkedin}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
