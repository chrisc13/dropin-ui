import React, { useState } from "react";
import { FormFields } from "../../types/FormFields";
import "./Form.css";

interface FormProps<T> {
  initialValues: FormFields<T>;
  onSubmit: (values: FormFields<T>) => void;
  formId: string;
}

export function GenericForm<T>({
  initialValues,
  onSubmit,
  formId,
}: FormProps<T>) {
  const [formValues, setFormValues] = useState<FormFields<T>>(initialValues);

  const handleChange = (key: keyof T, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  // Helpers
  const isDateOnly = (val: any): boolean => {
    if (val instanceof Date) return false; // full Date object → datetime-local
    return typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val);
  };

  const isDateTime = (val: any): boolean => {
    if (val instanceof Date) return true;
    return (
      typeof val === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)
    );
  };

  const formatDateForInput = (val: string | Date | undefined): string => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().slice(0, 10); // YYYY-MM-DD
    return val.slice(0, 10);
  };

  const formatDateTimeForInput = (val: string | Date | undefined): string => {
    if (!val) return "";
    const d = typeof val === "string" ? new Date(val) : val;
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const getInputField = (propName: string) => {
    const initialValue = (initialValues as any)[propName];
    const value = (formValues as any)[propName];

    // Date only
    if (isDateOnly(initialValue)) {
      return (
        <input
          id={propName}
          type="date"
          className="form-input"
          value={formatDateForInput(value)}
          onChange={(e) => handleChange(propName as keyof T, e.target.value)}
        />
      );
    }

    // Date + Time
    if (isDateTime(initialValue)) {
      return (
        <input
          id={propName}
          type="datetime-local"
          className="form-input"
          value={formatDateTimeForInput(value)}
          onChange={(e) =>
            handleChange(
              propName as keyof T,
              new Date(e.target.value).toISOString()
            )
          }
        />
      );
    }

    // Number
    if (typeof initialValue === "number") {
      return (
        <input
          id={propName}
          type="number"
          className="form-input-number"
          value={value ?? ""}
          onChange={(e) =>
            handleChange(propName as keyof T, Number(e.target.value))
          }
        />
      );
    }

    // Boolean
    if (typeof initialValue === "boolean") {
      return (
        <input
          id={propName}
          type="checkbox"
          className="form-checkbox"
          checked={!!value}
          onChange={(e) =>
            handleChange(propName as keyof T, e.target.checked)
          }
        />
      );
    }

    // Default → text
    return (
      <input
        id={propName}
        type="text"
        className="form-input"
        value={value ?? ""}
        onChange={(e) =>
          handleChange(propName as keyof T, e.target.value)
        }
      />
    );
  };

  return (
    <form id={formId} className="generic-form" onSubmit={handleSubmit}>
      {Object.keys(initialValues).map((key) => (
        <div key={key} className="form-group">
          <label htmlFor={key} className="form-label">
            {key.replace("_", " ")}
          </label>
          {getInputField(key)}
        </div>
      ))}
    </form>
  );
}
