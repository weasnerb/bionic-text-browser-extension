let isBionicEnabled = false;

document.getElementById('toggleButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleBionicText
    });
  });
});

function toggleBionicText() {
  // // Check if bionic text is already applied (you'll need to store this state, perhaps in localStorage)
  // chrome.storage.local.get('bionicEnabled', function(data) {
  //   isBionicEnabled = data.bionicEnabled || false; // Default to false if not set
  // });


  // Remove existing styles and apply bionic text if not already enabled, or remove bionic text if already enabled
  if (!isBionicEnabled) {

      const allElements = document.querySelectorAll('html > body *:not(script)');

      // Bionic Text Logic
      allElements.forEach(element => {
        if (element.textContent) { // Only process elements with text content
          const words = element.textContent.split(/\s+/); // Split by whitespace
          const newText = words.map(word => {
            if (word.length > 0) { // Handle empty words
              const middleIndex = Math.ceil(word.length / 2);
              const bionicWord = `<strong style="font-weight: bold">${word.substring(0, middleIndex)}</strong>${word.substring(middleIndex)}`;
              return bionicWord;
            } else {
              return "";
            }
          }).join(' ');
          element.innerHTML = newText;
        }
      });

      // Store the new state
      // chrome.storage.local.set({ bionicEnabled: true });
      isBionicEnabled = true;
  } else {
      // Remove Bionic Text (revert to original content)
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
          if (element.textContent) {
              element.innerHTML = element.textContent; // Revert to plain text
          }
      });
      isBionicEnabled = false;
      // chrome.storage.local.set({ bionicEnabled: false });

  }
}