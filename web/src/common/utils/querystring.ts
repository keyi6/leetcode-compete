export function toQuerystring(attr: { [k: string]: any }): string {
    return Object.entries(attr)
        .map(kv => kv
            .map(s => s.toString())
            .map(encodeURIComponent)
            .join('='))
        .join('&');
}
