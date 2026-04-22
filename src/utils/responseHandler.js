/**
 * Standardized response handlers
 */

export function ok(res, data) {
  return res.json({ data, timestamp: new Date().toISOString() });
}

export function created(res, data) {
  return res.status(201).json({ data, timestamp: new Date().toISOString() });
}

export function noContent(res) {
  return res.status(204).send();
}

export function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

export function notFound(res, message = "Not found") {
  return res.status(404).json({ error: message });
}

export function conflict(res, message) {
  return res.status(409).json({ error: message });
}

export function serverError(res, error) {
  return res.status(500).json({ error: error.message || "Internal server error" });
}
