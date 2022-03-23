function iframed(elementIdentifiers,scriptSources,cssSource) {

    // checking whether the page is loaded in a iframe
    const isFrame = window.location !== window.parent.location ? true : false;

    const displayClass = [];
    displayClass["foundation-css"] = "hide";
    displayClass["bootstrap-css"] = "d-none";

    if(isFrame){

      // if it's in a iframe
      elementIdentifiers.forEach( elementIdentifier => {
        const Elements = document.querySelectorAll(elementIdentifier);
        Elements.forEach( uniqueElement => {
          uniqueElement.classList.add(displayClass[cssSource]);
        } );
      } );

    }else{

      // if it's not in a iframe
      scriptSources.forEach( uniqueScriptsource => {
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('src',uniqueScriptsource);
        document.head.appendChild(scriptTag);
      } );

    }

  }
