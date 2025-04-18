// ab-testing.js - Updated with standardized event structure for GTM

// Standardized function to push events to dataLayer
function pushToDataLayer(eventName, eventData) {
  window.dataLayer = window.dataLayer || [];
  
  // Create a standardized event object with common test properties
  const eventObject = {
    'event': eventName,
    'testName': 'nav_layout_test',
    'testVariant': eventData.variant || null,
    'testTimestamp': new Date().toISOString()
  };
  
  // Add any additional properties from eventData
  for (const key in eventData) {
    if (key !== 'variant') { // Skip variant as we've already handled it
      eventObject[key] = eventData[key];
    }
  }
  
  // Push to dataLayer
  window.dataLayer.push(eventObject);
}

// Function to get test start/end dates
function getTestDates() {
  // You can modify these dates to control test duration
  return {
    startDate: new Date('2025-04-01T00:00:00'), // Test starts April 1, 2025
    endDate: new Date('2025-05-01T23:59:59')    // Test ends May 1, 2025
  };
}

// Function to check if the test is active
function isTestActive() {
  const { startDate, endDate } = getTestDates();
  const now = new Date();
  
  // Test is active if current date is between start and end dates
  return now >= startDate && now <= endDate;
}

// Function to get a random variant or retrieve existing assignment
function getVariant() {
  // If test is not active, return the default experience
  if (!isTestActive()) {
    return "horizontal";
  }
  
  // Check if user already has a variant assigned
  let variant = localStorage.getItem("navVariant");
  let isNewAssignment = false;

  // If not, randomly assign one
  if (!variant) {
    variant = Math.random() < 0.5 ? "horizontal" : "vertical";
    localStorage.setItem("navVariant", variant);
    isNewAssignment = true;
  }
  
  // Push the variant assignment event to dataLayer
  pushToDataLayer('testVariantAssigned', {
    'variant': variant,
    'isNewAssignment': isNewAssignment
  });
  
  return variant;
}

// Function to apply the appropriate navigation style
function applyVariant(variant) {
  // Track exposure to the variant
  pushToDataLayer('testVariantExposure', {
    'variant': variant,
    'page': window.location.pathname
  });
  
  if (variant === "vertical") {
    // Convert horizontal menu to vertical
    const menu = document.querySelector(".horizontal-menu");
    if (menu) {
      menu.classList.remove("horizontal-menu");
      menu.classList.add("vertical-menu");
    }

    // Adjust the content area
    const content = document.querySelector(".content");
    if (content) {
      content.classList.add("vertical-variant");
    }

    // Add mobile menu toggle for vertical nav
    if (window.innerWidth <= 768) {
      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = "☰";
      toggleBtn.className = "menu-toggle";
      toggleBtn.addEventListener("click", () => {
        document.querySelector(".vertical-menu").classList.toggle("active");
        
        // Track menu toggle
        pushToDataLayer('navMenuToggle', {
          'variant': variant,
          'isOpen': document.querySelector(".vertical-menu").classList.contains("active")
        });
      });
      document.body.appendChild(toggleBtn);
    }
  }
}

// Function to load the vertical navigation CSS
function loadVerticalNavCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/vertical-nav.css";
  document.head.appendChild(link);
}

// Run the test when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const variant = getVariant();

  // Load vertical CSS if needed
  if (variant === "vertical") {
    loadVerticalNavCSS();
  }

  // Apply the variant
  applyVariant(variant);

  // Track page view with test information
  pushToDataLayer('pageView', {
    'variant': variant,
    'page': window.location.pathname,
    'title': document.title
  });

  // Track clicks on navigation elements via GTM
  document.querySelectorAll(".horizontal-menu a, .vertical-menu a").forEach((link) => {
    link.addEventListener("click", function(e) {
      // Get the navigation category
      let navCategory = 'Unknown';
      
      // Try to identify the category from parent elements
      const parentLi = this.closest('li');
      const grandparentUl = parentLi && parentLi.parentElement;
      const greatGrandparentLi = grandparentUl && grandparentUl.parentElement;
      
      if (grandparentUl && grandparentUl.classList.contains('sub') && greatGrandparentLi) {
        // This is a sub-menu item
        const categoryLink = greatGrandparentLi.querySelector('a');
        if (categoryLink) {
          navCategory = categoryLink.textContent.trim();
        }
      } else if (parentLi) {
        // This is a main menu item
        navCategory = 'Main';
      }
      
      // Push navigation click event to dataLayer
      pushToDataLayer('navLinkClick', {
        'variant': variant,
        'linkText': this.textContent.trim(),
        'linkUrl': this.href,
        'navCategory': navCategory
      });
    });
  });
});