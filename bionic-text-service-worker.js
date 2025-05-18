class BionicTextServiceWorker {

  #currentlyEnabled = false;

  constructor() {
    console.log('Initializing Service Worker');
    this.#loadCurrentlyEnabledValueFromStorage();
    this.#setupStorageListener();
    this.#setupClickListener();
  }

  #loadCurrentlyEnabledValueFromStorage() {
    console.log('Load the enabled value from storage here...');
  }

  #setupClickListener() {
    chrome.action.onClicked.addListener((tab) => {
      console.log('Extension Clicked!!');
      if (tab.url.includes('chrome://')) {
        return;
      }

      /**
       * Not sure why I don't have a language server for chrome extension development
       * Below are the docs for execute script.
       * @see https://developer.chrome.com/docs/extensions/reference/api/scripting#type-ScriptInjection
       */
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['./bionic-text.js']
        /**
         * Note: You can only pass in JSON serializable values in as arguments.
         * This means you cannot pass in functions or instances of classes.
         */
        // args: [],
        /**
         * Note: this func value gets wrapped in an IIFE, so it doesn't recognize class level functions, which is why
         */
        // func: () => {
        //   bionicTextClassInstance.makeDocumentRed(document);
        // }
      });
    });
  }

  #setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
          `Storage key "${key}" in namespace "${namespace}" changed.`,
          `Old value was "${oldValue}", new value is "${newValue}".`
        );
      }
    });
  }


  /**
   * Everything within this function is executed in the context of the tab.
   * This means that console logging will occur at the tab/page level not within the service worker level.
   */
  getOnTabAction() {
    return (bionicTextClassContext) => {
      console.log('Executing Extension code on active tab.');
      console.log('ClassContext?\n', bionicTextClassContext);
      document.body.style.backgroundColor = 'red';
    }
  }

  makeDocumentRed(document) {
    document.body.style.backgroundColor = 'red';
  }

  toggleBionicText() {
    let isBionicEnabled = false;

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

}

new BionicTextServiceWorker();

