/**
 * Display helpers for patient profile names.
 * DB stores first_name + last_name; the UI wants fullName + username.
 */

export const toFullName = (firstName: string, lasatName: string): string => {
  return `${firstName} ${lasatName}`.trim().replace(/\s+/g, " ");
};

export const toUsername = (firstName: string, lasatName: string): string => {
  return toFullName(firstName, lasatName).replace(/\s+/g, "").toLowerCase();
};
