// Back to top button functionality
document.addEventListener("DOMContentLoaded", function () {
  // Create the button element
  const backToTopButton = document.createElement("button");
  backToTopButton.id = "myBtn";
  backToTopButton.title = "Go to top";
  backToTopButton.textContent = "Top";
  backToTopButton.onclick = topFunction;
  document.body.appendChild(backToTopButton);

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
});
