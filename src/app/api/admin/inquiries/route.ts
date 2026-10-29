import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';
import type { InquiryRecord } from '@/lib/supabase';

// Helper: Ensure user is authenticated
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/admin/inquiries - List all leads
export async function GET() {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let dbLeads: InquiryRecord[] = [];
  let dbConnected = false;

  // 1. Fetch from Supabase
  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      dbLeads = data as InquiryRecord[];
      dbConnected = true;
    }
  } catch (err) {
    console.warn('Supabase inquiries query notice:', err);
  }

  // 2. Fetch from local file fallback
  const fileLeads: InquiryRecord[] = [];
  try {
    const leadsFile = path.join(process.cwd(), '.leads', 'inquiries.jsonl');
    if (fs.existsSync(leadsFile)) {
      const content = fs.readFileSync(leadsFile, 'utf-8');
      const lines = content.trim().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const item = JSON.parse(line);
          fileLeads.push({
            id: item.id || `file_${Date.now()}`,
            created_at: item.receivedAt || new Date().toISOString(),
            name: item.name,
            email: item.email,
            phone: item.phone || null,
            company: item.company || null,
            service: item.service || 'General Inquiry',
            budget: item.budget || 'Not specified',
            timeline: item.timeline || 'Not specified',
            message: item.message,
            status: (item.status as InquiryRecord['status']) || 'new',
            notes: item.notes || null,
          });
        } catch {
          // Ignore corrupted line
        }
      }
    }
  } catch {
    // Non-fatal
  }

  // Merge leads (Supabase takes precedence, fallback appended if not present)
  const existingEmails = new Set(dbLeads.map((l) => `${l.email}_${l.message.slice(0, 20)}`));
  const mergedLeads = [...dbLeads];

  for (const fl of fileLeads) {
    const key = `${fl.email}_${fl.message.slice(0, 20)}`;
    if (!existingEmails.has(key)) {
      mergedLeads.push(fl);
    }
  }

  // Sort latest first
  mergedLeads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({
    success: true,
    leads: mergedLeads,
    total: mergedLeads.length,
    dbConnected,
    provider: 'supabase',
  });
}

// PATCH /api/admin/inquiries - Update lead status or notes
export async function PATCH(request: Request) {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required.' }, { status: 400 });
    }

    const updates: Partial<InquiryRecord> = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Update in Supabase if valid UUID
    if (UUID_REGEX.test(id)) {
      const { error: supaErr } = await supabaseAdmin
        .from('inquiries')
        .update(updates)
        .eq('id', id);

      if (supaErr) {
        console.warn('Supabase lead update error:', supaErr.message);
      }
    }

    // Also update in local file storage if present
    try {
      const leadsFile = path.join(process.cwd(), '.leads', 'inquiries.jsonl');
      if (fs.existsSync(leadsFile)) {
        const content = fs.readFileSync(leadsFile, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);
        const updatedLines = lines.map((line) => {
          try {
            const item = JSON.parse(line);
            if (item.id === id) {
              return JSON.stringify({ ...item, ...updates });
            }
            return line;
          } catch {
            return line;
          }
        });
        fs.writeFileSync(leadsFile, updatedLines.join('\n') + (updatedLines.length > 0 ? '\n' : ''), 'utf-8');
      }
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, updated: { id, ...updates } });
  } catch (err) {
    console.error('Lead update error:', err);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/admin/inquiries - Remove lead
export async function DELETE(request: Request) {
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Delete from Supabase if valid UUID
    if (UUID_REGEX.test(id)) {
      const { error: supaErr } = await supabaseAdmin.from('inquiries').delete().eq('id', id);
      if (supaErr) {
        console.warn('Supabase delete notice:', supaErr.message);
      }
    }

    // Always delete from local file storage if present
    try {
      const leadsFile = path.join(process.cwd(), '.leads', 'inquiries.jsonl');
      if (fs.existsSync(leadsFile)) {
        const content = fs.readFileSync(leadsFile, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);
        const remainingLines = lines.filter((line) => {
          try {
            const item = JSON.parse(line);
            return item.id !== id;
          } catch {
            return false;
          }
        });
        fs.writeFileSync(leadsFile, remainingLines.join('\n') + (remainingLines.length > 0 ? '\n' : ''), 'utf-8');
      }
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error('Lead deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
