import { useEffect } from 'react'
import { registerBrowserVisit } from '../services/browserVisit'

export function useBrowserVisit(): void {
  useEffect(() => {
    void registerBrowserVisit()
  }, [])
}
