// ab-testing.js

// Function to get a random variant or retrieve existing assignment
function getVariant() {
  // Check if user already has a variant assigned
  let variant = localStorage.getItem("navVariant");

  // If not, randomly assign one
  if (!variant) {
    variant = Math.random() < 0.5 ? "horizontal" : "vertical";
    localStorage.setItem("navVariant", variant);
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

  // Send the variant info to Google Analytics
  sendToAnalytics(variant);
}

// Function to load the vertical navigation CSS
function loadVerticalNavCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/vertical-nav.css"; // Path to your vertical nav CSS file
  document.head.appendChild(link);
}

// Function to send variant information to Google Analytics
function sendToAnalytics(variant) {
  // For Google Analytics 4
  if (typeof gtag !== "undefined") {
    gtag("event", "ab_test_impression", {
      experiment_id: "nav_layout_test",
      variant_id: variant,
    });
  }

  // For Universal Analytics (older version)
  if (typeof ga !== "undefined") {
    ga("send", "event", "ABTest", "Navigation", variant);
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

  // Track clicks on navigation elements
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", function () {
      // For GA4
      if (typeof gtag !== "undefined") {
        gtag("event", "nav_click", {
          experiment_id: "nav_layout_test",
          variant_id: variant,
          link_text: this.textContent,
          link_url: this.href,
        });
      }

      // For Universal Analytics
      if (typeof ga !== "undefined") {
        ga(
          "send",
          "event",
          "Navigation",
          "Click",
          variant + " - " + this.textContent
        );
      }
    });
  });
});
