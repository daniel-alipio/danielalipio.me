let scrollTimeout;

export const scrollToSection = (sectionId, offset = 80) => {
  if (scrollTimeout) clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    const cleanId = sectionId.replace('#', '');
    const targetElement = document.getElementById(cleanId);

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Seção "${cleanId}" não encontrada.`);
    }
  }, 10);
};

export const handleSmoothScroll = (event) => {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href');
  if (!targetId || targetId === '#') return;
  scrollToSection(targetId);
};

export default {
  scrollToSection,
  handleSmoothScroll
};
