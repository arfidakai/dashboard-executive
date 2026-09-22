"use client";

import { useEffect, useState } from "react";
import type { Period } from "@/src/lib/dashboard-data";
import { getSdmData, fallback as sdmFallback, type SdmData } from "@/src/lib/api/sdm";
import { getKeuanganData, fallback as keuanganFallback, type KeuanganData } from "@/src/lib/api/keuangan";
import { getSantriData, fallback as santriFallback, type SantriData } from "@/src/lib/api/santri";
import { getZawiyahData, fallback as zawiyahFallback, type ZawiyahData } from "@/src/lib/api/zawiyah";

type DashboardDataMap = {
  sdm: SdmData;
  keuangan: KeuanganData;
  santri: SantriData;
  zawiyah: ZawiyahData;
};

type DashboardDomain = keyof DashboardDataMap;

const loaders = {
  sdm: getSdmData,
  keuangan: getKeuanganData,
  santri: getSantriData,
  zawiyah: getZawiyahData,
} satisfies { [Domain in DashboardDomain]: (period: Period) => Promise<{ data: DashboardDataMap[Domain]; isFallback: boolean }> };

function getInitialData<Domain extends DashboardDomain>(domain: Domain): DashboardDataMap[Domain] {
  const initialData = { sdm: sdmFallback, keuangan: keuanganFallback, santri: santriFallback, zawiyah: zawiyahFallback };
  return initialData[domain] as DashboardDataMap[Domain];
}

export function useDashboardData<Domain extends DashboardDomain>(domain: Domain, period: Period) {
  const requestKey = `${domain}:${period}`;
  const [state, setState] = useState<{ requestKey: string; data: DashboardDataMap[Domain]; isLoading: boolean; isFallback: boolean }>({ requestKey, data: getInitialData(domain), isLoading: true, isFallback: true });

  useEffect(() => {
    let active = true;

    const load = loaders[domain] as (selectedPeriod: Period) => Promise<{ data: DashboardDataMap[Domain]; isFallback: boolean }>;
    load(period).then((result) => {
      if (active) setState({ requestKey, data: result.data, isLoading: false, isFallback: result.isFallback });
    });

    return () => { active = false; };
  }, [domain, period, requestKey]);

  return { ...state, isLoading: state.isLoading || state.requestKey !== requestKey };
}
