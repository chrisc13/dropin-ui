import React, { useState } from "react";
import { FormFields } from "../../types/FormFields";
import "./Form.css";

interface FormProps<T> {
  initialValues: FormFields<T>;
  onSubmit: (values: FormFields<T>) => void;
  formId: string;
  readOnlyFields?: (keyof T)[]; // 👈 NEW: list of read-only fields
}

export function GenericForm<T>({
  initialValues,
  onSubmit,
  formId,
  readOnlyFields = [],
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
    if (val instanceof Date) return false;
    return typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val);
  };

  const isDateTime = (val: any): boolean => {
    if (val instanceof Date) return true;
    return typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val);
  };

  const formatDateForInput = (val: string | Date | undefined): string => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().slice(0, 10);
    return val.slice(0, 10);
  };

  const formatDateTimeForInput = (val: string | Date | undefined): string => {
    if (!val) return "";
    const d = typeof val === "string" ? new Date(val) : val;
    return d.toISOString().slice(0, 16);
  };

  const getInputField = (propName: string) => {
    const initialValue = (initialValues as any)[propName];
    const value = (formValues as any)[propName];
    const isReadOnly = readOnlyFields.includes(propName as keyof T);

    // Date only
    if (isDateOnly(initialValue)) {
      return (
        <input
          id={propName}
          type="date"
          className={`form-input${isReadOnly ? " readonly" : ""}`}
          value={formatDateForInput(value)}
          readOnly={isReadOnly}
          onChange={(e) =>
            !isReadOnly && handleChange(propName as keyof T, e.target.value)
          }
        />
      );
    }

    // Date + Time
    if (isDateTime(initialValue)) {
      return (
        <input
          id={propName}
          type="datetime-local"
          className={`form-input${isReadOnly ? " readonly" : ""}`}
          value={formatDateTimeForInput(value)}
          readOnly={isReadOnly}
          onChange={(e) =>
            !isReadOnly &&
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
          className={`form-input-number${isReadOnly ? " readonly" : ""}`}
          value={value ?? ""}
          readOnly={isReadOnly}
          onChange={(e) =>
            !isReadOnly &&
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
          disabled={isReadOnly}
          onChange={(e) =>
            !isReadOnly && handleChange(propName as keyof T, e.target.checked)
          }
        />
      );
    }

    // Default → text
    return (
      <input
        id={propName}
        type="text"
        className={`form-input${isReadOnly ? " readonly" : ""}`}
        value={value ?? ""}
        readOnly={isReadOnly}
        onChange={(e) =>
          !isReadOnly && handleChange(propName as keyof T, e.target.value)
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
            {readOnlyFields.includes(key as keyof T) && " (readonly)"}
          </label>
          {getInputField(key)}
        </div>
      ))}
    </form>
  );
}
