export function search(query) {
  return fetch(`/api/public/search?q=${encodeURIComponent(query)}`).then(response => response.json());
}
