// Import the API module
import { fetchAllAnimeNews } from './anime-api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Existing code...
    
    // News filters functionality with API integration
    const newsFilters = document.querySelectorAll('.news-filter');
    const newsGrid = document.querySelector('.news-grid');
    let newsData = []; // Store fetched news
    
    if (newsFilters.length > 0 && newsGrid) {
        // Initial news fetch
        initializeNews();
        
        // Add filter click handlers
        newsFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                newsFilters.forEach(f => f.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Show loading spinner
                document.querySelector('.loading-spinner').style.display = 'flex';
                
                // Filter news
                filterNewsByCategory(category);
            });
        });
    }
    
    // Function to initialize news data
    async function initializeNews() {
        // Show loading spinner
        const loadingSpinner = document.querySelector('.loading-spinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }
        
        try {
            // Fetch all news from APIs
            newsData = await fetchAllAnimeNews(8); // Get 8 news items initially
            
            // Display initial news (all categories)
            displayNews(newsData);
            
        } catch (error) {
            console.error('Failed to initialize news:', error);
            // Display error message
            newsGrid.innerHTML = `
                <div class="api-error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load news content. Please try again later.</p>
                    <button class="retry-button">Retry</button>
                </div>
            `;
            
            document.querySelector('.retry-button')?.addEventListener('click', initializeNews);
        } finally {
            // Hide loading spinner
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        }
    }
    
    // Function to filter news by category
    function filterNewsByCategory(category) {
        // Filter the news data
        const filteredNews = category === 'all' 
            ? newsData 
            : newsData.filter(news => news.category.toLowerCase() === category.toLowerCase());
        
        // Display filtered news
        displayNews(filteredNews);
        
        // Hide loading spinner
        document.querySelector('.loading-spinner').style.display = 'none';
    }
    
    // Function to display news in the grid
    function displayNews(newsItems) {
        // Clear current news
        newsGrid.innerHTML = '';
        
        if (newsItems.length === 0) {
            newsGrid.innerHTML = `
                <div class="no-news-message">
                    <i class="fas fa-info-circle"></i>
                    <p>No news available in this category.</p>
                </div>
            `;
            return;
        }
        
        // Create news cards
        newsItems.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card reveal';
            
            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="${news.image}" alt="${news.title}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="news-content">
                    <span class="news-category">${news.category}</span>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${news.description}</p>
                    <div class="news-meta">
                        <span class="news-source">${news.source}</span>
                        <span class="news-date">${news.date}</span>
                    </div>
                    <a href="${news.link}" class="read-more" target="_blank">Read More</a>
                </div>
            `;
            
            newsGrid.appendChild(newsCard);
        });
        
        // Trigger reveal animation
        setTimeout(() => {
            document.querySelectorAll('.news-card').forEach(card => {
                card.classList.add('revealed');
            });
        }, 100);
    }
    
    // Load more news button functionality
    const loadMoreButton = document.getElementById('load-more-news');
    if (loadMoreButton) {
        let newsPage = 1;
        
        loadMoreButton.addEventListener('click', async function() {
            // Show loading spinner
            document.querySelector('.loading-spinner').style.display = 'flex';
            
            try {
                // Get the current active filter
                const activeFilter = document.querySelector('.news-filter.active');
                const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
                
                // Fetch more news
                const moreNews = await fetchAllAnimeNews(4); // Get 4 more news items
                
                // Add to existing news data
                newsData = [...newsData, ...moreNews];
                
                // Apply current filter
                filterNewsByCategory(category);
                
                // Increment page counter
                newsPage++;
                
                // Disable load more button after a certain number of pages
                if (newsPage >= 3) {
                    loadMoreButton.disabled = true;
                    loadMoreButton.textContent = 'No More News';
                }
                
            } catch (error) {
                console.error('Failed to load more news:', error);
                document.querySelector('.loading-spinner').style.display = 'none';
                
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'api-error-message';
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load more news. Please try again later.</p>
                    <button class="retry-button">Retry</button>
                `;
                
                newsGrid.appendChild(errorMessage);
                errorMessage.querySelector('.retry-button').addEventListener('click', () => {
                    errorMessage.remove();
                    loadMoreButton.click();
                });
            }
        });
    }
    
    // Existing code...
});
