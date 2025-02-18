import { createFetch, type FetchOptions } from 'ofetch'
import { ProxyAgent } from 'undici'

export interface CustomFetchOptions extends FetchOptions {
	proxyAgent?: {
		url: string,
		rejectUnauthorized?: boolean
	}
}

const ofetch = createFetch().create({
	retryStatusCodes: [400, 408, 409, 425, 429, 500, 502, 503, 504],
	timeout: 10 * 1000,
	retry: 3,
	retryDelay: 800,
	onResponseError({ request, response, options }) {
		if (options.retry) {
			console.warn(`Request ${request} with error ${response.status} remaining retry attempts: ${options.retry}`);
		}
	},
	onRequestError({ request, error }) {
		console.error(`Request ${request} fail: ${error}`);
	},
	headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
		'accept': 'application/rss+xml',
	},
	onResponse({ request, response }) {
		if (response.redirected) {
			console.warn(`Redirecting to ${response.url} for ${request}`);
		}
	},
})

export const baseFetch = (url: string, options?: CustomFetchOptions) => {
	let agent: null | ProxyAgent = null
	const { proxyAgent } = options || {}
	const finalOptions = { ...options }
	if (proxyAgent && proxyAgent.url) {
		agent = new ProxyAgent({
			uri: proxyAgent.url,
			connect: {
				rejectUnauthorized: !!proxyAgent.rejectUnauthorized,
			}
		})
		finalOptions.dispatcher = agent
	}

	return ofetch(url, finalOptions)
}

export const getFetch = (url: string, query?: Record<string, string>, options?: CustomFetchOptions) => {
	return baseFetch(url, {
		method: 'GET',
		query,
		...options,
	})
}

export const postFetch = (url: string, body?: Record<string, any>, options?: CustomFetchOptions) => {
	return baseFetch(url, {
		method: 'POST',
		body,
		...options,
	})
}

export const putFetch = (url: string, body?: Record<string, any>, options?: CustomFetchOptions) => {
	return baseFetch(url, {
		method: 'PUT',
		body,
		...options,
	})
}

export const delFetch = (url: string, query?: Record<string, string>, options?: CustomFetchOptions) => {
	return baseFetch(url, {
		method: 'DELETE',
		query,
		...options,
	})
}
