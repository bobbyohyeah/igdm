// Define the currentUrl and flags to track if the containers have been removed and if the page has been redirected
let currentUrl = window.location.href;
let containersRemoved = false;
let pageRedirected = false;

// Find containers with the specified attributes and remove them
function removeContainers() {
  const containers = document.querySelectorAll(
    '.x78zum5.x1q0g3np.x1gvbg2u.x1qughib.xleuxlb.xxfw5ft.x1mh60rb.x1f91t4q.x1n2onr6'
  );
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];
    container.remove();
  }
  // Set the flag to true if any containers were removed
  if (containers.length > 0) {
    containersRemoved = true;
  }
}


// Redirect the user to Instagram Direct
function redirectToDirect() {
  currentUrl = window.location.href;
  if (currentUrl === 'https://www.instagram.com/') {
    console.log('Redirecting from home page to Instagram Inbox');
    window.location.href = 'https://www.instagram.com/direct/inbox';
    redirectToDirectObserver.disconnect();
    pageRedirected = true;
  } else if (currentUrl.includes('instagram.com/') && !currentUrl.includes('instagram.com/direct/')) {
    console.log('Redirecting from', currentUrl, 'to Instagram Direct');
    window.location.href = 'https://www.instagram.com/direct/inbox';
    redirectToDirectObserver.disconnect();
    pageRedirected = true;
  } else {
    console.log('Already on Instagram Direct');
    pageRedirected = true;
    redirectToDirectObserver.disconnect();
  }
}

// Create a mutation observer to watch for changes in the body of the page
const removeSidebarObserver = new MutationObserver(function() {
  // Only run removeSidebar if the containers haven't been removed yet
  if (!containersRemoved) {
    removeSidebar();
  } else {
    // If the containers have been removed, disconnect the observer
    removeSidebarObserver.disconnect();
  }
});

// Create a mutation observer to watch for changes in the URL
const redirectToDirectObserver = new MutationObserver(function(mutationsList, observer) {
  // Only run redirectToDirect if the page hasn't been redirected yet
  if (!pageRedirected) {
    redirectToDirect();
  } else {
    // If the page has been redirected, disconnect the observer
    redirectToDirectObserver.disconnect();
  }
});

// Remove the sidebar when the Instagram Direct page is loaded
function removeSidebar() {
  if (currentUrl.includes('instagram.com/direct')) {
    console.log('Removing sidebar');
    removeContainers();
  }
}

// Function to add styles to elements
function removeProfileClicks(elements) {
  elements.forEach(element => {
      if (element.matches('a[aria-label^="Open the profile page"], a[aria-label^="Open the profile page"] img')) {
          element.style.pointerEvents = 'none';
      }
  });
}

// Create a mutation observer to watch for changes in the DOM
var removeProfileClicksObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // ELEMENT_NODE
              removeProfileClicks(node.querySelectorAll('a[aria-label^="Open the profile page"], a[aria-label^="Open the profile page"] img'));
          }
      });
  });
});

// Start observing the document with the configured parameters
console.log('Starting the extension');
removeSidebarObserver.observe(document.body, {childList: true, subtree: true});
redirectToDirectObserver.observe(document.body, {childList: true, subtree: true});
removeProfileClicks(document.querySelectorAll('a[aria-label^="Open the profile page"], a[aria-label^="Open the profile page"] img'));
removeProfileClicksObserver.observe(document.body, { childList: true, subtree: true });
