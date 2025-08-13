// Header logo click area fix for mobile devices
// Problem: Below 695px, the .logo element takes 80% width making entire area clickable
// Solution: Restrict clickable area to only the text (h1) element while preserving layout styles
// This maintains the visual design while improving UX on mobile devices

/**
 * Adjusts logo clickable area on mobile to prevent accidental clicks
 * Why: On mobile, logo container spans 80% width but only text should be clickable
 * This improves user experience by reducing misclicks in header area
 */
function adjustLogoClickArea() {
    const logo = document.querySelector('.logo');
    const headerH1 = document.querySelector('.header-h1');
    
    if (!logo || !headerH1) return;
    
    if (window.innerWidth <= 695) {
        // Mobile: disable click on logo container, keep only h1 clickable
        logo.style.pointerEvents = 'none';
        headerH1.style.pointerEvents = 'auto';
        headerH1.style.cursor = 'pointer';
        
        // Make h1 act as the link with same behavior as parent
        headerH1.addEventListener('click', function(e) {
            e.stopPropagation();
            logo.click();
        });
    } else {
        // Desktop: restore normal behavior
        logo.style.pointerEvents = 'auto';
        headerH1.style.pointerEvents = 'auto';
    }
}

// Run on load and window resize
adjustLogoClickArea();
window.addEventListener('resize', adjustLogoClickArea);



// Search functionality - expandable search bar
// Purpose: Creates a dropdown search section when search icon is clicked
// On submit: redirects to original website (bondelaget.no) since this is a clone project without backend

/**
 * Creates and manages expandable search dropdown below header
 * Why: Provides search functionality without cluttering the main navigation
 * Search redirects to original site as this is a frontend-only clone
 */
function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const header = document.querySelector('.header');
    
    if (!searchBtn || !header) return;
    
    // Create search dropdown section
    const searchDropdown = document.createElement('div');
    searchDropdown.className = 'search-dropdown';
    searchDropdown.innerHTML = `
        <div class="search-dropdown-container">
            <form class="search-form" action="https://www.bondelaget.no/" method="get" target="_blank">
                <div class="search-wrapper">
                    <input type="text" 
                        class="search-input" 
                        placeholder="Søkebegrep" 
                        name="search">
                    <button type="submit" class="search-button">SØK</button>
                </div>
            </form>
        </div>
    `;
    
    // Insert after header
    header.insertAdjacentElement('afterend', searchDropdown);
    
    // Toggle search dropdown
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const isOpening = !searchDropdown.classList.contains('active');
        searchDropdown.classList.toggle('active');
        
        // Toggle search icon
        const searchIcon = document.getElementById('search-icon');
        if (isOpening) {
            searchIcon.textContent = 'close';
            searchDropdown.querySelector('.search-input').focus();
        } else {
            searchIcon.textContent = 'search';
        }
    });
    
    // Close on click outside
    document.addEventListener('click', function(e) {
        if (!searchBtn.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }
    });
}

// Initialize on load
initializeSearch();

/**
 * Custom dropdown for county selection in footer
 * Why: Native select doesn't match site design, custom dropdown provides better UX
 * Features search functionality for easier navigation through 14 counties
 */
function initializeCustomDropdown() {
    const dropdown = document.getElementById('county-dropdown');
    if (!dropdown) return;
    
    const selected = dropdown.querySelector('.dropdown-selected');
    const selectedText = dropdown.querySelector('.selected-text');
    const searchInput = dropdown.querySelector('.search-input-dropdown');
    const options = dropdown.querySelectorAll('.dropdown-option');
    
    // URL mapping for fylkeslag
    const fylkeslagUrls = {
        'akershus': 'https://www.bondelaget.no/fylkeslag/akershus/',
        'agder': 'https://www.bondelaget.no/fylkeslag/agder/',
        'buskerud': 'https://www.bondelaget.no/fylkeslag/buskerud/',
        'finnmark': 'https://www.bondelaget.no/fylkeslag/finnmark/',
        'innlandet': 'https://www.bondelaget.no/innlandet/',
        'more-romsdal': 'https://www.bondelaget.no/moreogromsdal/',
        'nordland': 'https://www.bondelaget.no/fylkeslag/nordland/',
        'rogaland': 'https://www.bondelaget.no/fylkeslag/rogaland/',
        'telemark': 'https://www.bondelaget.no/fylkeslag/telemark/',
        'troms': 'https://www.bondelaget.no/fylkeslag/troms/',
        'trondelag': 'https://www.bondelaget.no/trondelag/',
        'vestfold': 'https://www.bondelaget.no/fylkeslag/vestfold/',
        'vestland': 'https://www.bondelaget.no/fylkeslag/vestland/',
        'ostfold': 'https://www.bondelaget.no/fylkeslag/ostfold/'
    };
    
    // Toggle dropdown
    selected.addEventListener('click', function() {
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            searchInput.focus();
        }
    });
    
    // Handle option selection with redirect
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            const url = fylkeslagUrls[value];
            
            if (url) {
                // Redirect to fylkeslag page
                window.open(url, '_blank');
            } else {
                console.warn(`No URL found for ${value}`);
            }
            
            // Update selected text
            selectedText.textContent = text;
            
            // Remove previous selection
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            this.classList.add('selected');
            
            // Close dropdown
            dropdown.classList.remove('open');
            
            // Clear search
            searchInput.value = '';
            options.forEach(opt => opt.classList.remove('hidden'));
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.classList.remove('hidden');
            } else {
                option.classList.add('hidden');
            }
        });
    });
    
    // Close on click outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Keyboard navigation
    selected.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dropdown.classList.toggle('open');
            if (dropdown.classList.contains('open')) {
                searchInput.focus();
            }
        }
    });
}

// Initialize on load
initializeCustomDropdown();

/**
 * Manages mobile hamburger menu functionality
 * Why: Navigation needs to be accessible on mobile devices with limited screen space
 * Includes body scroll lock when menu is open to prevent background scrolling
 */
function initializeMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (!hamburgerBtn || !mainNav) return;
    
    hamburgerBtn.addEventListener('click', function() {
        mainNav.classList.toggle('menu-open');
        hamburgerBtn.classList.toggle('active');
        
        // Lock/unlock body scroll when menu is open/closed
        if (mainNav.classList.contains('menu-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('menu-open');
            hamburgerBtn.classList.remove('active');
            // Restore body scroll when menu closes
            document.body.style.overflow = '';
        });
    });
}

// Initialize on load
initializeMobileMenu();