// anime-api.js - Module for handling anime/manga API integrations

// API Configuration 
const API_CONFIG = {
    jikan: {
        baseUrl: 'https://api.jikan.moe/v4',
        endpoints: {
            animeNews: '/anime/{id}/news',
            topAnime: '/top/anime',
            seasonal: '/seasons/now',
            manga: '/manga/{id}'
        }
    },
    kitsu: {
        baseUrl: 'https://kitsu.io/api/edge',
        endpoints: {
            trending: '/trending/anime',
            anime: '/anime',
            manga: '/manga'
        }
    },
    aniList: {
        baseUrl: 'https://graphql.anilist.co',
        endpoints: {
            graphql: '/'
        }
    },
    mangaDex: {
        baseUrl: 'https://api.mangadex.org',
        endpoints: {
            manga: '/manga',
            chapter: '/chapter'
        }
    },
    animeNewsNetwork: {
        baseUrl: 'https://www.animenewsnetwork.com/api',
        endpoints: {
            news: '/news.xml'
        }
    }
};

// Error handling function
const handleApiError = (error, apiName) => {
    console.error(`Error fetching data from ${apiName} API:`, error);
    
    // Show error message to user
    const newsContainer = document.querySelector('.news-grid');
    if (newsContainer && newsContainer.querySelector('.loading-spinner')) {
        newsContainer.querySelector('.loading-spinner').style.display = 'none';
    }
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'api-error-message';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>Unable to load content from ${apiName}. Please try again later.</p>
        <button class="retry-button">Retry</button>
    `;
    
    // Add retry functionality
    if (newsContainer) {
        newsContainer.appendChild(errorMessage);
        errorMessage.querySelector('.retry-button').addEventListener('click', () => {
            errorMessage.remove();
            // Show loading spinner again
            if (newsContainer.querySelector('.loading-spinner')) {
                newsContainer.querySelector('.loading-spinner').style.display = 'flex';
            }
            // Retry the last API call based on current filter
            const activeFilter = document.querySelector('.news-filter.active');
            if (activeFilter) {
                fetchNewsByCategory(activeFilter.getAttribute('data-category'));
            }
        });
    }
    
    return null;
};

// Function to parse XML (for Anime News Network API)
const parseXML = (xmlString) => {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
};

// Jikan API (MyAnimeList)
const jikanAPI = {
    getTopAnime: async (limit = 10) => {
        try {
            const response = await fetch(`${API_CONFIG.jikan.baseUrl}${API_CONFIG.jikan.endpoints.topAnime}?limit=${limit}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'Jikan');
        }
    },
    
    getSeasonalAnime: async (limit = 10) => {
        try {
            const response = await fetch(`${API_CONFIG.jikan.baseUrl}${API_CONFIG.jikan.endpoints.seasonal}?limit=${limit}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'Jikan');
        }
    },
    
    getAnimeNews: async (animeId) => {
        try {
            const endpoint = API_CONFIG.jikan.endpoints.animeNews.replace('{id}', animeId);
            const response = await fetch(`${API_CONFIG.jikan.baseUrl}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'Jikan');
        }
    }
};

// Kitsu API
const kitsuAPI = {
    getTrendingAnime: async (limit = 10) => {
        try {
            const response = await fetch(`${API_CONFIG.kitsu.baseUrl}${API_CONFIG.kitsu.endpoints.trending}?page[limit]=${limit}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'Kitsu');
        }
    },
    
    getAnimeByCategory: async (category, limit = 10) => {
        try {
            const response = await fetch(`${API_CONFIG.kitsu.baseUrl}${API_CONFIG.kitsu.endpoints.anime}?filter[categories]=${category}&page[limit]=${limit}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'Kitsu');
        }
    }
};

