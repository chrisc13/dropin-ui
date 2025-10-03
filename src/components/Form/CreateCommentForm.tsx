import React, { useState, FormEvent } from "react";
import "./CreateCommentForm.css";

export interface CommentFormValues {
  body: string;
  threadId: string,
  username: string;
  userId: string;
  userImageUrl: string;
}

interface CreateCommentFormProps {
  initialValues: CommentFormValues;
  onSubmit: (values: CommentFormValues) => void;
  formId: string;
}

export const CreateCommentForm: React.FC<CreateCommentFormProps> = ({
  initialValues,
  onSubmit,
  formId,
}) => {
  const [formValues, setFormValues] = useState<CommentFormValues>(initialValues);

  const handleChange = (key: keyof CommentFormValues, value: string) => {
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
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <div className="form-group">
        <label>Comment</label>
        <textarea
          required
          value={formValues.body}
          onChange={(e) => handleChange("body", e.target.value)}
          placeholder="Write your comment..."
        />
      </div>

      {/* Hidden fields for user info */}
      <input type="hidden" value={formValues.username} />
      <input type="hidden" value={formValues.userId} />
      <input type="hidden" value={formValues.userImageUrl} />

      <button type="submit" className="btn btn-primary">
        Post Comment
      </button>
    </form>
  );
};
