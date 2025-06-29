import ogs from 'open-graph-scraper';
import fs from 'fs-extra';
import path from 'path';

export interface OGPData {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
  favicon?: string;
}

const OGP_CACHE_DIR = path.join(process.cwd(), '.ogp-cache');

// キャッシュディレクトリの作成
async function ensureCacheDir() {
  await fs.ensureDir(OGP_CACHE_DIR);
}

// URLからキャッシュファイル名を生成
function getCacheFileName(url: string): string {
  const encoded = Buffer.from(url).toString('base64').replace(/[/+=]/g, '_');
  return `${encoded}.json`;
}

// キャッシュからOGPデータを読み込み
async function loadFromCache(url: string): Promise<OGPData | null> {
  try {
    const cacheFile = path.join(OGP_CACHE_DIR, getCacheFileName(url));
    const exists = await fs.pathExists(cacheFile);
    
    if (!exists) return null;
    
    const stats = await fs.stat(cacheFile);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // 1週間以上古いキャッシュは無効
    if (stats.mtime < oneWeekAgo) {
      await fs.remove(cacheFile);
      return null;
    }
    
    const data = await fs.readJson(cacheFile);
    return data;
  } catch (error) {
    console.warn(`Failed to load OGP cache for ${url}:`, error);
    return null;
  }
}

// OGPデータをキャッシュに保存
async function saveToCache(url: string, data: OGPData): Promise<void> {
  try {
    await ensureCacheDir();
    const cacheFile = path.join(OGP_CACHE_DIR, getCacheFileName(url));
    await fs.writeJson(cacheFile, data);
  } catch (error) {
    console.warn(`Failed to save OGP cache for ${url}:`, error);
  }
}

// OGPデータを取得（キャッシュ付き）
export async function fetchOGPData(url: string): Promise<OGPData> {
  try {
    // キャッシュから読み込み
    const cached = await loadFromCache(url);
    if (cached) {
      return cached;
    }

    // OGPデータを取得
    const { result } = await ogs({
      url,
      timeout: 5000,
      retries: 2,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGP-Bot/1.0)',
      },
    });

    const ogpData: OGPData = {
      url,
      title: result.ogTitle || result.twitterTitle || result.dcTitle || undefined,
      description: result.ogDescription || result.twitterDescription || result.dcDescription || undefined,
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || undefined,
      siteName: result.ogSiteName || undefined,
      favicon: result.favicon || undefined,
    };

    // キャッシュに保存
    await saveToCache(url, ogpData);
    
    return ogpData;
  } catch (error) {
    console.warn(`Failed to fetch OGP data for ${url}:`, error);
    
    // エラー時はURLのみを返す
    const fallbackData: OGPData = { url };
    return fallbackData;
  }
}

// 複数のURLのOGPデータを並行取得
export async function fetchMultipleOGPData(urls: string[]): Promise<Map<string, OGPData>> {
  const results = new Map<string, OGPData>();
  
  const promises = urls.map(async (url) => {
    const data = await fetchOGPData(url);
    results.set(url, data);
  });
  
  await Promise.allSettled(promises);
  return results;
}

// OGPリンクカードのHTMLを生成
export function generateOGPCard(data: OGPData): string {
  const { title, description, image, url, siteName } = data;
  
  const displayTitle = title || 'リンク';
  const displayDescription = description || '';
  const displaySiteName = siteName || new URL(url).hostname;
  
  return `
    <div class="ogp-card border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 my-6">
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="block no-underline">
        <div class="flex flex-col sm:flex-row">
          ${image ? `
            <div class="sm:w-1/3 flex-shrink-0">
              <img src="${image}" alt="${displayTitle}" class="w-full h-48 sm:h-full object-cover" loading="lazy">
            </div>
          ` : ''}
          <div class="p-4 flex-1 ${!image ? 'sm:p-6' : ''}">
            <h3 class="font-semibold text-gray-900 line-clamp-2 mb-2">${displayTitle}</h3>
            ${displayDescription ? `
              <p class="text-gray-600 text-sm line-clamp-3 mb-3">${displayDescription}</p>
            ` : ''}
            <div class="flex items-center text-xs text-gray-500">
              <span class="truncate">${displaySiteName}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `.trim();
}