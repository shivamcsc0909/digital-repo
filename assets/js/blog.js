/**
 * Digital Marketing Agency - Blog Functionality
 * Blog filtering, search, and interactive features
 */

'use strict';

// ===== BLOG CONTROLLER =====
const BlogController = {
  posts: [],
  filteredPosts: [],
  currentCategory: 'all',
  currentPage: 1,
  postsPerPage: 6,
  searchTerm: '',
  isLoading: false,
  
  init() {
    console.log('📚 Blog Controller - Initializing...');
    
    this.loadBlogPosts();
    this.initCategoryFilter();
    this.initSearch();
    this.initPagination();
    this.initReadingProgress();
    this.initSocialSharing();
    this.initRelatedPosts();
    this.initComments();
    this.bindEvents();
    
    console.log('✅ Blog Controller initialized');
  },
  
  // ===== LOAD BLOG POSTS =====
  async loadBlogPosts() {
    this.setLoadingState(true);
    
    try {
      // In a real application, this would fetch from an API
      // For demo purposes, we'll use mock data
      const response = await this.fetchBlogPosts();
      this.posts = response.posts || this.getMockPosts();
      this.filteredPosts = [...this.posts];
      this.renderPosts();
      this.updatePagination();
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      this.showError('Failed to load blog posts. Please try again.');
    } finally {
      this.setLoadingState(false);
    }
  },
  
  async fetchBlogPosts() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ posts: this.getMockPosts() });
      }, 1000);
    });
  },
  
  getMockPosts() {
    return [
      {
        id: 1,
        title: "How to Rank on Google in 2025: Complete SEO Guide",
        excerpt: "Discover the latest SEO strategies and algorithm updates that will help your website rank higher in Google search results.",
        content: "Full article content here...",
        category: "seo",
        tags: ["SEO", "Google", "Ranking", "2025"],
        author: {
          name: "John Smith",
          avatar: "assets/images/team/ceo.webp",
          bio: "CEO & SEO Expert"
        },
        publishDate: "2025-01-15",
        readTime: 8,
        views: 1200,
        likes: 89,
        image: "assets/images/blog/blog-1.webp",
        featured: true
      },
      {
        id: 2,
        title: "10 Social Media Marketing Tips That Actually Work in 2025",
        excerpt: "Boost your social media engagement and ROI with these proven strategies.",
        content: "Full article content here...",
        category: "social-media",
        tags: ["Social Media", "Marketing", "Engagement", "ROI"],
        author: {
          name: "Mike Davis",
          avatar: "assets/images/team/marketing-head.webp",
          bio: "Marketing Director"
        },
        publishDate: "2025-01-12",
        readTime: 6,
        views: 950,
        likes: 67,
        image: "assets/images/blog/blog-2.webp",
        featured: false
      },
      {
        id: 3,
        title: "Advanced PPC Strategies to Maximize Your ROI in 2025",
        excerpt: "Master the latest Google Ads features and bidding strategies to reduce costs and increase conversions.",
        content: "Full article content here...",
        category: "ppc",
        tags: ["PPC", "Google Ads", "ROI", "Bidding"],
        author: {
          name: "Sarah Johnson",
          avatar: "assets/images/team/cto.webp",
          bio: "CTO & PPC Specialist"
        },
        publishDate: "2025-01-10",
        readTime: 7,
        views: 800,
        likes: 45,
        image: "assets/images/blog/blog-3.webp",
        featured: false
      },
      {
        id: 4,
        title: "SEO vs PPC: Which Strategy Should You Choose in 2025?",
        excerpt: "Confused between SEO and PPC? Learn when to use each strategy and how they complement each other.",
        content: "Full article content here...",
        category: "trends",
        tags: ["SEO", "PPC", "Strategy", "Comparison"],
        author: {
          name: "John Smith",
          avatar: "assets/images/team/ceo.webp",
          bio: "CEO & SEO Expert"
        },
        publishDate: "2025-01-08",
        readTime: 5,
        views: 1500,
        likes: 124,
        image: "assets/images/blog/seo-vs-ppc.webp",
        featured: false
      },
      {
        id: 5,
        title: "The Ultimate Content Marketing Guide for Small Businesses",
        excerpt: "Create compelling content that drives traffic, engagement, and conversions with our step-by-step guide.",
        content: "Full article content here...",
        category: "content-marketing",
        tags: ["Content Marketing", "Small Business", "Traffic", "Conversions"],
        author: {
          name: "Mike Davis",
          avatar: "assets/images/team/marketing-head.webp",
          bio: "Marketing Director"
        },
        publishDate: "2025-01-05",
        readTime: 9,
        views: 700,
        likes: 38,
        image: "assets/images/blog/content-marketing.webp",
        featured: false
      },
      {
        id: 6,
        title: "Local SEO: How to Dominate Your Local Market",
        excerpt: "Master local SEO to attract nearby customers and beat local competition.",
        content: "Full article content here...",
        category: "seo",
        tags: ["Local SEO", "Google My Business", "Local Search"],
        author: {
          name: "Sarah Johnson",
          avatar: "assets/images/team/cto.webp",
          bio: "CTO & Technical SEO Expert"
        },
        publishDate: "2025-01-03",
        readTime: 6,
        views: 1100,
        likes: 78,
        image: "assets/images/blog/local-seo.webp",
        featured: false
      }
    ];
  },
  
  // ===== CATEGORY FILTER =====
  initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const category = button.getAttribute('data-category');
        this.filterByCategory(category);
        this.updateCategoryButtons(button);
      });
    });
  },
  
  filterByCategory(category) {
    this.currentCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  },
  
  updateCategoryButtons(activeButton) {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  },
  
  // ===== SEARCH FUNCTIONALITY =====
  initSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.currentPage = 1;
        this.applyFilters();
      }, 300);
    });
    
    // Clear search
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        this.searchTerm = '';
        this.applyFilters();
      });
    }
  },
  
  // ===== APPLY FILTERS =====
  applyFilters() {
    this.filteredPosts = this.posts.filter(post => {
      // Category filter
      if (this.currentCategory !== 'all' && post.category !== this.currentCategory) {
        return false;
      }
      
      // Search filter
      if (this.searchTerm) {
        const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
        if (!searchText.includes(this.searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
    
    this.renderPosts();
    this.updatePagination();
    this.updateResultsCount();
  },
  
  // ===== RENDER POSTS =====
  renderPosts() {
    const postsContainer = document.querySelector('.blog-posts .row');
    if (!postsContainer) return;
    
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = this.filteredPosts.slice(startIndex, endIndex);
    
    if (postsToShow.length === 0) {
      this.showNoResults();
      return;
    }
    
    postsContainer.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');
    
    // Animate post cards
    this.animatePostCards();
  },
  
  createPostCard(post) {
    const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return `
      <div class="col-lg-4 col-md-6 mb-4 blog-item" data-category="${post.category}">
        <article class="blog-card" data-aos="fade-up">
          <div class="blog-image">
            <img src="${post.image}" alt="${post.title}" class="img-fluid loading="lazy">
            <div class="blog-overlay">
              <a href="blog/${this.slugify(post.title)}.html" class="read-more-btn">
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <span class="category-tag ${post.category}">${this.getCategoryName(post.category)}</span>
              <span class="read-time"><i class="fas fa-clock"></i> ${post.readTime} min</span>
            </div>
            <h3 class="blog-title">
              <a href="blog/${this.slugify(post.title)}.html">${post.title}</a>
            </h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-footer">
              <div class="author-info">
                <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                <div class="author-details">
                  <strong>${post.author.name}</strong>
                  <span>${publishDate}</span>
                </div>
              </div>
              <div class="blog-stats">
                <span><i class="fas fa-eye"></i> ${this.formatNumber(post.views)}</span>
                <span class="like-btn" data-post-id="${post.id}">
                  <i class="fas fa-heart"></i> ${post.likes}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
  },
  
  animatePostCards() {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  },
  
  // ===== PAGINATION =====
  initPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    paginationContainer.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (e.target.classList.contains('page-link')) {
        const page = parseInt(e.target.getAttribute('data-page'));
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.currentPage = page;
          this.renderPosts();
          this.updatePagination();
          this.scrollToTop();
        }
      }
    });
  },
  
  updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    
    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage - 1}">Previous</a>
      </li>
    `;
    
    // Page numbers
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(totalPages, this.currentPage + 2);
    
    if (startPage > 1) {
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
      if (startPage > 2) {
        paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <li class="page-item ${i === this.currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
      paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }
    
    // Next button
    paginationHTML += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage + 1}">Next</a>
      </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
  },
  
  // ===== READING PROGRESS =====
  initReadingProgress() {
    // Only on individual blog post pages
    if (!document.querySelector('.blog-post-content')) return;
    
    const progressBar = this.createProgressBar();
    
    window.addEventListener('scroll', () => {
      const article = document.querySelector('.blog-post-content');
      if (!article) return;
      
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;
      
      const articleBottom = articleTop + articleHeight - windowHeight;
      const progress = Math.max(0, Math.min(100, ((scrollTop - articleTop) / (articleBottom - articleTop)) * 100));
      
      progressBar.style.width = progress + '%';
    });
  },
  
  createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress';
    progressContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 1000;
      background: rgba(37, 99, 235, 0.1);
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #10b981);
      width: 0%;
      transition: width 0.1s ease;
    `;
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    return progressBar;
  },
  
  // ===== SOCIAL SHARING =====
  initSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-share-btn');
    
    shareButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.getAttribute('data-platform');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        this.shareOnPlatform(platform, url, title);
      });
    });
    
    // Copy link functionality
    const copyLinkBtn = document.querySelector('.copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        this.copyToClipboard(window.location.href);
        this.showToast('Link copied to clipboard!');
      });
    }
  },
  
  shareOnPlatform(platform, url, title) {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title} ${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=Check out this article: ${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  },
  
  // ===== RELATED POSTS =====
  initRelatedPosts() {
    const relatedContainer = document.querySelector('.related-posts');
    if (!relatedContainer) return;
    
    const currentPostId = this.getCurrentPostId();
    const currentPost = this.posts.find(post => post.id === currentPostId);
    
    if (!currentPost) return;
    
    const relatedPosts = this.getRelatedPosts(currentPost, 3);
    this.renderRelatedPosts(relatedPosts, relatedContainer);
  },
  
  getRelatedPosts(currentPost, limit = 3) {
    const related = this.posts
      .filter(post => post.id !== currentPost.id)
      .map(post => ({
        ...post,
        score: this.calculateRelatedness(currentPost, post)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return related;
  },
  
  calculateRelatedness(post1, post2) {
    let score = 0;
    
    // Same category
    if (post1.category === post2.category) {
      score += 10;
    }
    
    // Common tags
    const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
    score += commonTags.length * 3;
    
    // Same author
    if (post1.author.name === post2.author.name) {
      score += 2;
    }
    
    return score;
  },
  
  renderRelatedPosts(posts, container) {
    const html = posts.map(post => `
      <div class="col-md-4">
        <div class="related-post-card">
          <div class="related-post-image">
            <img src="${post.image}" alt="${post.title}" class="img-fluid">
          </div>
          <div class="related-post-content">
            <h4><a href="blog/${this.slugify(post.title)}.html">${post.title}</a></h4>
            <p>${post.excerpt.substring(0, 100)}...</p>
            <div class="related-post-meta">
              <span class="category-tag ${post.category}">${this.getCategoryName(post.category)}</span>
              <span class="read-time">${post.readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `
      <div class="row">
        <div class="col-12">
          <h3>Related Articles</h3>
        </div>
        ${html}
      </div>
    `;
  },
  
  // ===== COMMENTS SYSTEM =====
  initComments() {
    const commentsContainer = document.querySelector('.comments-section');
    if (!commentsContainer) return;
    
    this.loadComments();
    this.initCommentForm();
  },
  
  loadComments() {
    const postId = this.getCurrentPostId();
    const comments = this.getCommentsForPost(postId);
    
    const commentsContainer = document.querySelector('.comments-list');
    if (!commentsContainer) return;
    
    if (comments.length === 0) {
      commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }
    
    const html = comments.map(comment => this.createCommentHTML(comment)).join('');
    commentsContainer.innerHTML = html;
  },
  
  createCommentHTML(comment) {
    const commentDate = new Date(comment.date).toLocaleDateString();
    
    return `
      <div class="comment" data-comment-id="${comment.id}">
        <div class="comment-avatar">
          <img src="${comment.author.avatar || 'assets/images/default-avatar.webp'}" alt="${comment.author.name}">
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <strong class="comment-author">${comment.author.name}</strong>
            <span class="comment-date">${commentDate}</span>
            <button class="comment-reply-btn" data-comment-id="${comment.id}">Reply</button>
          </div>
          <div class="comment-text">${comment.content}</div>
          ${comment.replies ? this.createRepliesHTML(comment.replies) : ''}
        </div>
      </div>
    `;
  },
  
  createRepliesHTML(replies) {
    if (!replies || replies.length === 0) return '';
    
    const html = replies.map(reply => `
      <div class="comment-reply">
        <div class="comment-avatar">
          <img src="${reply.author.avatar || 'assets/images/default-avatar.webp'}" alt="${reply.author.name}">
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <strong class="comment-author">${reply.author.name}</strong>
            <span class="comment-date">${new Date(reply.date).toLocaleDateString()}</span>
          </div>
          <div class="comment-text">${reply.content}</div>
        </div>
      </div>
    `).join('');
    
    return `<div class="comment-replies">${html}</div>`;
  },
  
  initCommentForm() {
    const commentForm = document.getElementById('commentForm');
    if (!commentForm) return;
    
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitComment(commentForm);
    });
  },
  
  submitComment(form) {
    const formData = new FormData(form);
    const comment = {
      id: Date.now(),
      postId: this.getCurrentPostId(),
      author: {
        name: formData.get('name'),
        email: formData.get('email'),
        website: formData.get('website'),
        avatar: null
      },
      content: formData.get('comment'),
      date: new Date().toISOString(),
      replies: []
    };
    
    // Save comment (in real app, this would be sent to server)
    this.saveComment(comment);
    
    // Show success message
    this.showToast('Comment submitted successfully!');
    
    // Reset form
    form.reset();
    
    // Reload comments
    this.loadComments();
  },
  
  // ===== UTILITY METHODS =====
  setLoadingState(isLoading) {
    this.isLoading = isLoading;
    const loader = document.querySelector('.blog-loader');
    const content = document.querySelector('.blog-content');
    
    if (loader && content) {
      if (isLoading) {
        loader.style.display = 'block';
        content.style.opacity = '0.5';
      } else {
        loader.style.display = 'none';
        content.style.opacity = '1';
      }
    }
  },
  
  showNoResults() {
    const postsContainer = document.querySelector('.blog-posts .row');
    if (!postsContainer) return;
    
    postsContainer.innerHTML = `
      <div class="col-12">
        <div class="no-results text-center py-5">
          <i class="fas fa-search fa-3x text-muted mb-3"></i>
          <h3>No posts found</h3>
          <p class="text-muted">Try adjusting your search terms or browse different categories.</p>
          <button class="btn btn-primary" onclick="BlogController.clearFilters()">Show All Posts</button>
        </div>
      </div>
    `;
  },
  
  clearFilters() {
    this.currentCategory = 'all';
    this.searchTerm = '';
    this.currentPage = 1;
    
    // Reset UI
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) searchInput.value = '';
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
    });
    
    this.applyFilters();
  },
  
  updateResultsCount() {
    const countElement = document.querySelector('.results-count');
    if (!countElement) return;
    
    const total = this.filteredPosts.length;
    const start = (this.currentPage - 1) * this.postsPerPage + 1;
    const end = Math.min(start + this.postsPerPage - 1, total);
    
    countElement.textContent = `Showing ${start}-${end} of ${total} posts`;
  },
  
  showError(message) {
    const errorContainer = document.querySelector('.blog-error');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          ${message}
        </div>
      `;
    }
  },
  
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
  
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  },
  
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  },
  
  getCategoryName(category) {
    const categories = {
      'seo': 'SEO',
      'ppc': 'PPC',
      'social-media': 'Social Media',
      'content-marketing': 'Content',
      'trends': 'Trends',
      'email-marketing': 'Email'
    };
    
    return categories[category] || category;
  },
  
  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },
  
  getCurrentPostId() {
    // Extract post ID from URL or page data
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
  },
  
  getCommentsForPost(postId) {
    // Mock comments data
    return [
      {
        id: 1,
        postId: postId,
        author: { name: 'Alice Johnson', email: 'alice@example.com' },
        content: 'Great article! Very informative and well-written.',
        date: '2025-01-16',
        replies: [
          {
            id: 2,
            author: { name: 'Blog Author', email: 'admin@digitalpro.com' },
            content: 'Thank you for the feedback! Glad you found it helpful.',
            date: '2025-01-16'
          }
        ]
      }
    ];
  },
  
  saveComment(comment) {
    // In a real app, this would save to a database
    console.log('Comment saved:', comment);
  },
  
  // ===== EVENT BINDING =====
  bindEvents() {
    // Like button functionality
    document.addEventListener('click', (e) => {
      if (e.target.closest('.like-btn')) {
        const likeBtn = e.target.closest('.like-btn');
        const postId = parseInt(likeBtn.getAttribute('data-post-id'));
        this.toggleLike(postId, likeBtn);
      }
    });
    
    // Infinite scroll (optional)
    if (this.shouldUseInfiniteScroll()) {
      this.initInfiniteScroll();
    }
  },
  
  toggleLike(postId, button) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    
    const liked = button.classList.contains('liked');
    
    if (liked) {
      post.likes--;
      button.classList.remove('liked');
    } else {
      post.likes++;
      button.classList.add('liked');
    }
    
    button.querySelector('i').nextSibling.textContent = ` ${post.likes}`;
    
    // Animate button
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  },
  
  shouldUseInfiniteScroll() {
    return document.querySelector('.infinite-scroll') !== null;
  },
  
  initInfiniteScroll() {
    let isLoadingMore = false;
    
    window.addEventListener('scroll', () => {
      if (isLoadingMore) return;
      
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= documentHeight - 500) {
        this.loadMorePosts();
      }
    });
  },
  
  loadMorePosts() {
    if (this.currentPage * this.postsPerPage >= this.filteredPosts.length) {
      return; // No more posts to load
    }
    
    this.currentPage++;
    this.renderAdditionalPosts();
  },
  
  renderAdditionalPosts() {
    const postsContainer = document.querySelector('.blog-posts .row');
    if (!postsContainer) return;
    
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = this.filteredPosts.slice(startIndex, endIndex);
    
    const newPostsHTML = postsToShow.map(post => this.createPostCard(post)).join('');
    postsContainer.insertAdjacentHTML('beforeend', newPostsHTML);
    
    // Animate new posts
    const newCards = postsContainer.querySelectorAll('.blog-card:nth-last-child(-n+' + postsToShow.length + ')');
    newCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
};

// ===== CSS INJECTION =====
const blogStyles = `
  .toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: #28a745;
    color: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 9999;
  }
  
  .toast-notification.show {
    transform: translateX(0);
  }
  
  .toast-error {
    background: #dc3545;
  }
  
  .liked {
    color: #dc3545 !important;
  }
  
  .blog-loader {
    text-align: center;
    padding: 40px;
  }
  
  .no-results {
    color: #6c757d;
  }
  
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    z-index: 1000;
  }
  
  .comment {
    border-bottom: 1px solid #eee;
    padding: 20px 0;
  }
  
  .comment-avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .comment-replies {
    margin-left: 40px;
    margin-top: 15px;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = blogStyles;
document.head.appendChild(styleSheet);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  BlogController.init();
});

// ===== GLOBAL ACCESS =====
window.BlogController = BlogController;