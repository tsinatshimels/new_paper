// DOM ELEMENTS
const requestDropdown = document.getElementById('requestDropdown')
const requestToggle = document.getElementById('paperRequestsBtn')
const wrapper = document.getElementById('paperRequests')
const requestCountBadge = document.querySelector('.request_count span')
const requestHoverText = document.querySelector('.request_hover')

// SAMPLE DATA
const requests = [
  {
    id: 1,
    img: randomProfile(),
    title: 'School Essay',
    time: '1 month ago',
    message: 'Liam is inviting you to a new paper: “School Essay Draft…”',
  },
  {
    id: 2,
    img: randomProfile(),
    title: 'History Paper',
    time: '2 days ago',
    message: 'Liam is inviting you to a new paper: “History Paper…”',
  },
  // add more sample requests as needed
  {
    id: 3,
    img: randomProfile(),
    title: 'Science Project',
    time: '3 hours ago',
    message: 'Emma is inviting you to a new paper: “Science Project Overview…”',
  },
  {
    id: 4,
    img: randomProfile(),
    title: 'Book Report',
    time: '5 minutes ago',
    message: 'Noah is inviting you to a new paper: “Book Report on 1984…”',
  },
  {
    id: 5,
    img: randomProfile(),
    title: 'Math Assignment',
    time: 'Just now',
    message:
      'Olivia is inviting you to a new paper: “Math Assignment Solutions…”',
  },
  {
    id: 6,
    img: randomProfile(),
    title: 'Art Portfolio',
    time: '1 week ago',
    message: 'Ava is inviting you to a new paper: “Art Portfolio Collection…”',
  },
  {
    id: 7,
    img: randomProfile(),
    title: 'Research Paper',
    time: '2 weeks ago',
    message:
      'Sophia is inviting you to a new paper: “Research Paper on Climate Change…”',
  },
  {
    id: 8,
    img: randomProfile(),
    title: 'Literature Review',
    time: '3 days ago',
    message:
      'Isabella is inviting you to a new paper: “Literature Review on Modern Poetry…”',
  },
]

// Generate a random profile image
function randomProfile() {
  const gender = Math.random() > 0.5 ? 'men' : 'women'
  const id = Math.floor(Math.random() * 100)
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
}

// ---------------------------------------------------------
// 1. UPDATE & RENDER LOGIC
// ---------------------------------------------------------

function updateRequestCount() {
  const count = requests.length
  requestCountBadge.textContent = count
  requestHoverText.innerHTML = `You have ${count} new requests <span class="request-clip"></span>`
}

function renderRequests() {
  const isHidden = requestDropdown.classList.contains('request-hidden')
  updateRequestCount()

  // Header
  requestDropdown.innerHTML = `
    <div class="request-header">
      <div class="request-title">
        <span>New Request</span>
         <span class="request-count">${requests.length} new</span>
      </div>
      <div class="close-request-dropdown" id="closeDropdownBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#667085" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
      </div>
    </div>
  `

  // Close Btn inside Header
  requestDropdown
    .querySelector('#closeDropdownBtn')
    .addEventListener('click', (e) => {
      e.stopPropagation()
      requestDropdown.classList.add('request-hidden')
    })

  // List Items
  requests.forEach((req) => {
    const item = document.createElement('div')
    item.className = 'request_item'
    item.dataset.id = req.id

    item.innerHTML = `
      <div class="profile"><img src="${req.img}"></div>
      <div class="content">
        <div class="row1">
          <span class="title">${req.title}</span>
          <span class="time">${req.time}</span>
        </div>
        <div class="message">${req.message}</div>
        <a class="preview request-preview-btn">Preview Paper</a>
      </div>
      <div class="actions">
        <button class="accept">✔</button>
        <button class="decline">✕</button>
      </div>
    `

    // List Item Accept
    item.querySelector('.accept').addEventListener('click', (e) => {
      e.stopPropagation()
      removeRequest(req.id)
    })
    // List Item Decline
    item.querySelector('.decline').addEventListener('click', (e) => {
      e.stopPropagation()
      removeRequest(req.id)
    })

    requestDropdown.appendChild(item)
  })

  if (isHidden) requestDropdown.classList.add('request-hidden')
}

// ---------------------------------------------------------
// 2. DROPDOWN TOGGLE LOGIC
// ---------------------------------------------------------

requestToggle.addEventListener('click', (e) => {
  e.stopPropagation()
  requestDropdown.classList.toggle('request-hidden')
})

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  // If clicking Toggle or Inside Dropdown, do not close
  if (requestToggle.contains(e.target) || requestDropdown.contains(e.target))
    return

  // Otherwise close
  requestDropdown.classList.add('request-hidden')
})

// ---------------------------------------------------------
// 3. PREVIEW & MODAL LOGIC (Global Scope)
// ---------------------------------------------------------

