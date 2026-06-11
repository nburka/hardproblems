'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Walks the DOM after mount and adds a small "Copy" button to every <pre>
// block on the page. Mounted once in the root layout so it works on every
// route — the `pathname` dep on the useEffect re-runs the walk after each
// client-side navigation so newly-rendered code blocks pick up a button.
export default function CodeBlockCopyButtons() {
  const pathname = usePathname();

  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>('pre');
    blocks.forEach((pre) => {
      // Skip if the next sibling is already our button (effect re-ran or
      // we navigated back to the same content).
      const next = pre.nextElementSibling;
      if (next && next.hasAttribute('data-copy-button')) return;
      const code = pre.querySelector('code');
      // Bail on <pre> blocks that aren't code (we only add buttons to
      // standard fenced code blocks which render as <pre><code>).
      if (!code) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy-button';
      button.setAttribute('data-copy-button', '');
      button.setAttribute('aria-label', 'Copy code to clipboard');
      // Clipboard SVG (Feather-style) + label, set together via innerHTML
      // so the icon survives state changes. The label is updated by
      // flashStatus() below; the icon stays put.
      button.innerHTML = `
        <svg class="code-copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="code-copy-label">Copy</span>
      `;

      let resetTimer: ReturnType<typeof setTimeout> | null = null;
      const flashStatus = (text: string, classToAdd?: string) => {
        const label = button.querySelector('.code-copy-label');
        if (label) label.textContent = text;
        if (classToAdd) button.classList.add(classToAdd);
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          if (label) label.textContent = 'Copy';
          if (classToAdd) button.classList.remove(classToAdd);
        }, 2000);
      };

      button.addEventListener('click', async () => {
        const text = code.textContent ?? '';
        try {
          await navigator.clipboard.writeText(text);
          flashStatus('Copied', 'copied');
        } catch {
          // Clipboard API can fail under non-https or denied permissions —
          // fall back to a textarea + execCommand for the small set of
          // older browsers / edge cases.
          try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            flashStatus('Copied', 'copied');
          } catch {
            flashStatus('Failed');
          }
        }
      });

      // Place the button as the next sibling of <pre> so it visually sits
      // below the code block in normal flow.
      pre.after(button);
    });
  }, [pathname]);

  return null;
}
