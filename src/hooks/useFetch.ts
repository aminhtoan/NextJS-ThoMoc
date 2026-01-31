import { useCallback, useEffect, useRef, useState } from 'react'

type FetchState<T> = {
  data: T | null
  error: Error | null
  loading: boolean
}

export default function useFetch<T = any>(
  url?: string | null,
  options?: RequestInit,
  initialData: T | null = null,
  deps: any[] = []
) {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    error: null,
    loading: false
  })

  const fetchId = useRef(0)
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const doFetch = useCallback(
    async (signal?: AbortSignal) => {
      if (!url) return
      const id = ++fetchId.current
      setState(s => ({ ...s, loading: true, error: null }))

      try {
        const res = await fetch(url, { ...options, signal })
        if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`)

        // Try parse JSON, but fall back to text if not JSON
        const contentType = res.headers.get('content-type') ?? ''
        const data: T = contentType.includes('application/json')
          ? await res.json()
          : ((await res.text()) as unknown as T)

        // ensure this response is the latest and component still mounted
        if (isMounted.current && id === fetchId.current) {
          setState({ data, error: null, loading: false })
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // aborted -> do nothing
          return
        }
        if (isMounted.current && id === fetchId.current) {
          setState({ data: null, error: err instanceof Error ? err : new Error(String(err)), loading: false })
        }
      }
    },

    // include options in deps if you expect them to change
    // user-provided deps appended below in the effect dependency
    [url, options]
  )

  // refetch trigger
  const refetch = useCallback(() => {
    const controller = new AbortController()
    doFetch(controller.signal)

    return () => controller.abort()
  }, [doFetch])

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    doFetch(controller.signal)

    return () => controller.abort()

    // include user deps so caller can re-run fetch when they change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, options, doFetch, ...deps])

  return { ...state, refetch }
}
