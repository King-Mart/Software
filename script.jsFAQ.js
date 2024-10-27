document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      faqItem.classList.toggle('active');
      
      const answer = faqItem.querySelector('.faq-answer');
      answer.style.display = faqItem.classList.contains('active') ? 'block' : 'none';
    });
  });