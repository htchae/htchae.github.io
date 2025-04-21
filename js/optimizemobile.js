// VERSION 1:

function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.classList.add('reduce-motion');

    // Reduce the number of masonry items initially loaded on mobile
    const masonryItems = document.querySelectorAll('.masonry-item');
    if (masonryItems.length > 12) {
      // Show only first 12 items immediately
      masonryItems.forEach((item, index) => {
        if (index >= 12) {
          item.style.visibility = 'hidden';
          item.style.position = 'absolute';

          // Load them later with staggered timing
          setTimeout(() => {
            requestAnimationFrame(() => {
              item.style.visibility = '';
              item.style.position = '';
            });
          }, 3000 + (index - 12) * 100); // Staggered loading
        }
      });
    }

    // Optimize image loading on mobile
    document.querySelectorAll('img').forEach((img) => {
      // Skip critical images
      if (img.closest('#home') || img.closest('#carousel-section')) {
        return;
      }

      // Add loading="lazy" to all non-critical images
      img.setAttribute('loading', 'lazy');

      // Add decoding="async" for parallel decoding
      img.setAttribute('decoding', 'async');
    });
  }
}

//   VERSION 2:

function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.classList.add('reduce-motion');

    // Load fewer images at once on mobile
    const hiddenItems = document.querySelectorAll(
      '.masonry-item:nth-child(n+15)'
    );
    hiddenItems.forEach((item) => {
      item.style.visibility = 'hidden';
      item.style.position = 'absolute';

      // Load them later
      setTimeout(() => {
        item.style.visibility = '';
        item.style.position = '';
      }, 3000);
    });
  }
}

// VERSION 3:

function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.classList.add('reduce-motion');

    // Delay loading of non-visible masonry items
    const hiddenItems = document.querySelectorAll(
      '.masonry-item:nth-child(n+10)'
    );

    hiddenItems.forEach((item) => {
      // Use visibility instead of display to maintain layout
      item.style.visibility = 'hidden';
      item.style.opacity = '0';

      // Lazily reveal them as user scrolls
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                item.style.visibility = '';
                item.style.opacity = '1';
                item.style.transition = 'opacity 0.3s ease';
              }, 100 * Math.random()); // Stagger loading
              observer.unobserve(item);
            }
          });
        },
        { rootMargin: '200px' }
      );

      observer.observe(item);
    });
  }
}

//VERSION 4: FIXED?
function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.classList.add('reduce-motion');

    // Get items to lazy load
    const hiddenItems = document.querySelectorAll(
      '.masonry-item:nth-child(n+10)'
    );

    // Early exit if no items to process
    if (!hiddenItems.length) return;

    // Initially hide items with opacity (keeps layout intact)
    hiddenItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)'; // Subtle animation
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    // Create a single IntersectionObserver instance for all items
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;

            // Staggered reveal with small random delay
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';

              // Stop observing after animation
              setTimeout(() => {
                observer.unobserve(item);
              }, 500);
            }, 100 * Math.random());
          }
        });
      },
      {
        rootMargin: '200px', // Load before they come into view
        threshold: 0.1, // Trigger when at least 10% visible
      }
    );

    // Observe all hidden items with the single observer
    hiddenItems.forEach((item) => observer.observe(item));

    // Optimize image loading
    document.querySelectorAll('img:not([loading])').forEach((img) => {
      // Skip critical images
      if (img.closest('#home') || img.closest('#carousel-section')) {
        return;
      }

      // Add lazy loading for non-critical images
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  }
}

// Run mobile optimizations on DOMContentLoaded for better performance
document.addEventListener('DOMContentLoaded', optimizeForMobile);
