export const defaultSystemSettings = {
  institute: {
    name: 'Aravya Coaching Institute',
    code: 'ARV-001',
    email: 'contact@aravya.com',
    phone: '+91 98000 11223',
    website: 'https://aravya.com',
    defaultBranch: 'Main Branch',
  },
  academic: {
    academicYear: '2026-2027',
    defaultSession: 'JEE & NEET 2027',
    attendanceThreshold: 75,
    passingPercentage: 40,
  },
  operational: {
    currency: 'INR (₹)',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '12-hour',
    timezone: 'Asia/Kolkata (IST)',
    workingDays: 'Monday - Saturday',
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    whatsappEnabled: true,
    systemAlerts: true,
  },
  security: {
    sessionTimeout: '30 minutes',
    loginNotifications: true,
    confirmSensitiveActions: true,
  },
}