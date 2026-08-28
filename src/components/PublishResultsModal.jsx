import Modal from "./Modal";

function PublishResultsModal({ open, test, onClose, onConfirm }) {
  if (!test) return null;

  return (
    <Modal open={open} onClose={onClose} title="Publish Results">
      <div className="space-y-4">
        <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
          <p className="text-sm font-semibold text-brand-800">{test.name}</p>
          <p className="text-sm text-neutral-600 mt-1">
            {test.course} · {test.batch}
          </p>
        </div>
        <p className="text-sm text-neutral-600 leading-6">
          Publishing will make the result status visible to the institute team
          in this prototype. No messages or notifications will be sent.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-neutral-300 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 rounded-lg"
          >
            Publish Results
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PublishResultsModal;
