import { escapeHtml, sanitizeInput, stripDangerousTags } from '@shared/utils/sanitize';

describe('Input sanitize util', () => {
  it('escapes html entities', () => {
    expect(escapeHtml('<div>&"\'' + '</div>')).toBe('&lt;div&gt;&amp;&quot;&#39;&lt;/div&gt;');
  });

  it('strips script/style tags and event handlers', () => {
    const dirty = '<script>alert(1)</script><div onclick="x()">ok</div>';
    const stripped = stripDangerousTags(dirty);
    expect(stripped.toLowerCase()).not.toContain('<script>');
    expect(stripped.toLowerCase()).not.toContain('onclick');
  });

  it('sanitizes combined', () => {
    const dirty = "<img src=x onerror='hack()'>Hello";
    const safe = sanitizeInput(dirty);
    expect(safe).not.toContain('<');
    expect(safe).toContain('Hello');
  });
});

