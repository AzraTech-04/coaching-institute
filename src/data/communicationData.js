import { students } from './studentsData'
import { batches } from './batchesData'
import { faculty } from './facultyData'
import { leads } from './leadsData'

export function resolveAudience(audienceType, audienceId) {
  if (audienceType === 'all-students') return { label: 'All Students', count: students.length }
  if (audienceType === 'all-faculty') return { label: 'All Faculty', count: faculty.length }
  if (audienceType === 'all-leads') return { label: 'All Leads', count: leads.length }
  if (audienceType === 'batch') {
    const batch = batches.find((b) => b.id === audienceId)
    return { label: batch ? batch.name : 'Unknown Batch', count: batch ? batch.students : 0 }
  }
  if (audienceType === 'faculty') {
    const f = faculty.find((f) => f.id === audienceId)
    return { label: f ? f.name : 'Unknown Faculty', count: 1 }
  }
  return { label: 'Unknown', count: 0 }
}

export function createMessage({ id, channel, title, message, audienceType, audienceId, status, scheduledFor }) {
  return {
    id,
    channel,
    title,
    message,
    audienceType,
    audienceId,
    status,
    date: new Date().toISOString().slice(0, 10),
    scheduledFor: scheduledFor || null,
    audience: resolveAudience(audienceType, audienceId),
  }
}

const baseMessages = [
  { id: 1, channel: 'Notification', title: 'Fee Due Reminder', message: 'This is a reminder that your fee installment is due this week.', audienceType: 'all-students', audienceId: null, status: 'Sent', date: '2026-08-10', scheduledFor: null },
  { id: 2, channel: 'Notification', title: 'Batch Timing Update - JEE Morning', message: 'Batch timing shifted by 30 minutes starting Monday.', audienceType: 'batch', audienceId: 1, status: 'Sent', date: '2026-08-14', scheduledFor: null },
  { id: 3, channel: 'Notification', title: 'Upcoming Mock Test Alert', message: 'A mock test is scheduled for NEET Batch A next week.', audienceType: 'batch', audienceId: 3, status: 'Scheduled', date: '2026-08-19', scheduledFor: '2026-08-25' },
  { id: 4, channel: 'Notification', title: 'Institute Holiday Notice', message: 'The institute will remain closed on account of a public holiday.', audienceType: 'all-students', audienceId: null, status: 'Draft', date: '2026-08-19', scheduledFor: null },

  { id: 5, channel: 'WhatsApp', title: 'Fee Payment Reminder', message: 'Please complete your pending fee payment at the earliest.', audienceType: 'batch', audienceId: 4, status: 'Sent', date: '2026-08-12', scheduledFor: null },
  { id: 6, channel: 'WhatsApp', title: 'Parent-Teacher Meeting Invite', message: 'You are invited to the upcoming parent-teacher meeting.', audienceType: 'all-students', audienceId: null, status: 'Scheduled', date: '2026-08-19', scheduledFor: '2026-08-28' },
  { id: 7, channel: 'WhatsApp', title: 'New Study Material Shared', message: 'New notes for Class 10 Foundation have been shared.', audienceType: 'batch', audienceId: 5, status: 'Draft', date: '2026-08-19', scheduledFor: null },

  { id: 8, channel: 'SMS', title: 'Fee Due Alert', message: 'Your fee payment is due. Please pay to avoid late charges.', audienceType: 'all-leads', audienceId: null, status: 'Sent', date: '2026-08-09', scheduledFor: null },
  { id: 9, channel: 'Email', title: 'Monthly Performance Report', message: "Attached is your ward's monthly performance summary.", audienceType: 'all-students', audienceId: null, status: 'Sent', date: '2026-08-15', scheduledFor: null },
  { id: 10, channel: 'SMS', title: 'Batch Timing Change Alert', message: 'Your batch timing has changed. Please check the app for details.', audienceType: 'batch', audienceId: 2, status: 'Scheduled', date: '2026-08-19', scheduledFor: '2026-08-22' },
  { id: 11, channel: 'Email', title: 'Faculty Meeting Agenda', message: "Please find attached the agenda for this week's faculty meeting.", audienceType: 'all-faculty', audienceId: null, status: 'Draft', date: '2026-08-19', scheduledFor: null },

  { id: 12, channel: 'Announcement', title: 'Independence Day Holiday', message: 'The institute will be closed on 15th August for Independence Day.', audienceType: 'all-students', audienceId: null, status: 'Published', date: '2026-08-01', scheduledFor: null },
  { id: 13, channel: 'Announcement', title: 'New NEET Batch Launching', message: 'A new NEET batch is launching next month. Limited seats available.', audienceType: 'all-students', audienceId: null, status: 'Scheduled', date: '2026-08-19', scheduledFor: '2026-09-01' },
  { id: 14, channel: 'Announcement', title: 'Exam Pattern Update', message: 'There has been an update to the JEE Advanced Evening batch exam pattern.', audienceType: 'batch', audienceId: 2, status: 'Draft', date: '2026-08-19', scheduledFor: null },
]

export const messages = baseMessages.map((m) => ({ ...m, audience: resolveAudience(m.audienceType, m.audienceId) }))