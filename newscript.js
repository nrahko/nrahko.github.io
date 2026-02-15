const RSS_FEEDS = [
    { rssUrl: 'https://moxie.foxnews.com/feedburner/latest.xml', source: 'Fox News', color: '#ee0000' },
    { rssUrl: 'https://www.breitbart.com/feed/', source: 'Breitbart', color: '#000000' },
    { rssUrl: 'https://www.espn.com/espn/rss/news', source: 'ESPN', color: '#0072bb' },
    { rssUrl: 'https://www.newsweek.com/feed', source: 'Newsweek', color: '#0054a6' },
    { rssUrl: 'http://feeds.bbci.co.uk/news/rss.xml', source: 'BBC', color: '#bb1d1d' },
    { rssUrl: 'http://rss.cnn.com/rss/edition.rss', source: 'CNN', color: '#a6192e' },
    { rssUrl: 'https://feeds.reuters.com/reuters/topNews', source: 'Reuters', color: '#005566' },
    { rssUrl: 'https://feeds.npr.org/1001/rss.xml', source: 'NPR', color: '#e32c27' },
    { rssUrl: 'https://www.theguardian.com/uk/rss', source: 'Guardian', color: '#056da0' },
    { rssUrl: 'https://rss.cbc.ca/lineup/topstories.xml', source: 'CBC', color: '#c8102e' }
];

const GENERIC_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=150&q=80';
const CACHE_KEY = 'daily_news_cache_et';
const CACHE_EXPIRY = 2 * 60 * 1000; // 120000 ms (2 minutes)

async function fetchFeed(feed) {
    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.rssUrl)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API fail');
        const data = await response.json();
        if (data.status !== 'ok') throw new Error('Parse fail');
        return data.items.slice(0, 3).map(item => ({
            title: item.title,
            link: item.link,
            image: item.thumbnail || GENERIC_IMAGE,
            excerpt: item.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
            source: feed.source,
            sourceColor: feed.color,
            pubDate: item.pubDate
        }));
    } catch (error) {
        console.warn(`Skipped ${feed.source}:`, error);
        return [];
    }
}

async function loadNews() {
    const refreshBtn = document.getElementById('refreshBtn');
    const grid = document.getElementById('newsGrid');
    const status = document.getElementById('status');

    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Fetching from 10 sources...</div>';

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const now = Date.now();
        if (cached) {
            const data = JSON.parse(cached);
            if ((now - data.timestamp) < CACHE_EXPIRY) {
                displayNews(data.stories);
                status.textContent = `Cached: ${new Date(data.timestamp).toLocaleString('en-US', { timeZone: 'America/New_York' })} ET (${data.stories.length} stories)`;
                status.className = 'status warning';
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Now (20 Stories)';
                return;
            }
        }

        const allStories = [];
        for (const feed of RSS_FEEDS) {
            const stories = await fetchFeed(feed);
            allStories.push(...stories);
            await new Promise(r => setTimeout(r, 300));
        }

        const seen = new Set();
        const uniqueStories = allStories
            .filter(story => !seen.has(story.title + story.source) && seen.add(story.title + story.source))
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
            .slice(0, 20);

        const newsData = { stories: uniqueStories, timestamp: now };
        localStorage.setItem(CACHE_KEY, JSON.stringify(newsData));
        displayNews(uniqueStories);
        const etTime = new Date(now).toLocaleString('en-US', { timeZone: 'America/New_York' });
        status.textContent = `Fresh! ${uniqueStories.length} stories | ${etTime} ET`;
        status.className = 'status';
    } catch (error) {
        grid.innerHTML = '<div class="error"><i class="fas fa-exclamation-triangle"></i> Fetch error (check internet). Using cache if available.</div>';
        status.textContent = 'Error – Try again';
        status.className = 'status error';
        console.error('Load error:', error);
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Now (20 Stories)';
    }
}

function displayNews(stories) {
    const grid = document.getElementById('newsGrid');
    if (stories.length === 0) {
        grid.innerHTML = '<div class="error">No stories found. Refresh?</div>';
        return;
    }
    grid.innerHTML = stories.map(story => `
        <div class="news-card" onclick="window.open('${story.link}', '_blank')">
            <div class="news-image" style="background-image: url('${story.image}')">
                ${story.image === GENERIC_IMAGE ? '<div class="generic"><img src="images/eblackdiamond.png" alt="eBlackDiamond Newsfeed"></div>' : ''}
                <div class="source-badge" style="background: ${story.sourceColor}aa; color: white;">${story.source}</div>
            </div>
            <div class="news-content">
                <div class="news-headline">${story.title}</div>
                <p class="news-excerpt">${story.excerpt}</p>
                <a href="${story.link}" target="_blank" class="news-link">Read full story <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}

function clearCache() {
    localStorage.removeItem(CACHE_KEY);
    document.getElementById('status').className = 'status';
    loadNews();
}

window.addEventListener('load', loadNews);
setInterval(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && (Date.now() - JSON.parse(cached).timestamp) > CACHE_EXPIRY) {
        loadNews();
    }
}, 60 * 60 * 1000);