import { useState } from "react";
import { defaultSystemSettings } from "../data/systemSettingsData";
import PageHeader from "../components/PageHeader";

function SettingsSection({ title, description, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 mb-6">
      <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
      <p className="text-sm text-neutral-500 mt-1 mb-4">{description}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-neutral-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-brand-600" : "bg-neutral-200"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`}
        />
      </button>
    </div>
  );
}

function SystemSettings() {
  const [settings, setSettings] = useState(defaultSystemSettings);
  const [savedMessage, setSavedMessage] = useState(false);

  function updateField(group, field, value) {
    setSettings((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
    setSavedMessage(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  }

  function handleReset() {
    setSettings(defaultSystemSettings);
    setSavedMessage(false);
  }

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500";

  return (
    <div>
      <PageHeader
        title="System Settings"
        subtitle="Configure institute-wide preferences for Aravya."
      />

      <form onSubmit={handleSave}>
        <SettingsSection
          title="Institute Configuration"
          description="Basic information about your institute."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Institute name
              </label>
              <input
                className={inputClass}
                value={settings.institute.name}
                onChange={(e) =>
                  updateField("institute", "name", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Institute code
              </label>
              <input
                className={inputClass}
                value={settings.institute.code}
                onChange={(e) =>
                  updateField("institute", "code", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Contact email
              </label>
              <input
                type="email"
                className={inputClass}
                value={settings.institute.email}
                onChange={(e) =>
                  updateField("institute", "email", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Contact phone
              </label>
              <input
                className={inputClass}
                value={settings.institute.phone}
                onChange={(e) =>
                  updateField("institute", "phone", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Website
              </label>
              <input
                className={inputClass}
                value={settings.institute.website}
                onChange={(e) =>
                  updateField("institute", "website", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Default branch
              </label>
              <input
                className={inputClass}
                value={settings.institute.defaultBranch}
                onChange={(e) =>
                  updateField("institute", "defaultBranch", e.target.value)
                }
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Academic Configuration"
          description="Defaults used across courses and assessments."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Academic year
              </label>
              <input
                className={inputClass}
                value={settings.academic.academicYear}
                onChange={(e) =>
                  updateField("academic", "academicYear", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Default session
              </label>
              <input
                className={inputClass}
                value={settings.academic.defaultSession}
                onChange={(e) =>
                  updateField("academic", "defaultSession", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Attendance threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className={inputClass}
                value={settings.academic.attendanceThreshold}
                onChange={(e) =>
                  updateField(
                    "academic",
                    "attendanceThreshold",
                    Number(e.target.value),
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Passing percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className={inputClass}
                value={settings.academic.passingPercentage}
                onChange={(e) =>
                  updateField(
                    "academic",
                    "passingPercentage",
                    Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Operational Configuration"
          description="Regional and scheduling defaults."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Currency
              </label>
              <input
                className={inputClass}
                value={settings.operational.currency}
                onChange={(e) =>
                  updateField("operational", "currency", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Date format
              </label>
              <select
                className={inputClass + " bg-white"}
                value={settings.operational.dateFormat}
                onChange={(e) =>
                  updateField("operational", "dateFormat", e.target.value)
                }
              >
                <option>DD-MM-YYYY</option>
                <option>MM-DD-YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Time format
              </label>
              <select
                className={inputClass + " bg-white"}
                value={settings.operational.timeFormat}
                onChange={(e) =>
                  updateField("operational", "timeFormat", e.target.value)
                }
              >
                <option>12-hour</option>
                <option>24-hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Timezone
              </label>
              <input
                className={inputClass}
                value={settings.operational.timezone}
                onChange={(e) =>
                  updateField("operational", "timezone", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Working days
              </label>
              <input
                className={inputClass}
                value={settings.operational.workingDays}
                onChange={(e) =>
                  updateField("operational", "workingDays", e.target.value)
                }
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Notification Preferences"
          description="Choose how Aravya sends alerts."
        >
          <ToggleRow
            label="Enable email notifications"
            checked={settings.notifications.emailEnabled}
            onChange={(v) => updateField("notifications", "emailEnabled", v)}
          />
          <ToggleRow
            label="Enable SMS notifications"
            checked={settings.notifications.smsEnabled}
            onChange={(v) => updateField("notifications", "smsEnabled", v)}
          />
          <ToggleRow
            label="Enable WhatsApp notifications"
            checked={settings.notifications.whatsappEnabled}
            onChange={(v) => updateField("notifications", "whatsappEnabled", v)}
          />
          <ToggleRow
            label="Important system alerts"
            checked={settings.notifications.systemAlerts}
            onChange={(v) => updateField("notifications", "systemAlerts", v)}
          />
        </SettingsSection>

        <SettingsSection
          title="Security / Session Preferences"
          description="Prototype-only preferences — no real authentication is enforced."
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Session timeout
            </label>
            <select
              className={inputClass + " bg-white"}
              value={settings.security.sessionTimeout}
              onChange={(e) =>
                updateField("security", "sessionTimeout", e.target.value)
              }
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
            </select>
          </div>
          <ToggleRow
            label="Notify me on new logins"
            checked={settings.security.loginNotifications}
            onChange={(v) => updateField("security", "loginNotifications", v)}
          />
          <ToggleRow
            label="Require confirmation for sensitive actions"
            checked={settings.security.confirmSensitiveActions}
            onChange={(v) =>
              updateField("security", "confirmSensitiveActions", v)
            }
          />
        </SettingsSection>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-neutral-300 text-neutral-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Reset
          </button>
          {savedMessage && (
            <span className="text-sm text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
              Settings saved successfully.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default SystemSettings;
