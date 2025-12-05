document.addEventListener('DOMContentLoaded', function () {
  const modalOverlay = document.getElementById('ds-modal-overlay')
  const openBtn = document.getElementById('showTemplateModal')
  const closeBtn = document.getElementById('closeModalBtn')

  // Function to open modal
  openBtn.addEventListener('click', function () {
    modalOverlay.classList.add('active')
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  })

  // Function to close modal
  function closeModal() {
    modalOverlay.classList.remove('active')
    document.body.style.overflow = '' // Restore background scrolling
  }

  // Close when clicking the "X"
  closeBtn.addEventListener('click', closeModal)

  // Close when clicking outside the modal content
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closeModal()
    }
  })

  // Optional: Close on 'Esc' key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal()
    }
  })
})
