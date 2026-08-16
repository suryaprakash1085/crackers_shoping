import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Admin → Services (Management sidebar) manages these DB records — this is
// what visitors should see on the public /services page. It's separate from
// the "Service Cards" static content editable in Admin → Services Content;
// both are rendered together so neither admin screen is a dead end.
export interface AdminService {
  id: number;
  name: string;
  description: string;
  price: number;
}

export function useServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<{ data: any[] }>("/services");
        if (!cancelled) {
          setServices(
            (res.data || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              description: s.description || "",
              price: Number(s.price) || 0,
            })),
          );
        }
      } catch {
        if (!cancelled) setServices([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { services, loading };
}
