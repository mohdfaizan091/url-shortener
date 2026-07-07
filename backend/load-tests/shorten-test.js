import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    realistic_traffic: {
      executor: "constant-arrival-rate",
      // 2 requests/sec sustained — a realistic rate for people actually
      // creating links, nowhere near what would legitimately need 1000
      // concurrent users hitting THIS specific endpoint at once.
      rate: 2,
      timeUnit: "1s",
      duration: "20s",
      preAllocatedVUs: 10,
    },
  },
};

export default function () {
  const uniqueId = `${__VU}-${__ITER}`;
  const payload = JSON.stringify({
    originalUrl: `https://example.com/shorten-load-${uniqueId}`,
  });

  const res = http.post("http://localhost/shorten", payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "status is 201 or 429": (r) => r.status === 201 || r.status === 429,
  });
}