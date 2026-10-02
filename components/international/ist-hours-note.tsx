"use client";

import { useSyncExternalStore } from "react";

const IST_OFFSET_MINUTES = 330; // UTC+5:30

function istToLocal(minutesFromMidnightIst: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // local minutes = IST minutes - 330 - getTimezoneOffset() (which is the
  // negative of the visitor's UTC offset).
  d.setMinutes(minutesFromMidnightIst - IST_OFFSET_MINUTES - d.getTimezoneOffset());
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Client-only snapshot: returns null on the server and during hydration, so
// the local-time hint appears only after mount and for non-IST visitors.
function getLocalRange() {
  const visitorOffset = -new Date().getTimezoneOffset();
  if (visitorOffset === IST_OFFSET_MINUTES) return null;
  return `${istToLocal(9 * 60)} to ${istToLocal(21 * 60)}`;
}

const subscribe = () => () => {};
const getServerSnapshot = () => null;

/**
 * Shows the centre's hours in IST, plus the equivalent range in the
 * visitor's local timezone (computed in the browser only).
 */
export function IstHoursNote() {
  const localRange = useSyncExternalStore(
    subscribe,
    getLocalRange,
    getServerSnapshot
  );

  return (
    <p className="text-sm text-muted-foreground">
      We answer the international line Monday to Friday, 9:00 AM to 9:00 PM
      IST
      {localRange ? `, which is ${localRange} your local time` : ""}.
    </p>
  );
}
