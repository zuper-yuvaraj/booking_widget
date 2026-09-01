'use client';
import { useState } from 'react';

export function useQueryParams() {
  const [params] = useState<URLSearchParams>(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  return params;
}
