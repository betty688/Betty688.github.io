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
      // Prevent adding multiple buttons if called on window resize without proper cleanup
      if (!document.querySelector(".menu-toggle")) {
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "☰";
        toggleBtn.className = "menu-toggle";
        // Add some basic styling to position the button
        toggleBtn.style.position = 'fixed'; // Or absolute, depending on layout
        toggleBtn.style.top = '10px';
        toggleBtn.style.left = '10px';
        toggleBtn.style.zIndex = '1000'; // Ensure it's above other content

        toggleBtn.addEventListener("click", () => {
          const verticalMenu = document.querySelector(".vertical-menu");
          if (verticalMenu) {
             verticalMenu.classList.toggle("active");
          }
        });
        document.body.appendChild(toggleBtn);
      }
    }
  }
  // No specific action needed for the 'horizontal' variant in applyVariant
  // assuming the default HTML/CSS is the horizontal layout.
}

// Function to load the vertical navigation CSS
function loadVerticalNavCSS() {
  // Check if the CSS is already loaded to avoid duplicates
  if (!document.querySelector('link[href="css/vertical-nav.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/vertical-nav.css";
    document.head.appendChild(link);
  }
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
  // Use event delegation for more robustness, especially with dynamic class changes
  document.body.addEventListener("click", function(event) {
    const target = event.target;
    // Check if the clicked element is a link within either menu class
    if (target.tagName === 'A' && (target.closest('.horizontal-menu') || target.closest('.vertical-menu'))) {
      // Push navigation click event to dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'navClick',
        'navTestVariant': variant, // Use the determined variant
        'linkText': target.textContent.trim(),
        'linkUrl': target.href
      });
    }
  });
});
