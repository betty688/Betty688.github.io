// ab-testing.js - Updated for GTM integration

// Function to get a random variant or retrieve existing assignment
function getVariant() {
  // Check if user already has a variant assigned
  let variant = localStorage.getItem("navVariant");

  // If not, randomly assign one
  if (!variant) {
    variant = Math.random() < 0.5 ? "horizontal" : "vertical";
    localStorage.setItem("navVariant", variant);
    
    // Push the variant to dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'abTestAssignment',
      'abTestName': 'nav_layout_test',
      'abTestVariant': variant
    });
  } else {
    // Push the stored variant to dataLayer when user returns
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'abTestAssignment',
      'abTestName': 'nav_layout_test',
      'abTestVariant': variant
    });
  }

  return variant;
}

// Function to apply the appropriate navigation style
function applyVariant(variant) {
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

  // Track clicks on navigation elements via GTM
  document.querySelectorAll(".horizontal-menu a, .vertical-menu a").forEach((link) => {
    link.addEventListener("click", function(e) {
      // Push navigation click event to dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'navClick',
        'navTestVariant': variant,
        'linkText': this.textContent.trim(),
        'linkUrl': this.href
      });
    });
  });
});