// AniList API (GraphQL)
const aniListAPI = {
    getAnimeInfo: async (title) => {
        try {
            const query = `
                query ($search: String) {
                    Media (search: $search, type: ANIME) {
                        id
                        title {
                            romaji
                            english
                        }
                        description
                        coverImage {
                            large
                        }
                        bannerImage
                        genres
                        episodes
                        status
                        averageScore
                        siteUrl
                    }
                }
            `;
            
            const variables = { search: title };
            
            const response = await fetch(API_CONFIG.aniList.baseUrl + API_CONFIG.aniList.endpoints.graphql, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query, variables })
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'AniList');
        }
    },
    
    getRecentAnimeNews: async (limit = 10) => {
        try {
            const query = `
                query {
                    Page(page: 1, perPage: ${limit}) {
                        media(type: ANIME, sort: TRENDING_DESC) {
                            id
                            title {
                                romaji
                                english
                            }
                            description
                            coverImage {
                                large
                            }
                            genres
                            siteUrl
                            trending
                            popularity
                        }
                    }
                }
            `;
            
            const response = await fetch(API_CONFIG.aniList.baseUrl + API_CONFIG.aniList.endpoints.graphql, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query })
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'AniList');
        }
    }
};

// MangaDex API
const mangaDexAPI = {
    getPopularManga: async (limit = 10) => {
        try {
            const response = await fetch(`${API_CONFIG.mangaDex.baseUrl}${API_CONFIG.mangaDex.endpoints.manga}?limit=${limit}&order[rating]=desc`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'MangaDex');
        }
    },
    
    getMangaById: async (id) => {
        try {
            const response = await fetch(`${API_CONFIG.mangaDex.baseUrl}${API_CONFIG.mangaDex.endpoints.manga}/${id}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'MangaDex');
        }
    },
    
    getLatestChapters: async (limit = 10) => {
        try {
            const response = await fetch(`${API_CONFIG.mangaDex.baseUrl}${API_CONFIG.mangaDex.endpoints.chapter}?limit=${limit}&order[publishAt]=desc&includes[]=manga`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            return handleApiError(error, 'MangaDex');
        }
    }
};

// Anime News Network API
const animeNewsNetworkAPI = {
    getLatestNews: async () => {
        try {
            // ANN API requires CORS handling, might need a proxy
            const corsProxy = 'https://cors-anywhere.herokuapp.com/';
            const response = await fetch(corsProxy + API_CONFIG.animeNewsNetwork.baseUrl + API_CONFIG.animeNewsNetwork.endpoints.news);
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const xmlText = await response.text();
            const xmlDoc = parseXML(xmlText);
            
            // Parse XML to get news items
            const newsItems = xmlDoc.querySelectorAll('item');
            const parsedNews = Array.from(newsItems).map(item => {
                return {
                    title: item.querySelector('title')?.textContent || '',
                    link: item.querySelector('link')?.textContent || '',
                    description: item.querySelector('description')?.textContent || '',
                    date: item.querySelector('pubDate')?.textContent || '',
                    thumbnail: item.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url') || ''
                };
            });
            
            return parsedNews;
        } catch (error) {
            return handleApiError(error, 'Anime News Network');
        }
    }
};

// Main function to fetch all news (combines multiple sources)
const fetchAllAnimeNews = async (limit = 5) => {
    const allNews = [];
    
    // Show loading spinner
    document.querySelector('.loading-spinner').style.display = 'flex';
    
    try {
        // Get news from multiple sources
        const [jikanTopAnime, aniListNews, annNews] = await Promise.allSettled([
            jikanAPI.getTopAnime(limit),
            aniListAPI.getRecentAnimeNews(limit),
            animeNewsNetworkAPI.getLatestNews()
        ]);
        
        // Process Jikan results
        if (jikanTopAnime.status === 'fulfilled' && jikanTopAnime.value && jikanTopAnime.value.data) {
            jikanTopAnime.value.data.forEach(anime => {
                allNews.push({
                    title: `New Anime: ${anime.title}`,
                    image: anime.images.jpg.image_url,
                    date: new Date().toLocaleDateString(),
                    category: 'Anime',
                    source: 'MyAnimeList',
                    link: anime.url,
                    description: anime.synopsis?.substring(0, 150) + '...' || ''
                });
            });
        }
        
        // Process AniList results
        if (aniListNews.status === 'fulfilled' && aniListNews.value && aniListNews.value.data) {
            aniListNews.value.data.Page.media.forEach(anime => {
                allNews.push({
                    title: anime.title.english || anime.title.romaji,
                    image: anime.coverImage.large,
                    date: new Date().toLocaleDateString(),
                    category: 'Anime',
                    source: 'AniList',
                    link: anime.siteUrl,
                    description: anime.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || ''
                });
            });
        }
        
        // Process Anime News Network results
        if (annNews.status === 'fulfilled' && annNews.value) {
            annNews.value.forEach(news => {
                allNews.push({
                    title: news.title,
                    image: news.thumbnail || 'placeholder.jpg',
                    date: new Date(news.date).toLocaleDateString(),
                    category: 'Anime',
                    source: 'Anime News Network',
                    link: news.link,
                    description: news.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || ''
                });
            });
        }
        
        // Get manga news from MangaDex
        const mangaDexNews = await mangaDexAPI.getLatestChapters(limit);
        if (mangaDexNews && mangaDexNews.data) {
            mangaDexNews.data.forEach(chapter => {
                let mangaTitle = "New Chapter Available";
                // Extract manga title if available
                if (chapter.relationships) {
                    const mangaRelation = chapter.relationships.find(rel => rel.type === 'manga');
                    if (mangaRelation && mangaRelation.attributes && mangaRelation.attributes.title) {
                        mangaTitle = Object.values(mangaRelation.attributes.title)[0];
                    }
                }
                
                allNews.push({
                    title: `${mangaTitle} - Chapter ${chapter.attributes.chapter}`,
                    image: 'placeholder.jpg', // MangaDex doesn't provide chapter images directly
                    date: new Date(chapter.attributes.publishAt).toLocaleDateString(),
                    category: 'Manhwa',
                    source: 'MangaDex',
                    link: `https://mangadex.org/chapter/${chapter.id}`,
                    description: chapter.attributes.title || 'New chapter available'
                });
            });
        }
        
        // Add some merchandise news (simulated as these APIs don't typically provide merchandise info)
        const merchandiseNews = [
            {
                title: 'New Demon Slayer Figure Collection',
                image: 'placeholder.jpg',
                date: new Date().toLocaleDateString(),
                category: 'Merchandise',
                source: 'Merchandise Update',
                link: '#',
                description: 'New collectible figures from Demon Slayer have been announced, featuring Tanjiro, Nezuko, and Zenitsu in dynamic poses.'
            },
            {
                title: 'Limited Edition My Hero Academia Apparel',
                image: 'placeholder.jpg',
                date: new Date().toLocaleDateString(),
                category: 'Merchandise',
                source: 'Merchandise Update',
                link: '#',
                description: 'Exclusive t-shirts and hoodies inspired by the popular anime My Hero Academia are now available for pre-order.'
            }
        ];
        
        allNews.push(...merchandiseNews);
        
        // Shuffle and sort by date
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return allNews;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    } finally {
        // Hide loading spinner
        document.querySelector('.loading-spinner').style.display = 'none';
    }
};

// Function to fetch anime/manga data for Resources section
const fetchResourcesData = async () => {
    try {
        // Get top anime and manga
        const [topAnime, topManga] = await Promise.all([
            jikanAPI.getTopAnime(5),
            mangaDexAPI.getPopularManga(5)
        ]);
        
        return {
            anime: topAnime?.data || [],
            manga: topManga?.data || []
        };
    } catch (error) {
        console.error('Error fetching resources data:', error);
        return { anime: [], manga: [] };
    }
};

// Function to fetch community data (trending discussions, etc.)
const fetchCommunityData = async () => {
    try {
        // Get trending anime from Kitsu
        const trendingAnime = await kitsuAPI.getTrendingAnime(5);
        
        return {
            trending: trendingAnime?.data || [],
            discussions: [] // In a real implementation, you might fetch from a forum API
        };
    } catch (error) {
        console.error('Error fetching community data:', error);
        return { trending: [], discussions: [] };
    }
};

// Export all API functions
export {
    fetchAllAnimeNews,
    fetchResourcesData,
    fetchCommunityData,
    jikanAPI,
    kitsuAPI,
    aniListAPI,
    mangaDexAPI,
    animeNewsNetworkAPI
};
