<script src="https://cdn.prod.website-files.com/67fce9ff038d5777166323d6/6951c4a1d462cfffbb2a0fc8_supabasesupabase-js-2.txt"></script>
<script>
const SUPABASE_URL = 'SUPABASE_URL';
const SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const WRAP_SEL = '.blogs-page__blogs-wrap';
const ITEM_SEL = '[data-article-slug]';
const RATING_SEL = '.blogs-page__blog__rating-value';
const VIEWS_SEL  = '.blogs-page__blog__views-value';

const CACHE_TTL = 30 * 60 * 1000; // 30 минут
const LS_PREFIX = 'gc_blog_stats_v1:'; // namespace
const hydrated = new WeakSet();

function fmtRating(avg, count) {
  return (count && count > 0) ? Number(avg).toFixed(1) : '—';
}

function readCache(slug) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + slug);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || !obj.ts) return null;
    if (Date.now() - obj.ts > CACHE_TTL) return null;
    return obj;
  } catch (e) {
    return null;
  }
}

function writeCache(slug, row) {
  try {
    localStorage.setItem(LS_PREFIX + slug, JSON.stringify({
      ts: Date.now(),
      avg_rating: row.avg_rating ?? 0,
      votes_count: row.votes_count ?? 0,
      views: row.views ?? 0
    }));
  } catch (e) {}
}

function paintCard(el, slug, row) {
  const ratingEl = el.querySelector(RATING_SEL);
  if (ratingEl) ratingEl.textContent = row ? fmtRating(row.avg_rating, row.votes_count) : '—';

  const viewsEl = el.querySelector(VIEWS_SEL);
  if (viewsEl) viewsEl.textContent = row ? String(row.views || 0) : '0';
}

async function hydrateBatch(wrapper) {
  const items = Array.from(wrapper.querySelectorAll(ITEM_SEL)).filter(el => !hydrated.has(el));
  if (!items.length) return;

  items.forEach(el => hydrated.add(el));

  // 1) пытаемся нарисовать из кэша и собрать slugs, которые надо догрузить
  const needFetch = [];
  const elBySlug = new Map();

  for (const el of items) {
    const slug = el.getAttribute('data-article-slug');
    if (!slug) continue;

    elBySlug.set(slug, el);

    const cached = readCache(slug);
    if (cached) {
      paintCard(el, slug, cached);
    } else {
      // плейсхолдер
      paintCard(el, slug, null);
      needFetch.push(slug);
    }
  }

  // 2) если всё было в кэше — выходим
  if (!needFetch.length) return;

  // 3) одним RPC получаем стату только для нужных slug’ов
  const { data, error } = await sb.rpc('get_articles_stats', { p_slugs: needFetch });
  if (error || !data) return;

  for (const row of data) {
    const slug = row.article_slug;
    const el = elBySlug.get(slug);
    if (!el) continue;

    writeCache(slug, row);
    paintCard(el, slug, row);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector(WRAP_SEL);
  if (!wrapper) return;

  hydrateBatch(wrapper);

  let t = null;
  const mo = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(() => hydrateBatch(wrapper), 100);
  });

  mo.observe(wrapper, { childList: true, subtree: true });
});
</script>
