// /types/FormFields.ts

// Generic dictionary type for forms
export type FormFields<T> = {
    [K in keyof T]?: T[K]; // optional so form can start empty
  };
  