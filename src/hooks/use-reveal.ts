import { useEffect } from "react"

export function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12 }
    )

    const observeIfNeeded = (el: Element) => {
      if (!el.classList.contains("is-visible")) {
        observer.observe(el)
      }
    }

    document.querySelectorAll(".reveal").forEach(observeIfNeeded)

    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.classList?.contains("reveal")) {
            observeIfNeeded(node)
          }
          node.querySelectorAll?.(".reveal").forEach(observeIfNeeded)
        })
      }
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}
