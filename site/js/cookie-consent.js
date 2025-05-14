// Cookie consent functions

// Set a cookie with name, value and expiration days
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    
    // Also store in localStorage as a backup
    try {
        localStorage.setItem(name, value);
    } catch (e) {
        console.log("Local storage not available, using cookies only");
    }
}

// Get a cookie by name
function getCookie(name) {
    // First try from cookies
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    
    // If not found in cookies, try localStorage
    try {
        const localValue = localStorage.getItem(name);
        if (localValue) {
            return localValue;
        }
    } catch (e) {
        console.log("Local storage not available, using cookies only");
    }
    
    return "";
}

// Check if cookie consent has been given
function hasConsent() {
    const consent = getCookie("cookieConsent");
    return consent === "accepted";
}

// Show the cookie banner with animation
function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    banner.classList.remove('hidden');
    // Trigger reflow for animation to work properly
    void banner.offsetWidth;
    banner.classList.add('cookie-banner-animate');
}

// Hide the cookie banner with animation
function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    banner.style.animation = 'slide-down 0.5s ease-in forwards';
    
    // After animation completes, hide the banner
    setTimeout(() => {
        banner.classList.add('hidden');
        banner.style.animation = '';
    }, 500);
}

// Open cookie policy modal
function openCookiePolicy() {
    document.getElementById('cookie-policy-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
}

// Close cookie policy modal
function closeCookiePolicy() {
    document.getElementById('cookie-policy-modal').classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Accept cookies
function acceptCookies() {
    setCookie("cookieConsent", "accepted", 365); // Consent valid for 1 year
    hideCookieBanner();
    initAnalytics(); // Initialize analytics after consent
    console.log("Cookie consent accepted and saved");
}

// Initialize analytics
function initAnalytics() {
    // Basic example with a simple page view counter
    // In a real-world scenario, you might want to replace this with Google Analytics or similar
    let pageViews = parseInt(localStorage.getItem('pageViews') || '0');
    localStorage.setItem('pageViews', (pageViews + 1).toString());
    
    // You can add more advanced analytics initialization here
    console.log("Analytics initialized");
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add keyframes for slide-down animation
    if (!document.getElementById('slide-down-keyframes')) {
        const style = document.createElement('style');
        style.id = 'slide-down-keyframes';
        style.innerHTML = `
            @keyframes slide-down {
                0% {
                    transform: translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log("Cookie consent status:", hasConsent() ? "Accepted" : "Not accepted yet");
    
    if (!hasConsent()) {
        showCookieBanner();
    } else {
        initAnalytics();
    }
    
    // Add event listeners to buttons
    document.getElementById('accept-cookies').addEventListener('click', acceptCookies);
    document.getElementById('decline-cookies').addEventListener('click', function() {
        hideCookieBanner();
    });
    
    // Cookie policy modal buttons
    document.getElementById('open-cookie-policy').addEventListener('click', function(e) {
        e.preventDefault();
        openCookiePolicy();
    });
    
    document.getElementById('close-cookie-policy').addEventListener('click', closeCookiePolicy);
    document.getElementById('close-cookie-modal-btn').addEventListener('click', closeCookiePolicy);
    
    // Close modal when clicking outside
    document.getElementById('cookie-policy-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCookiePolicy();
        }
    });
}); 