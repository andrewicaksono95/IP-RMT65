export function createError(status = 500, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
