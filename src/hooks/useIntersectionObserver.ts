import { useEffect, useRef, useState } from 'react'

interface Options extends IntersectionObserverInit {
  once?: boolean
}

export function useIntersectionObserver<T extends Element>(
  options: Options = {}
): [React.RefObject<T>, boolean] {
  const { once = true, threshold = 0.1, rootMargin, root } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        }
      },
      { threshold, rootMargin, root }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold, rootMargin, root])

  return [ref, inView]
}
