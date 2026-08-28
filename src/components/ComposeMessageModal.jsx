import { useState } from "react";
import Modal from "./Modal";
import { batches } from "../data/batchesData";
import { faculty } from "../data/facultyData";

function ComposeMessageModal({
  open,
  onClose,
  onSubmit,
  modalTitle,
  channelOptions,
  sendNowStatus = "Sent",
  sendNowLabel = "Send Now",
}) {
  const emptyForm = {
    channel: channelOptions[0],
    title: "",
    message: "",
    audienceType: "all-students",
    audienceId: "",
    sendOption: "now",
    scheduledFor: "",
  };
  const [form, setForm] = useState(emptyForm);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const status =
      form.sendOption === "draft"
        ? "Draft"
        : form.sendOption === "schedule"
          ? "Scheduled"
          : sendNowStatus;
    onSubmit({
      channel: form.channel,
      title: form.title,
      message: form.message,
      audienceType: form.audienceType,
      audienceId:
        form.audienceType === "batch" || form.audienceType === "faculty"
          ? Number(form.audienceId)
          : null,
      status,
      scheduledFor: form.sendOption === "schedule" ? form.scheduledFor : null,
    });
    setForm(emptyForm);
    onClose();
  }

  function handleClose() {
    setForm(emptyForm);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {channelOptions.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Channel
            </label>
            <select
              name="channel"
              value={form.channel}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              {channelOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Title / Subject
          </label>
          <input
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Fee payment reminder"
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Message
          </label>
          <textarea
            name="message"
            required
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Audience
          </label>
          <select
            name="audienceType"
            value={form.audienceType}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            <option value="all-students">All Students</option>
            <option value="batch">Specific Batch</option>
            <option value="all-faculty">All Faculty</option>
            <option value="faculty">Specific Faculty</option>
            <option value="all-leads">All Leads</option>
          </select>
        </div>
        {form.audienceType === "batch" && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Select batch
            </label>
            <select
              name="audienceId"
              required
              value={form.audienceId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="" disabled>
                Choose a batch...
              </option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.students} students)
                </option>
              ))}
            </select>
          </div>
        )}
        {form.audienceType === "faculty" && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Select faculty
            </label>
            <select
              name="audienceId"
              required
              value={form.audienceId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            >
              <option value="" disabled>
                Choose a faculty member...
              </option>
              {faculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            When
          </label>
          <select
            name="sendOption"
            value={form.sendOption}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
          >
            <option value="now">{sendNowLabel}</option>
            <option value="schedule">Schedule for later</option>
            <option value="draft">Save as Draft</option>
          </select>
        </div>
        {form.sendOption === "schedule" && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Scheduled date
            </label>
            <input
              type="date"
              name="scheduledFor"
              required
              value={form.scheduledFor}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {form.sendOption === "draft"
              ? "Save Draft"
              : form.sendOption === "schedule"
                ? "Schedule"
                : sendNowLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ComposeMessageModal;
