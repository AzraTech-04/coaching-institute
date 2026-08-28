import { useState } from "react";
import Modal from "./Modal";
import { branchStatusOptions } from "../data/branchesData";

const emptyForm = {
  name: "",
  code: "",
  city: "",
  address: "",
  contact: "",
  email: "",
  manager: "",
  capacity: "",
  status: "Active",
};
const inputClass =
  "w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500";

function AddBranchModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = onAdd({
      ...form,
      capacity: Number(form.capacity),
      batchIds: [],
    });
    if (result) {
      setError(result);
      return;
    }
    setForm(emptyForm);
    setError("");
    onClose();
  }

  function handleClose() {
    setForm(emptyForm);
    setError("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Branch">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ["name", "Branch name", "Aravya Mumbai"],
            ["code", "Branch code", "MUM01"],
            ["city", "City", "Mumbai"],
            ["contact", "Contact", "+91 98765 43210"],
            ["manager", "Branch manager", "Manager name"],
            ["email", "Email", "mumbai@aravya.in"],
          ].map(([name, label, placeholder]) => (
            <div
              key={name}
              className={name === "address" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={`branch-${name}`}
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                {label}
              </label>
              <input
                id={`branch-${name}`}
                name={name}
                required={name !== "email" && name !== "manager"}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
        <div>
          <label
            htmlFor="branch-address"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Address
          </label>
          <input
            id="branch-address"
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            placeholder="Andheri East, Mumbai"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="branch-capacity"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              Capacity
            </label>
            <input
              id="branch-capacity"
              name="capacity"
              type="number"
              min="1"
              required
              value={form.capacity}
              onChange={handleChange}
              placeholder="150"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="branch-status"
              className="block text-sm font-medium text-neutral-700 mb-1.5"
            >
              Status
            </label>
            <select
              id="branch-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`${inputClass} bg-white`}
            >
              {branchStatusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
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
            Add Branch
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddBranchModal;
