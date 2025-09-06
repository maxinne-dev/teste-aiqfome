// Vite supports importing raw assets with ?raw
import html from '/index.html?raw';

describe('CSP meta tag', () => {
  it('is present in index.html', () => {
    expect(html).toMatch(/Content-Security-Policy/i);
    expect(html).toMatch(/<meta[^>]+http-equiv="Content-Security-Policy"/i);
  });
});
