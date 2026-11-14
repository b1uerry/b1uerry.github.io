'use strict';

/**
 * 让 NexT 的深色配色可以被手动切换。
 *
 * NexT 8 的深色样式全部写在 @media (prefers-color-scheme: dark) 里，
 * 只能跟随操作系统，页面上没有开关。
 *
 * 这里在 CSS 渲染阶段把每个 @media (prefers-color-scheme: dark) 块
 * 改写成 html[data-theme="dark"] 前缀的普通规则，
 * 之后由 source/_data/head.njk + body-end.njk 控制 data-theme 属性即可。
 */

const MEDIA_RE = /@media[^{]*prefers-color-scheme:\s*dark[^{]*\{/gi;

function findBlockEnd(css, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function prefixSelector(selector) {
  return selector
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const lower = s.toLowerCase();
      if (lower === ':root' || lower === 'html' || lower === ':root, html') {
        return 'html[data-theme="dark"]';
      }
      return `html[data-theme="dark"] ${s}`;
    })
    .join(', ');
}

function transformInner(inner) {
  let out = '';
  let i = 0;
  while (i < inner.length) {
    while (i < inner.length && /\s/.test(inner[i])) i++;
    if (i >= inner.length) break;

    // 跳过注释
    if (inner.startsWith('/*', i)) {
      const end = inner.indexOf('*/', i + 2);
      if (end === -1) break;
      out += inner.slice(i, end + 2) + '\n';
      i = end + 2;
      continue;
    }

    const brace = inner.indexOf('{', i);
    if (brace === -1) {
      out += inner.slice(i);
      break;
    }
    const selector = inner.slice(i, brace).trim();
    const close = findBlockEnd(inner, brace);
    if (close === -1) {
      // 结构异常，原样返回，避免破坏样式
      return null;
    }
    const body = inner.slice(brace, close + 1);
    out += prefixSelector(selector) + ' ' + body + '\n';
    i = close + 1;
  }
  return out;
}

function transform(css) {
  let result = '';
  let cursor = 0;
  let match;
  MEDIA_RE.lastIndex = 0;

  while ((match = MEDIA_RE.exec(css)) !== null) {
    const openBrace = match.index + match[0].length - 1;
    const end = findBlockEnd(css, openBrace);
    if (end === -1) break;

    const inner = css.slice(openBrace + 1, end);
    const rewritten = transformInner(inner);

    if (rewritten === null) {
      // 解析失败就整体跳过这段改写
      continue;
    }

    result += css.slice(cursor, match.index);
    result += rewritten;
    cursor = end + 1;
    MEDIA_RE.lastIndex = cursor;
  }

  result += css.slice(cursor);
  return result;
}

hexo.extend.filter.register('after_render:css', function (str) {
  if (!str || str.indexOf('prefers-color-scheme: dark') === -1) return str;
  return transform(str);
});
