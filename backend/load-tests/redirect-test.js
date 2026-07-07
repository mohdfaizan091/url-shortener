import http from "k6/http";
import { check, sleep } from "k6";

// The 20 short codes we seeded directly into Mongo, bypassing /shorten
// entirely (that endpoint is rate-limited by CP4 and isn't what we're
// testing here — this test targets the redirect hot path only).
const SHORT_CODES = Array.from({ length: 20 }, (_, i) => `loadtest${i}`);

export const options = {
  scenarios: {
    concurrent_users: {
      executor: "constant-vus",
      vus: 200,          // 200 virtual users, sustained
      duration: "30s",
    },
  },
  thresholds: {
    // If more than 1% of requests fail, or the 95th percentile
    // latency exceeds 500ms, k6 marks the whole run as FAILED — this
    // turns "eyeball the numbers" into an actual pass/fail signal,
    // the same way a Jest assertion does for correctness tests.
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const code = SHORT_CODES[Math.floor(Math.random() * SHORT_CODES.length)];

  // Nginx (port 80), not any backend directly — we want traffic
  // distributed across all 3 instances, same as the real architecture.
  // redirects: 0 tells k6 not to automatically follow the 302 — we
  // want to measure the redirect response itself, not the destination
  // page (example.com), which has nothing to do with what we're testing.
  const res = http.get(`http://localhost/${code}`, { redirects: 0 });

  check(res, {
    "status is 302": (r) => r.status === 302,
  });

  sleep(0.1); // brief pause so 200 VUs don't fire in perfect lockstep every tick
}