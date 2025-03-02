// Resources Section Integration (Continued)
// Import the API module
import { fetchResourcesData, jikanAPI, aniListAPI } from './anime-api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Resources section if it exists
    const resourcesSection = document.getElementById('resources');
    if (resourcesSection) {
        initializeResources();
    }
    
    // Function to initialize Resources section
    async function initializeResources() {
        // Show loading state
        resourcesSection.innerHTML = `
            <div class="section-header">
                <h2>Anime & Manga Resources</h2>
                <p>Discover the best anime and manga titles</p>
            </div>
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading resources...</p>
            </div>
        `;
        
        try {
            // Fetch resources data
            const resourcesData = await fetchResourcesData();
            
            // Create resources content
            const resourcesContent = document.createElement('div');
            resourcesContent.className = 'resources-content';
            
            // Create anime resources
            const animeResources = document.createElement('div');
            animeResources.className = 'resource-category reveal';
            animeResources.innerHTML = `
                <h3>Top Anime</h3>
                <div class="resource-list anime-resources">
                    ${resourcesData.anime.map(anime => `
                        <div class="resource-item">
                            <div class="resource-image">
                                <img src="${anime.images.jpg.image_url}" alt="${anime.title}" 
                                     onerror="this.src='images/placeholder.jpg'">
                            </div>
                            <div class="resource-info">
                                <h4>${anime.title}</h4>
                                <div class="resource-meta">
                                    <span>${anime.type || 'TV'}</span>
                                    <span>⭐ ${anime.score || 'N/A'}</span>
                                </div>
                                <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No description available'}</p>
                                <a href="${anime.url}" target="_blank" class="resource-link">View Details</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <a href="https://myanimelist.net/topanime.php" target="_blank" class="view-all-link">
                    View All Top Anime
                    <i class="fas fa-arrow-right"></i>
                </a>
            `;
            
            // Create manga resources
            const mangaResources = document.createElement('div');
            mangaResources.className = 'resource-category reveal';
            mangaResources.innerHTML = `
                <h3>Popular Manga</h3>
                <div class="resource-list manga-resources">
                    ${resourcesData.manga.map(manga => {
                        // Extract title (handling MangaDex API structure)
                        let title = 'Unknown Title';
                        if (manga.attributes && manga.attributes.title) {
                            title = Object.values(manga.attributes.title)[0];
                        }
                        
                        // Extract cover image
                        let coverImage = 'images/placeholder.jpg';
                        if (manga.relationships) {
                            const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
                            if (coverArt && coverArt.id) {
                                coverImage = `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.id}.jpg`;
                            }
                        }
                        
                        return `
                            <div class="resource-item">
                                <div class="resource-image">
                                    <img src="${coverImage}" alt="${title}" 
                                         onerror="this.src='images/placeholder.jpg'">
                                </div>
                                <div class="resource-info">
                                    <h4>${title}</h4>
                                    <div class="resource-meta">
                                        ${manga.attributes.status ? `<span>${manga.attributes.status}</span>` : ''}
                                        ${manga.attributes.contentRating ? `<span>${manga.attributes.contentRating}</span>` : ''}
                                    </div>
                                    <p>${manga.attributes.description ? 
                                        Object.values(manga.attributes.description)[0].substring(0, 100) + '...' : 
                                        'No description available'}</p>
                                    <a href="https://mangadex.org/title/${manga.id}" target="_blank" class="resource-link">View Details</a>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <a href="https://mangadex.org" target="_blank" class="view-all-link">
                    Explore More Manga
                    <i class="fas fa-arrow-right"></i>
                </a>
            `;
            
            // Create streaming platforms section
            const streamingPlatforms = document.createElement('div');
            streamingPlatforms.className = 'resource-category reveal';
            streamingPlatforms.innerHTML = `
                <h3>Streaming Platforms</h3>
                <div class="platform-grid">
                    <a href="https://www.crunchyroll.com/" target="_blank" class="platform-item">
                        <i class="fas fa-play-circle"></i>
                        <h4>Crunchyroll</h4>
                        <p>World's largest anime streaming service</p>
                    </a>
                    <a href="https://www.funimation.com/" target="_blank" class="platform-item">
                        <i class="fas fa-play-circle"></i>
                        <h4>Funimation</h4>
                        <p>Anime dubbed and subbed</p>
                    </a>
                    <a href="https://www.hidive.com/" target="_blank" class="platform-item">
                        <i class="fas fa-play-circle"></i>
                        <h4>HIDIVE</h4>
                        <p>Streaming home for anime fans</p>
                    </a>
                    <a href="https://www.netflix.com/" target="_blank" class="platform-item">
                        <i class="fas fa-play-circle"></i>
                        <h4>Netflix</h4>
                        <p>Original and licensed anime content</p>
                    </a>
                </div>
            `;
            
            // Append all sections to resources content
            resourcesContent.appendChild(animeResources);
            resourcesContent.appendChild(mangaResources);
            resourcesContent.appendChild(streamingPlatforms);
            
            // Replace loading spinner with content
            resourcesSection.innerHTML = '';
            resourcesSection.innerHTML = `
                <div class="section-header">
                    <h2>Anime & Manga Resources</h2>
                    <p>Discover the best anime and manga titles</p>
                </div>
            `;
            resourcesSection.appendChild(resourcesContent);
            
            // Trigger reveal animations
            setTimeout(() => {
                document.querySelectorAll('.resource-category').forEach(category => {
                    category.classList.add('revealed');
                });
            }, 100);
            
        } catch (error) {
            console.error('Failed to load resources:', error);
            
            // Show error message
            resourcesSection.innerHTML = `
                <div class="section-header">
                    <h2>Anime & Manga Resources</h2>
                    <p>Discover the best anime and manga titles</p>
                </div>
                <div class="api-error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load resources. Please try again later.</p>
                    <button class="retry-button">Retry</button>
                </div>
            `;
            
            // Add retry functionality
            document.querySelector('.retry-button')?.addEventListener('click', initializeResources);
        }
    }
});

// 4. Community Section Integration
// Import required API functions
import { fetchCommunityData, aniListAPI } from './anime-api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Community section if it exists
    const communitySection = document.getElementById('community');
    if (communitySection) {
        initializeCommunity();
    }
    
    // Function to initialize Community section
    async function initializeCommunity() {
        // Show loading state
        communitySection.innerHTML = `
            <div class="section-header">
                <h2>Anime Community</h2>
                <p>Join discussions and discover trending content</p>
            </div>
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading community content...</p>
            </div>
        `;
        
        try {
            // Fetch community data
            const communityData = await fetchCommunityData();
            
            // Create community content
            const communityContent = document.createElement('div');
            communityContent.className = 'community-content';
            
            // Create trending anime section
            const trendingSection = document.createElement('div');
            trendingSection.className = 'community-category reveal';
            trendingSection.innerHTML = `
                <h3>Trending Anime</h3>
                <div class="trending-grid">
                    ${communityData.trending.map(anime => `
                        <div class="trending-item">
                            <div class="trending-image">
                                <img src="${anime.attributes.posterImage.medium}" alt="${anime.attributes.canonicalTitle}" 
                                     onerror="this.src='images/placeholder.jpg'">
                                <div class="trending-overlay">
                                    <span class="trending-rank">#${communityData.trending.indexOf(anime) + 1}</span>
                                </div>
                            </div>
                            <div class="trending-info">
                                <h4>${anime.attributes.canonicalTitle}</h4>
                                <div class="trending-meta">
                                    <span>${anime.attributes.subtype || 'TV'}</span>
                                    <span>${anime.attributes.status || 'Unknown'}</span>
                                </div>
                                <a href="https://kitsu.io/anime/${anime.id}" target="_blank" class="view-details">
                                    View Details
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <a href="https://kitsu.io/explore/anime" target="_blank" class="view-all-link">
                    View All Trending Anime
                    <i class="fas fa-arrow-right"></i>
                </a>
            `;
            
            // Create discussion forums section
            const forumsSection = document.createElement('div');
            forumsSection.className = 'community-category reveal';
            forumsSection.innerHTML = `
                <h3>Discussion Forums</h3>
                <div class="forums-grid">
                    <a href="https://www.reddit.com/r/anime/" target="_blank" class="forum-item">
                        <i class="fab fa-reddit-alien"></i>
                        <h4>r/anime</h4>
                        <p>Reddit's anime community</p>
                    </a>
                    <a href="https://myanimelist.net/forum/" target="_blank" class="forum-item">
                        <i class="fas fa-comments"></i>
                        <h4>MyAnimeList Forums</h4>
                        <p>Discussions on anime & manga</p>
                    </a>
                    <a href="https://www.animenewsnetwork.com/bbs/phpBB2/" target="_blank" class="forum-item">
                        <i class="fas fa-newspaper"></i>
                        <h4>ANN Forums</h4>
                        <p>Anime News Network community</p>
                    </a>
                    <a href="https://kitsu.io/explore/groups" target="_blank" class="forum-item">
                        <i class="fas fa-users"></i>
                        <h4>Kitsu Groups</h4>
                        <p>Join anime fan communities</p>
                    </a>
                </div>
            `;
            
            // Create featured discussions section (simulated, as we don't have real forum API data)
            const featuredDiscussions = document.createElement('div');
            featuredDiscussions.className = 'community-category reveal';
            featuredDiscussions.innerHTML = `
                <h3>Featured Discussions</h3>
                <div class="discussions-list">
                    <div class="discussion-item">
                        <div class="discussion-header">
                            <span class="discussion-source">r/anime</span>
                            <span class="discussion-date">Recent</span>
                        </div>
                        <h4 class="discussion-title">What anime are you watching this season?</h4>
                        <p class="discussion-excerpt">Share what you're currently watching and what you recommend to others...</p>
                        <div class="discussion-meta">
                            <span><i class="fas fa-comment"></i> 342 comments</span>
                            <span><i class="fas fa-arrow-up"></i> 1.2k upvotes</span>
                        </div>
                        <a href="https://www.reddit.com/r/anime/" target="_blank" class="discussion-link">
                            Join Discussion
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                    
                    <div class="discussion-item">
                        <div class="discussion-header">
                            <span class="discussion-source">MyAnimeList</span>
                            <span class="discussion-date">Recent</span>
                        </div>
                        <h4 class="discussion-title">Most anticipated anime of 2025</h4>
                        <p class="discussion-excerpt">With several big titles announced, what are you looking forward to the most?</p>
                        <div class="discussion-meta">
                            <span><i class="fas fa-comment"></i> 178 replies</span>
                            <span><i class="fas fa-eye"></i> 3.4k views</span>
                        </div>
                        <a href="https://myanimelist.net/forum/" target="_blank" class="discussion-link">
                            Join Discussion
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                    
                    <div class="discussion-item">
                        <div class="discussion-header">
                            <span class="discussion-source">AniList</span>
                            <span class="discussion-date">Recent</span>
                        </div>
                        <h4 class="discussion-title">How has manga publishing changed in the digital era?</h4>
                        <p class="discussion-excerpt">Discussion on the evolution of manga distribution and its impact on the industry...</p>
                        <div class="discussion-meta">
                            <span><i class="fas fa-comment"></i> 95 comments</span>
                            <span><i class="fas fa-heart"></i> 233 likes</span>
                        </div>
                        <a href="https://anilist.co/forum" target="_blank" class="discussion-link">
                            Join Discussion
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
                <a href="#" class="view-all-link" id="load-more-discussions">
                    Load More Discussions
                    <i class="fas fa-arrow-down"></i>
                </a>
            `;
            
            // Append all sections to community content
            communityContent.appendChild(trendingSection);
            communityContent.appendChild(forumsSection);
            communityContent.appendChild(featuredDiscussions);
            
            // Replace loading spinner with content
            communitySection.innerHTML = '';
            communitySection.innerHTML = `
                <div class="section-header">
                    <h2>Anime Community</h2>
                    <p>Join discussions and discover trending content</p>
                </div>
            `;
            communitySection.appendChild(communityContent);
            
            // Add event listener for "Load More Discussions"
            document.getElementById('load-more-discussions')?.addEventListener('click', function(e) {
                e.preventDefault();
                // Simulate loading more discussions
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                setTimeout(() => {
                    // Add new discussion items
                    const newDiscussions = `
                        <div class="discussion-item reveal">
                            <div class="discussion-header">
                                <span class="discussion-source">Kitsu</span>
                                <span class="discussion-date">Recent</span>
                            </div>
                            <h4 class="discussion-title">Best anime openings of all time?</h4>
                            <p class="discussion-excerpt">What are your favorite anime openings and why do they resonate with you?</p>
                            <div class="discussion-meta">
                                <span><i class="fas fa-comment"></i> 112 comments</span>
                                <span><i class="fas fa-heart"></i> 298 likes</span>
                            </div>
                            <a href="https://kitsu.io/explore/groups" target="_blank" class="discussion-link">
                                Join Discussion
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        
                        <div class="discussion-item reveal">
                            <div class="discussion-header">
                                <span class="discussion-source">MangaDex</span>
                                <span class="discussion-date">Recent</span>
                            </div>
                            <h4 class="discussion-title">Underrated manga that deserve an anime adaptation</h4>
                            <p class="discussion-excerpt">Which manga series do you think are overlooked but would make great anime?</p>
                            <div class="discussion-meta">
                                <span><i class="fas fa-comment"></i> 87 comments</span>
                                <span><i class="fas fa-bookmark"></i> 124 bookmarks</span>
                            </div>
                            <a href="https://mangadex.org/forums" target="_blank" class="discussion-link">
                                Join Discussion
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    `;
                    
                    document.querySelector('.discussions-list').insertAdjacentHTML('beforeend', newDiscussions);
                    
                    // Update button text and disable it
                    this.innerHTML = 'No More Discussions <i class="fas fa-check"></i>';
                    this.classList.add('disabled');
                    this.style.pointerEvents = 'none';
                    
                    // Trigger reveal animation for new items
                    setTimeout(() => {
                        document.querySelectorAll('.discussion-item.reveal').forEach(item => {
                            item.classList.add('revealed');
                        });
                    }, 100);
                    
                }, 1500);
            });
            
            // Trigger reveal animations
            setTimeout(() => {
                document.querySelectorAll('.community-category').forEach(category => {
                    category.classList.add('revealed');
                });
            }, 100);
            
        } catch (error) {
            console.error('Failed to load community content:', error);
            
            // Show error message
            communitySection.innerHTML = `
                <div class="section-header">
                    <h2>Anime Community</h2>
                    <p>Join discussions and discover trending content</p>
                </div>
                <div class="api-error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load community content. Please try again later.</p>
                    <button class="retry-button">Retry</button>
                </div>
            `;
            
            // Add retry functionality
            document.querySelector('.retry-button')?.addEventListener('click', initializeCommunity);
        }
    }
});

// 5. Advanced Error Handling and Fallback Content
// Add this to your main script.js to enhance error handling

// Global API error handler with fallback content
function handleAPIFailure(section, sectionName, retryFunction) {
    console.error(`Failed to load ${sectionName} section`);
    
    // Create fallback content
    section.innerHTML = `
        <div class="section-header">
            <h2>${sectionName}</h2>
            <p>Discover anime and manga content</p>
        </div>
        <div class="fallback-content">
            <div class="api-error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Temporarily Unavailable</h3>
                <p>We're having trouble connecting to our data sources right now. You can:</p>
                <ul>
                    <li>Try again in a few moments</li>
                    <li>Check our static content below</li>
                    <li>Visit again later when our services are restored</li>
                </ul>
                <button class="retry-button">Retry Now</button>
            </div>
            
            <div class="static-content">
                <h3>Popular Anime Resources</h3>
                <div class="static-links">
                    <a href="https://myanimelist.net" target="_blank" class="static-link">
                        <i class="fas fa-list"></i>
                        <span>MyAnimeList</span>
                    </a>
                    <a href="https://anilist.co" target="_blank" class="static-link">
                        <i class="fas fa-chart-line"></i>
                        <span>AniList</span>
                    </a>
                    <a href="https://kitsu.io" target="_blank" class="static-link">
                        <i class="fas fa-heart"></i>
                        <span>Kitsu</span>
                    </a>
                    <a href="https://www.anime-planet.com" target="_blank" class="static-link">
                        <i class="fas fa-planet-ringed"></i>
                        <span>Anime-Planet</span>
                    </a>
                </div>
                
                <h3>Manga Resources</h3>
                <div class="static-links">
                    <a href="https://mangadex.org" target="_blank" class="static-link">
                        <i class="fas fa-book-open"></i>
                        <span>MangaDex</span>
                    </a>
                    <a href="https://mangaplus.shueisha.co.jp" target="_blank" class="static-link">
                        <i class="fas fa-book"></i>
                        <span>MANGA Plus</span>
                    </a>
                    <a href="https://www.viz.com" target="_blank" class="static-link">
                        <i class="fas fa-book-reader"></i>
                        <span>VIZ Media</span>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Add retry functionality
    section.querySelector('.retry-button')?.addEventListener('click', retryFunction);
}

// 6. API Caching Implementation
// Add this to optimize performance and reduce API calls

// Simple caching system
const apiCache = {
    data: {},
    
    // Set cache with expiration time (default 30 minutes)
    set: function(key, data, expirationInMinutes = 30) {
        const expirationTime = new Date(new Date().getTime() + expirationInMinutes * 60000);
        this.data[key] = {
            data: data,
            expiration: expirationTime
        };
        
        // Store in localStorage for persistence
        try {
            localStorage.setItem('apiCache', JSON.stringify(this.data));
        } catch (e) {
            console.warn('LocalStorage not available or quota exceeded');
        }
    },
    
    // Get cached data if not expired
    get: function(key) {
        // First, try to load from localStorage if our cache is empty
        if (Object.keys(this.data).length === 0) {
            try {
                const storedCache = localStorage.getItem('apiCache');
                if (storedCache) {
                    this.data = JSON.parse(storedCache);
                }
            } catch (e) {
                console.warn('Error retrieving cache from localStorage');
            }
        }
        
        // Check if we have cached data
        const cachedItem = this.data[key];
        if (cachedItem) {
            const now = new Date();
            const expiration = new Date(cachedItem.expiration);
            
            // Return cached data if not expired
            if (now < expiration) {
                return cachedItem.data;
            } else {
                // Clean up expired item
                delete this.data[key];
                try {
                    localStorage.setItem('apiCache', JSON.stringify(this.data));
                } catch (e) {
                    console.warn('LocalStorage not available or quota exceeded');
                }
            }
        }
        
        return null;
    },
    
    // Clear specific cache item
    clear: function(key) {
        if (this.data[key]) {
            delete this.data[key];
            try {
                localStorage.setItem('apiCache', JSON.stringify(this.data));
            } catch (e) {
                console.warn('LocalStorage not available or quota exceeded');
            }
        }
    },
    
    // Clear all cache
    clearAll: function() {
        this.data = {};
        try {
            localStorage.removeItem('apiCache');
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
};

// Example of using the cache with API calls:
// Modify the fetchAllAnimeNews function to use caching

const fetchAllAnimeNewsWithCache = async (limit = 5) => {
    // Check cache first
    const cacheKey = `allAnimeNews_${limit}`;
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
        console.log('Using cached anime news data');
        return cachedData;
    }
    
    // If no cache, proceed with API calls
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
        
        // Process API results as before...
        
        // Cache the results for 15 minutes
        apiCache.set(cacheKey, allNews, 15);
        
        return allNews;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    } finally {
        // Hide loading spinner
        document.querySelector('.loading-spinner').style.display = 'none';
    }
};

// Add a cache refresh button to the UI (optional)
document.addEventListener('DOMContentLoaded', function() {
    const refreshDataButton = document.createElement('button');
    refreshDataButton.className = 'refresh-data-button';
    refreshDataButton.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
    
    refreshDataButton.addEventListener('click', function() {
        // Clear cache
        apiCache.clearAll();
        
        // Show refresh animation
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        this.disabled = true;
        
        // Reload the page after a short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    });
    
    // Append to header or navigation area
    document.querySelector('header')?.appendChild(refreshDataButton);
});
