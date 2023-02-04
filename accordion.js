const accordionItemHeaders = document.querySelectorAll(
  ".accordion-item .header"
);

accordionItemHeaders.forEach((accordionItemHeader) => {
  accordionItemHeader.addEventListener("click", (event) => {
    accordionItemHeader.classList.toggle("active");

    const accordionItemBody = accordionItemHeader.nextElementSibling;

    if (accordionItemHeader.classList.contains("active")) {
      // Accordion ausklappen
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      // Accordion einklappen
      accordionItemBody.style.maxHeight = "0px";
    }
  });
});
