import { useEffect, useState } from "react";

const useServiceWorker = (swPath = "/firebase-messaging-sw.js") => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(swPath)
        .then((reg) => {
          console.log("Service Worker Registered:", reg);
          setRegistration(reg);

          // Listen for updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  setUpdateAvailable(true);
                }
              };
            }
          };
        })
        .catch((err) =>
          console.error("Service Worker Registration Failed:", err)
        );
    }
  }, [swPath]);

  // Force update when available
  const updateServiceWorker = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  return { updateAvailable, updateServiceWorker };
};

export default useServiceWorker;

