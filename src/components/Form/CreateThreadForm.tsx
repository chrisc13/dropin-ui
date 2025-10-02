import React, { useState, ChangeEvent, FormEvent } from "react";
import { DropInThread } from "../../model/DropInThread";
import "./CreateEventForm.css";

export interface DropInThreadFormValues {
  title: string;
  body: string;
  creatorName: string;
  creatorId: string;
  creatorImageUrl: string;
}

interface CreateThreadFormProps {
  initialValues: DropInThreadFormValues;
  onSubmit: (values: DropInThreadFormValues) => void;
  formId: string;
}

export const CreateThreadForm: React.FC<CreateThreadFormProps> = ({
  initialValues,
  onSubmit,
  formId,
}) => {
  const [formValues, setFormValues] = useState<DropInThreadFormValues>(initialValues);

  const handleChange = (key: keyof DropInThreadFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form
      id={formId}
      className="generic-form"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        // prevent Enter from submitting if typing in a field
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          required
          value={formValues.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Thread title"
        />
      </div>

      <div className="form-group">
        <label>Body</label>
        <textarea
          required
          value={formValues.body}
          onChange={(e) => handleChange("body", e.target.value)}
          placeholder="Write your post..."
        />
      </div>

      {/* Hidden fields for creator info, set by context */}
      <input type="hidden" value={formValues.creatorName} />
      <input type="hidden" value={formValues.creatorId} />
      <input type="hidden" value={formValues.creatorImageUrl} />

      <button type="submit" className="btn btn-primary">
        Post Thread
      </button>
    </form>
  );
};
