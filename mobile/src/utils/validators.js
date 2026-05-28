export function validateEmail(value = "") {
  return /\S+@\S+\.\S+/.test(String(value).trim());
}

export function validateMobileNumber(value = "") {
  return /^\d{10,15}$/.test(String(value).trim());
}

export function validateRequired(value) {
  return String(value ?? "").trim().length > 0;
}

export function validatePincode(value = "") {
  return /^\d{4,10}$/.test(String(value).trim());
}
