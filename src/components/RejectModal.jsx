import React, { useState } from "react";
import "../style/RejectModal.css";

const REASONS = [
  "Incomplete or inaccurate information",
  "Inappropriate images uploaded",
  "Price does not match description",
  "Duplicate listing",
  "Does not meet safety standards",
  "Other",
];

const RejectModal = ({ property, onConfirm, onCancel }) => {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");

  const reason = selected === "Other" ? custom : selected;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Reject Property</h2>
        <p className="modal-subtitle">
          Please select a reason for rejecting <strong>{property.title}</strong>:
        </p>

        <div className="reason-list">
          {REASONS.map((r) => (
            <label key={r} className={`reason-option ${selected === r ? "selected" : ""}`}>
              <input
                type="radio"
                name="reason"
                value={r}
                checked={selected === r}
                onChange={() => setSelected(r)}
              />
              {r}
            </label>
          ))}
        </div>

        {selected === "Other" && (
          <textarea
            className="custom-reason"
            placeholder="Describe the reason..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            rows={3}
          />
        )}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-confirm" onClick={() => onConfirm(reason)} disabled={!reason}>
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;