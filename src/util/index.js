import { NextResponse, NextRequest } from "next/server"
import { ResponseCookies, RequestCookies } from "next/dist/server/web/spec-extension/cookies"


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

export const toDateTime = (secs) => {
  var t = new Date("1970-01-01T00:30:00Z") // Unix epoch start.
  t.setSeconds(secs)
  return t
}

export const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) {
        return Math.floor(interval) + " years ago"
    }
    interval = seconds / 2592000
    if (interval > 1) {
        return Math.floor(interval) + " months ago"
    }
    interval = seconds / 86400
    if (interval > 1) {
        return Math.floor(interval) + " days ago"
    }
    interval = seconds / 3600
    if (interval > 1) {
        return Math.floor(interval) + " hours ago"
    }
    interval = seconds / 60
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago"
    }
    return Math.floor(seconds) + " seconds ago"
}


export const applySetCookie = (req, res) => {
	const setCookies = new ResponseCookies(res.headers)
	const newReqHeaders = new Headers(req.headers)
	const newReqCookies = new RequestCookies(newReqHeaders)
	setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie))

	NextResponse.next({
	  request: { headers: newReqHeaders },
	}).headers.forEach((value, key) => {
	  if (key === "x-middleware-override-headers" || key.startsWith("x-middleware-request-")) {
		res.headers.set(key, value)
	  }
	})
  }
