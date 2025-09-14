document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
        
        // Initialize animations after page load
        initAnimations();
    });
    
    // Mobile Navigation - Create overlay element
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.getElementById('header');
    
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Create mobile menu brand header
    function setupMobileMenu() {
        // Create header element for the mobile menu
        const menuHeader = document.createElement('div');
        menuHeader.className = 'mobile-menu-header';
        
        // Add logo to the header
        const mobileLogo = document.createElement('div');
        mobileLogo.className = 'mobile-logo';
        mobileLogo.innerHTML = 'Jagdamba <span>Group</span>';
        
        menuHeader.appendChild(mobileLogo);
        
        // Create footer element with social icons
        const menuFooter = document.createElement('div');
        menuFooter.className = 'mobile-menu-footer';
        
        const socialLinks = document.createElement('div');
        socialLinks.className = 'mobile-social';
        
        // Add social media icons
        const socialIcons = [
            { icon: 'fab fa-facebook-f', url: '#' },
            { icon: 'fab fa-twitter', url: '#' },
            { icon: 'fab fa-linkedin-in', url: '#' },
            { icon: 'fab fa-instagram', url: '#' }
        ];
        
        socialIcons.forEach(social => {
            const link = document.createElement('a');
            link.href = social.url;
            link.className = 'mobile-social-link';
            link.innerHTML = `<i class="${social.icon}"></i>`;
            socialLinks.appendChild(link);
        });
        
        menuFooter.appendChild(socialLinks);
        
        // Prepend header and append footer to nav menu
        navMenu.prepend(menuHeader);
        navMenu.appendChild(menuFooter);
    }
    
    // Call setup function
    setupMobileMenu();
    
    // Set viewport height custom property for mobile devices
    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set on page load and resize
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    // Handle mobile menu toggle - FIXED FUNCTIONALITY
    if (navToggle) {
        // Remove any existing event listeners
        navToggle.removeEventListener('click', toggleMenu);
        
        // Add fresh event listener
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Function to toggle menu
    function toggleMenu() {
        console.log('Toggle menu clicked'); // Debug
        
        // Toggle active class on the toggle button
        navToggle.classList.toggle('active');
        
        // For smooth animation
        if (!navMenu.classList.contains('active')) {
            // Opening menu - first add overlay with reduced opacity
            overlay.style.opacity = '0';
            overlay.style.visibility = 'visible';
            
            // Fade in overlay gradually
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            document.body.style.overflow = 'hidden';
            
            // Force header to have scrolled class when menu is open
            header.classList.add('scrolled');
            
            // Add slight delay for smoother animation sequence
            setTimeout(() => {
                navMenu.classList.add('active');
            }, 50);
            
            // Highlight active menu item based on current page
            setTimeout(() => {
                highlightCurrentPageInMenu();
            }, 600);
        } else {
            // Closing menu - fade out smoothly
            navMenu.classList.remove('active');
            
            // Check if we should remove scrolled class
            if (window.scrollY <= 30) {
                header.classList.remove('scrolled');
            }
            
            // Delay overlay removal for smoother transition
            setTimeout(() => {
                overlay.classList.remove('active');
                
                // Complete hiding after fade animation
                setTimeout(() => {
                    overlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }, 300);
            }, 200);
        }
    }
    
    // Detect current page and highlight appropriate menu item - improved
    function highlightCurrentPageInMenu() {
        console.log('Highlighting current page in menu');
        
        // Get current page path
        const currentPath = window.location.pathname;
        const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1).toLowerCase();
        
        console.log('Current page:', pageName);
        
        // Remove all active classes first
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find the matching nav item
        let foundMatch = false;
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href').toLowerCase();
                console.log('Checking link:', href);
                
                // Check if current page matches the menu item
                if ((pageName === '' || pageName === 'index.html' || pageName === '/') && 
                    (href === 'index.html' || href === './' || href === '/' || href === '#hero')) {
                    item.classList.add('active');
                    foundMatch = true;
                    console.log('Matched home page');
                } 
                else if (pageName === href) {
                    item.classList.add('active');
                    foundMatch = true;
                    console.log('Exact match found');
                } 
                else if (href === pageName) {
                    item.classList.add('active');
                    foundMatch = true;
                    console.log('Exact match found (reversed)');
                } 
                else if (pageName.includes('about') && href.includes('about')) {
                    item.classList.add('active');
                    foundMatch = true;
                    console.log('About page match');
                }
                else if (href.startsWith('#') && window.location.hash === href) {
                    item.classList.add('active');
                    foundMatch = true;
                    console.log('Hash match found');
                }
                else if (href.startsWith('#') && window.location.hash === '' && 
                         currentPath.endsWith('index.html') && href === '#hero') {
                    item.classList.add('active');
                    foundMatch = true;
                    console.log('Home with hero section match');
                }
            }
        });
        
        // If no match was found, highlight home for index page
        if (!foundMatch) {
            if (pageName === '' || pageName === 'index.html' || pageName === '/') {
                const homeItem = document.querySelector('.nav-item a[href="index.html"], .nav-item a[href="./"], .nav-item a[href="/"], .nav-item a[href="#hero"]');
                if (homeItem) {
                    homeItem.parentElement.classList.add('active');
                    console.log('Default to home link');
                } else if (document.querySelector('.nav-item')) {
                    document.querySelector('.nav-item').classList.add('active');
                    console.log('Default to first nav item');
                }
            }
        }
    }
    
    // Close menu when clicking outside
    overlay.addEventListener('click', function() {
        closeMenu();
    });
    
    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the current item
            const currentItem = this.parentElement;
            
            // Get href attribute
            const href = this.getAttribute('href');
            console.log('Link clicked:', href);
            
            // Add active class to current item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            currentItem.classList.add('active');
            
            // If it's a navigation link to another page, let it navigate normally
            if (href && !href.startsWith('#')) {
                // Normal navigation, let the default action happen
                console.log('Normal navigation to:', href);
                // Still close the menu before navigation
                setTimeout(() => {
                    closeMenu();
                }, 100);
                return true;
            }
            
            // If it's a hash link on the same page
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Find the target element
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close menu first
                    closeMenu();
                    
                    // Then scroll after a short delay
                    setTimeout(() => {
                        const headerOffset = 80;
                        const elementPosition = targetElement.offsetTop;
                        const offsetPosition = elementPosition - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 400);
                }
            } else {
                // If not a hash link, close the menu
                setTimeout(() => {
                    closeMenu();
                }, 300);
            }
        });
    });
    
    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Check if we should remove scrolled class
        if (window.scrollY <= 30) {
            header.classList.remove('scrolled');
        }
        
        setTimeout(() => {
            overlay.classList.remove('active');
            
            // Complete hiding after fade animation
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }, 300);
        }, 200);
    }
    
    // Call this on page load to highlight the current page in the menu
    highlightCurrentPageInMenu();
    
    // Handle scroll events with better performance
    function handleScroll() {
        requestAnimationFrame(function() {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                // Only remove scrolled class if we're back at the top
                // and not on mobile with menu open
                if (window.innerWidth > 991 || (window.innerWidth <= 991 && !navMenu.classList.contains('active'))) {
                    header.classList.remove('scrolled');
                }
            }
        });
    }
    
    // Check on page load
    handleScroll();
    
    // Throttle scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    });
    
    // Close menu on window resize (orientation change)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
        
        // Reset viewport height on resize
        setViewportHeight();
    });
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth Scroll for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Stats Counter Animation
    function initCounters() {
        const counterElements = document.querySelectorAll('.stat-counter');
        
        counterElements.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // Approximately 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                
                if (current < target) {
                    // Check if it's a decimal value
                    if (target % 1 !== 0) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Scroll Reveal Animation
    function initAnimations() {
        const revealElements = document.querySelectorAll('.animate-reveal');
        
        if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                        revealObserver.unobserve(entry.target);
                        
                    // Start counter animations when stats section is visible
                    if (entry.target.closest('#stats')) {
                        initCounters();
                    }
                }
            });
        }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            revealElements.forEach(element => {
                element.classList.add('revealed');
            });
            
            // Initialize counters regardless
            if (document.querySelector('#stats')) {
                initCounters();
            }
        }
    }
    
    // Active Navigation Link based on Scroll Position (for same-page navigation)
    function updateActiveNavLink() {
        // Only run this on the home page or other pages with section navigation
        if (document.querySelectorAll('section[id]').length === 0) return;
        
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-item');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            navItems.forEach(item => {
                item.classList.remove('active');
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === `#${currentSection}`) {
                    item.classList.add('active');
                }
            });
        }
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initialize section highlighting
    updateActiveNavLink();
}); 