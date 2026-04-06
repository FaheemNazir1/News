import React, { useEffect, useState } from 'react';
import { BookmarkX, Share2, ExternalLink, Trash2 } from 'lucide-react';

type SavedItem = {
  url: string;
  title: string;
  source?: string;
  publishDate?: string;
  savedAt?: string;
};

const STORAGE_KEY = 'saved_articles_v1';

const loadSavedMap = (): Record<string, SavedItem> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeSavedMap = (map: Record<string, SavedItem>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
};

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

const SavedPage: React.FC = () => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [shareStatusByUrl, setShareStatusByUrl] = useState<Record<string, 'idle' | 'copied'>>({});

  const refresh = () => {
    const map = loadSavedMap();
    const list = Object.values(map)
      .filter((x) => x && typeof x.url === 'string' && x.url.trim())
      .sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
    setItems(list);
  };

  useEffect(() => {
    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const canClear = items.length > 0;

  const handleRemove = (url: string) => {
    const map = loadSavedMap();
    delete map[url];
    writeSavedMap(map);
    refresh();
  };

  const handleClearAll = () => {
    writeSavedMap({});
    refresh();
  };

  const handleShare = async (item: SavedItem) => {
    const url = (item.url || '').toString();
    if (!url) return;
    const title = (item.title || '').toString();

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        // @ts-ignore
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // fall back
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareStatusByUrl((prev) => ({ ...prev, [url]: 'copied' }));
        setTimeout(() => {
          setShareStatusByUrl((prev) => ({ ...prev, [url]: 'idle' }));
        }, 1200);
      }
    } catch {
      // ignore
    }
  };

  if (!items.length) {
    return (
      <div className="bg-[#F4F5F7] min-h-screen font-sans pb-28 pt-8 px-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-forensic-dark tracking-tight leading-tight">Saved</h1>
            <div className="text-sm text-gray-500 mt-1">Your bookmarked articles</div>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={!canClear}
            className="bg-white text-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Clear all saved"
          >
            <span className="inline-flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear
            </span>
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="text-gray-400 text-6xl mb-4">🔖</div>
          <div className="text-gray-700 text-lg font-semibold mb-2">No saved articles</div>
          <div className="text-gray-500">Go to News and tap the bookmark icon on any card.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sans pb-28 pt-8 px-4">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-forensic-dark tracking-tight leading-tight">Saved</h1>
          <div className="text-sm text-gray-500 mt-1">Your bookmarked articles</div>
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          disabled={!canClear}
          className="bg-white text-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Clear all saved"
        >
          <span className="inline-flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => {
          const copied = shareStatusByUrl[it.url] === 'copied';
          return (
            <div key={it.url} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
                    {it.source || 'Saved'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(it.url, '_blank', 'noopener,noreferrer')}
                    className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Open"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(it)}
                    className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    title={copied ? 'Copied' : 'Share'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(it.url)}
                    className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 transition-colors"
                    title="Remove"
                  >
                    <BookmarkX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-gray-900 font-semibold leading-snug mb-3 line-clamp-3">{it.title}</div>

              <div className="text-xs text-gray-500 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span>{it.publishDate ? formatDate(it.publishDate) : ''}</span>
                <span>{it.savedAt ? `Saved: ${formatDate(it.savedAt)}` : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedPage;
