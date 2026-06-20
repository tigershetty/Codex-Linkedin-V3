/**
 * Axios API client with HTTP Basic Auth.
 * All requests to the FastAPI backend go through this client.
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const USERNAME = import.meta.env.VITE_BASIC_AUTH_USERNAME || "tiger";
const PASSWORD = import.meta.env.VITE_BASIC_AUTH_PASSWORD || "";

const client = axios.create({
  baseURL: API_URL,
  auth: { username: USERNAME, password: PASSWORD },
  headers: { "Content-Type": "application/json" },
});

// ── Pipeline runs ──────────────────────────────────────────────

export const listRuns = () => client.get("/runs").then((r) => r.data);

export const getRun = (runId) =>
  client.get(`/runs/${runId}`).then((r) => r.data);

export const createRun = (week) =>
  client.post("/runs", { week }).then((r) => r.data);

export const selectTopic = (runId, topicIndex) =>
  client
    .post(`/runs/${runId}/select-topic`, { topic_index: topicIndex })
    .then((r) => r.data);

export const selectHook = (runId, hookIndex) =>
  client
    .post(`/runs/${runId}/select-hook`, { hook_index: hookIndex })
    .then((r) => r.data);

export const queueLinkedIn = (runId) =>
  client.post(`/runs/${runId}/queue-linkedin`).then((r) => r.data);

export const retryRun = (runId) =>
  client.post(`/runs/${runId}/retry`).then((r) => r.data);

export const uploadImage = (runId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return client
    .post(`/runs/${runId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

// ── Analytics ──────────────────────────────────────────────────

export const listAnalytics = () =>
  client.get("/analytics").then((r) => r.data);

export const addAnalytics = (data) =>
  client.post("/analytics", data).then((r) => r.data);

// ── Schedule ───────────────────────────────────────────────────

export const getSchedule = () =>
  client.get("/schedule").then((r) => r.data);

export const updateSchedule = (cronExpression, enabled) =>
  client
    .put("/schedule", { cron_expression: cronExpression, enabled })
    .then((r) => r.data);

export default client;