// Delegate click for PREVIEW buttons inside the dropdown
requestDropdown.addEventListener('click', async (e) => {
  const btn = e.target.closest('.request-preview-btn')
  if (!btn) return
  e.stopPropagation()
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    requestDropdown.classList.add('request-hidden')
  })

  // 1. Close the dropdown so we can see the modal
  requestDropdown.classList.add('request-hidden')

  // 2. Get Data
  const item = btn.closest('.request_item')
  const reqId = parseInt(item.dataset.id)
  const reqData = requests.find((r) => r.id === reqId)

  // (Optional: fetch real content here)
  const paperHtml = '' // Use empty to trigger default text for now

  // 3. Open Modal
  openPreviewModal(paperHtml, reqData)
})

// ... existing code ...

// ---------------------------------------------------------
// OPEN PREVIEW MODAL LOGIC
// ---------------------------------------------------------
function openPreviewModal(htmlContent, reqData) {
  const overlayContainer = document.getElementById('overlay_paper_lists')
  const overlay = document.getElementById('preview-overlay')
  // close the dropdown if it's open

  if (!overlay || !overlayContainer) return

  // 1. SWITCH TO VIEWER MODE
  if (window.setPaperMode) window.setPaperMode('viewer')

  // 2. Clear previous content
  overlayContainer.innerHTML = ''

  // 3. GENERATE PAPER CONTENT (Center)
  const paperWrapper = document.createElement('div')
  paperWrapper.className = 'paper paper-editor preview-mode-paper'

  // Inject Paper HTML
  paperWrapper.innerHTML = `
      <div class="ql-container ql-snow" style="border:none;">
          <div class="ql-editor">
              <h1 style="text-align:center; margin-bottom:2rem;">${
                reqData ? reqData.title : 'Paper Preview'
              }</h1>
              ${
                htmlContent ||
                `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <br>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <br>
                <p><strong>(Content is truncated for preview...)</strong></p>
              `
              }
          </div>
      </div>
  `

  // 4. GENERATE FOOTER (Access Limited + Eye Icon)
  const footerDiv = document.createElement('div')
  footerDiv.className = 'preview-footer-limit'
  footerDiv.innerHTML = `
    <!-- Closed Eye SVG -->
    <div>
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"><path stroke-linejoin="round" d="M10.73 5.073A11 11 0 0 1 12 5c4.664 0 8.4 2.903 10 7a11.6 11.6 0 0 1-1.555 2.788M6.52 6.519C4.48 7.764 2.9 9.693 2 12c1.6 4.097 5.336 7 10 7a10.44 10.44 0 0 0 5.48-1.52m-7.6-7.6a3 3 0 1 0 4.243 4.243"/><path d="m4 4l16 16"/></g></svg>
    <span>Access limited to only One page</span>
    </div>
    <div>
    <span>Accept invite request to get full access</span>
    </div>
  `

  // 5. GENERATE RIGHT SIDEBAR (Profile Info & Buttons)
  // We use reqData passed from the click event
  const sidebarDiv = document.createElement('div')
  sidebarDiv.className = 'preview-info-sidebar'
  sidebarDiv.innerHTML = `
    <img src="${reqData.img}" alt="User Profile">
    <div class="req-title">${reqData.title} <span>${reqData.time}</span></div>
    <div class="req-message">${reqData.message}</div>
    
    <div class="preview-actions">
        <button class="preview-btn btn-accept-preview">Accept</button>
        <button class="preview-btn btn-reject-preview">Reject</button>
    </div>
  `

  // 6. APPEND ELEMENTS TO CONTAINER
  overlayContainer.appendChild(sidebarDiv) // Sidebar first (z-index handles layering)
  overlayContainer.appendChild(paperWrapper)
  overlayContainer.appendChild(footerDiv)

  // 7. SHOW OVERLAY
  overlay.style.display = 'block'

  // 8. ATTACH EVENT LISTENERS (Accept/Reject)

  // Accept Logic
  const acceptBtn = sidebarDiv.querySelector('.btn-accept-preview')
  acceptBtn.addEventListener('click', () => {
    removeRequest(reqData.id) // Remove from list
    closePreviewModal() // Close modal & return to editor
  })

  // Reject Logic
  const rejectBtn = sidebarDiv.querySelector('.btn-reject-preview')
  rejectBtn.addEventListener('click', () => {
    removeRequest(reqData.id) // Remove from list
    closePreviewModal() // Close modal & return to editor
  })
}

// ... existing removeRequest and renderRequests ...

function closePreviewModal() {
  const overlay = document.getElementById('preview-overlay')
  const container = document.getElementById('overlay_paper_lists')

  if (overlay) overlay.style.display = 'none'
  if (container) container.innerHTML = ''

  // REVERT TO EDITOR MODE
  if (window.setPaperMode) window.setPaperMode('editor')
}

// ---------------------------------------------------------
// 4. DATA MANAGEMENT
// ---------------------------------------------------------

function removeRequest(id) {
  const index = requests.findIndex((r) => r.id === id)
  if (index !== -1) {
    // 1. Fade out the item in the dropdown
    const el = document.querySelector(`.request_item[data-id="${id}"]`)
    if (el) el.classList.add('fade_out')

    // 2. Wait for animation then remove data
    setTimeout(() => {
      requests.splice(index, 1)
      renderRequests() // Re-render list
    }, 300)
  }
}

// Initial Render
renderRequests()
