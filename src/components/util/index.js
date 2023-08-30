export function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

export function formatDate(input) {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }