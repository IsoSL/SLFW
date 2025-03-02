document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const body = document.body;
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const characterSearch = document.getElementById('character-search');
    const characterCards = document.querySelectorAll('.character-card');
    const newsFilters = document.querySelectorAll('.news-filter');
    const newsCards = document.querySelectorAll('.news-card');
    const chapterSelect = document.getElementById('chapter-select');
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            
            // Update toggle icon
            this.innerHTML = isDark ? 
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
        
        // Set initial icon based on mode
        darkModeToggle.innerHTML = body.classList.contains('dark-mode') ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Character search functionality
    if (characterSearch) {
        characterSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            characterCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const title = card.querySelector('.character-title').textContent.toLowerCase();
                const details = card.querySelector('.character-details').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || 
                    title.includes(searchTerm) || 
                    details.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // News filters functionality
    if (newsFilters.length > 0) {
        newsFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                newsFilters.forEach(f => f.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Show loading spinner
                document.querySelector('.loading-spinner').style.display = 'flex';
                
                // Simulate loading time
                setTimeout(() => {
                    newsCards.forEach(card => {
                        const cardCategory = card.querySelector('.news-category').textContent.toLowerCase();
                        
                        if (category === 'all' || cardCategory === category.toLowerCase()) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Hide loading spinner
                    document.querySelector('.loading-spinner').style.display = 'none';
                }, 500);
            });
        });
    }
    
    // Chapter/Episode select functionality
    if (chapterSelect) {
        chapterSelect.addEventListener('change', function() {
            const season = this.value;
            const chapters = document.querySelectorAll('.chapter');
            
            chapters.forEach(chapter => {
                const chapterSeason = chapter.getAttribute('data-season');
                
                if (season === 'all' || chapterSeason === season) {
                    chapter.style.display = 'flex';
                } else {
                    chapter.style.display = 'none';
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Initial check and add scroll listener
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    
    // Power system ranks interaction
    const ranks = document.querySelectorAll('.rank');
    if (ranks.length > 0) {
        ranks.forEach(rank => {
            rank.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            });
            
            rank.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 3px 10px var(--shadow-color)';
            });
        });
    }
    
    // Image lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Add active class to current nav link based on section in view
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function highlightNavOnScroll() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Shadow extraction animation (for power system section)
    const shadowExtraction = document.querySelector('.shadow-extraction');
    if (shadowExtraction) {
        // Add subtle pulse animation when in view
        window.addEventListener('scroll', function() {
            const shadowRect = shadowExtraction.getBoundingClientRect();
            if (shadowRect.top < window.innerHeight && shadowRect.bottom > 0) {
                shadowExtraction.classList.add('shadow-pulse');
            } else {
                shadowExtraction.classList.remove('shadow-pulse');
            }
        });
    }
    
    // Add CSS for shadow pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shadowPulse {
            0% { box-shadow: 0 5px 15px var(--shadow-color); }
            50% { box-shadow: 0 5px 25px var(--primary-color); }
            100% { box-shadow: 0 5px 15px var(--shadow-color); }
        }
        
        .shadow-pulse {
            animation: shadowPulse 2s infinite;
        }
        
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s, transform 0.6s;
        }
        
        .revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Load more news button functionality
    const loadMoreButton = document.getElementById('load-more-news');
    if (loadMoreButton) {
        let newsPage = 1;
        
        loadMoreButton.addEventListener('click', function() {
            // Show loading spinner
            document.querySelector('.loading-spinner').style.display = 'flex';
            
            // Simulate loading more news
            setTimeout(() => {
                // In a real implementation, you would fetch more news from an API
                // For demonstration, we'll clone existing news cards
                const newsGrid = document.querySelector('.news-grid');
                const activeFilter = document.querySelector('.news-filter.active').getAttribute('data-category');
                
                // Get visible cards that match the current filter
                const visibleCards = Array.from(newsCards).filter(card => {
                    const cardCategory = card.querySelector('.news-category').textContent.toLowerCase();
                    return activeFilter === 'all' || cardCategory === activeFilter.toLowerCase();
                });
                
                if (visibleCards.length > 0) {
                    // Clone some visible cards
                    visibleCards.slice(0, Math.min(3, visibleCards.length)).forEach(card => {
                        const clone = card.cloneNode(true);
                        // Update some content to make it look different
                        const title = clone.querySelector('.news-title');
                        title.textContent = "New: " + title.textContent;
                        
                        const date = clone.querySelector('.news-date');
                        date.textContent = new Date().toLocaleDateString();
                        
                        newsGrid.appendChild(clone);
                    });
                }
                
                // Hide loading spinner
                document.querySelector('.loading-spinner').style.display = 'none';
                
                // Increment page counter
                newsPage++;
                
                // Disable load more button after a certain number of pages
                if (newsPage >= 3) {
                    loadMoreButton.disabled = true;
                    loadMoreButton.textContent = 'No More News';
                }
            }, 1000);
        });
    }
    
    // Initialize character stat graphs if they exist
    initializeStatGraphs();
    
    function initializeStatGraphs() {
        const statContainers = document.querySelectorAll('.character-stats');
        
        statContainers.forEach(container => {
            const canvas = container.querySelector('canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const stats = JSON.parse(canvas.getAttribute('data-stats'));
            
            // Draw radar chart
            drawRadarChart(ctx, stats, canvas.width, canvas.height);
        });
    }
    
    function drawRadarChart(ctx, stats, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        // Draw axes
        const statKeys = Object.keys(stats);
        const angleStep = (Math.PI * 2) / statKeys.length;
        
        // Draw web
        for (let r = 0.2; r <= 1; r += 0.2) {
            ctx.beginPath();
            for (let i = 0; i < statKeys.length; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + radius * r * Math.cos(angle);
                const y = centerY + radius * r * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(100, 17, 255, 0.2)';
            ctx.stroke();
        }
        
        // Draw axes
        for (let i = 0; i < statKeys.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(100, 17, 255, 0.5)';
            ctx.stroke();
            
            // Draw labels
            const labelX = centerX + (radius + 15) * Math.cos(angle);
            const labelY = centerY + (radius + 15) * Math.sin(angle);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color');
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(statKeys[i], labelX, labelY);
        }
        
        // Draw stat polygon
        ctx.beginPath();
        for (let i = 0; i < statKeys.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = stats[statKeys[i]] / 100; // Assuming stats are on a 0-100 scale
            const x = centerX + radius * value * Math.cos(angle);
            const y = centerY + radius * value * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(100, 17, 255, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(100, 17, 255, 0.8)';
        ctx.stroke();
    }
});
