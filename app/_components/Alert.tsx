"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useAlertService } from "_services";
/*
 * The alert component renders the alert from the alert service, if the service doesn't contain
 * an alert nothing is rendered by the component.
 */
export { Alert };

function Alert() {
  const pathname = usePathname();
  const alertService = useAlertService();
  const alert = alertService.alert;

  useEffect(() => {
    // clear alert on location change
    alertService.clear();
  }, [pathname]);

  if (!alert) return null;

  return (
    <div style={{"position": "fixed", "width": "100%"}}
      className={`notification ${
        alert.type === "alert-danger" ? "is-danger" : "is-success"
      }`}
    >
      {alert.message}
      <button
        type="button"
        className="delete"
        onClick={alertService.clear}
      ></button>
    </div>
  );
}
