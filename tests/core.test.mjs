import test from "node:test";
import assert from "node:assert/strict";
import { availableDay, parseChallenge, parseDate, readProgress, utcDate } from "../core.mjs";
import { challenges } from "../challenges.mjs";

test("calendar unlocks at UTC midnight, keeps old days and stops at 30", () => {
  assert.equal(availableDay("2026-11-24", new Date("2026-11-24T23:59:59Z")), 1);
  assert.equal(availableDay("2026-11-24", new Date("2026-11-25T00:00:00Z")), 2);
  assert.equal(availableDay("2026-11-24", new Date("2026-11-23T23:59:59Z")), 0);
  assert.equal(availableDay("2026-11-24", new Date("2027-01-01T00:00:00Z")), 30);
  assert.equal(utcDate(new Date("2026-11-24T23:30:00-03:00")), "2026-11-25");
});

test("shared links require a valid date and identifier", () => {
  const now = new Date("2026-11-24T12:00:00Z");
  const url = new URL("https://example.com/?inicio=2026-11-24&pareja=0123456789abcdef0123456789abcdef");
  assert.deepEqual(parseChallenge(url, now), { start: "2026-11-24", id: "0123456789abcdef0123456789abcdef" });
  assert.equal(parseChallenge(new URL("https://example.com/"), now), null);
  assert.equal(parseDate("2026-02-30"), null);
  url.searchParams.set("inicio", "2026-11-25");
  assert.throws(() => parseChallenge(url, now), /no es válido/);
  url.searchParams.set("inicio", "2026-11-24");
  url.searchParams.set("pareja", "invalid");
  assert.throws(() => parseChallenge(url, now), /no es válido/);
});

test("progress is validated, deduplicated and cannot reveal future days", () => {
  assert.deepEqual(readProgress("[2,1,2,4]", 2), [1, 2]);
  assert.deepEqual(readProgress(null, 2), []);
  assert.throws(() => readProgress("[0]", 2), /formato/);
  assert.throws(() => readProgress("invalid", 2));
});

test("all 30 days have a proposed challenge", () => {
  assert.equal(challenges.length, 30);
  assert.ok(challenges.every(challenge => typeof challenge === "string" && challenge.trim().length > 0));
});
