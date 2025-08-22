import React, { useState } from "react";
import { FormFields } from "../../types/FormFields";
import "./Form.css";

interface FormProps<T> {
  initialValues: FormFields<T>;
  onSubmit: (values: FormFields<T>) => void;
  formId: string
}

export function GenericForm<T>({ initialValues, onSubmit, formId }: FormProps<T>) {
  const [formValues, setFormValues] = useState<FormFields<T>>(initialValues);

  const handleChange = (key: keyof T, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form id={formId} className="generic-form" onSubmit={handleSubmit}>
      {Object.keys(initialValues).map((key) => (
        <div key={key} className="form-group">
          <label htmlFor={key} className="form-label">
            {key.replace("_", " ")}
          </label>
          <input
            id={key}
            type="text"
            className="form-input"
            value={(formValues as any)[key] || ""}
            onChange={(e) => handleChange(key as keyof T, e.target.value)}
            placeholder={`Enter ${key}`}
          />
        </div>
      ))}
    </form>
  );
}
