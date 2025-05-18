class BionicText {

  constructor() {
    console.log('Init Bionic Textify on the tab level document')
    this.#overwriteFontWeightInDocument();
    this.#replaceTextWithBionicText(document.body);
  }

  #overwriteFontWeightInDocument() {
    const id = 'bionic-text-overwrite-font-weight-style';
    if (!document.getElementById(id)) {
      const styleElement = document.createElement('style');
      styleElement.id = id;
      styleElement.innerText = '*:not(strong) {font-weight: normal !important}';
      document.head.appendChild(styleElement);
    }
  }

  #replaceTextWithBionicText(currentElement) {
    // debugger;
    if (!currentElement) {
      return;
    }
   

    // Child nodes is specical. It is different than querySelectorAll and other selectors as it returns text nodes.
    let nodes = currentElement.childNodes;

    /**
     * Iterating over the list of nodes in reverse order, as the code within the loop will add new "strong" elements to the list and will then iterate over those, nesting the strong elements till everything is bolded.
     */
    for (let nodeIndex = (nodes.length - 1); nodeIndex >= 0; nodeIndex--) {
      const node = nodes[nodeIndex];
      if (node.nodeType === Node.TEXT_NODE) {
        // Create a temporary div to convert the string of html into dom nodes.
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.#getTextAsBionicText(node.textContent);

        // Replace the text node with the new dom nodes.
        node.replaceWith(...tempDiv.childNodes);
      } else if (node.tagName && !['link', 'script', 'style'].includes(node.tagName.toLowerCase())){
        this.#replaceTextWithBionicText(node)
      }
    }
  }

  #getTextAsBionicText(stringToConvert) {
    return stringToConvert.split(/\s+/).map((word) => {
      if (!word.length) {
        return '';
      }
        const middleIndex = Math.ceil(word.length / 2);
        const bionicWord = `<strong>${word.substring(0, middleIndex)}</strong>${word.substring(middleIndex)}`;
        return bionicWord;
    }).join('&#32;');
  }

}

new BionicText();