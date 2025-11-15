const requestDropdown = document.getElementById("requestDropdown");
const requestToggle = document.getElementById("paperRequestsBtn");
const wrapper = document.getElementById("paperRequests");
const requestCountBadge = document.querySelector(".request_count span");
const requestHoverText = document.querySelector(".request_hover");

function updateRequestCount() {
  const count = requests.length;

  // update red badge
  requestCountBadge.textContent = count;

  // update hover text
  requestHoverText.innerHTML = `You have ${count} new requests
    <span class="request-clip"></span>`;
}

// TOGGLE DROPDOWN
requestToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent triggering outside click
  requestDropdown.classList.toggle("request-hidden");
});

// Generate a random profile image
function randomProfile() {
  const gender = Math.random() > 0.5 ? "men" : "women";
  const id = Math.floor(Math.random() * 100);
  return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
}

// SAMPLE DATA
const requests = [
  {
    id: 1,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “School Essay Draft…”",
  },
  {
    id: 2,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “History Paper…”",
  },
  {
    id: 3,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “Science Report…”",
  },
  {
    id: 4,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “School Essay Draft…”",
  },
  {
    id: 5,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “History Paper…”",
  },
  {
    id: 6,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “Science Report…”",
  },
  {
    id: 7,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “School Essay Draft…”",
  },
  {
    id: 8,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “History Paper…”",
  },
  {
    id: 9,
    img: randomProfile(),
    title: "School Essay",
    time: "1 month ago",
    message: "Liam is inviting you to a new paper: “Science Report…”",
  },
];

// RENDER UI
function renderRequests() {
  const isHidden = requestDropdown.classList.contains("request-hidden");
  updateRequestCount();
  requestDropdown.innerHTML = `
    <div class="request-header">
      <div class="request-title">
        <span>New Request</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#D7D7D7" d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"/></svg>
        <span class="request-count">${requests.length} new</span>
      </div>
      <div class="close-request-dropdown" id="closeDropdownBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#667085" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>
      </div>
    </div>
  `;

  // close button in header
  document.getElementById("closeDropdownBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    requestDropdown.classList.add("request-hidden");
  });

  // list items
  requests.forEach((req) => {
    const item = document.createElement("div");
    item.className = "request_item";
    item.dataset.id = req.id;

    item.innerHTML = `
      <div class="profile">
        <img src="${req.img}">
      </div>

      <div class="content">
        <div class="row1">
          <span class="title">${req.title}</span>
          <span class="time">${req.time}</span>
        </div>
        <div class="message">${req.message}</div>
        <a class="preview">Preview Paper</a>
      </div>

      <div class="actions">
        <button class="accept">✔</button>
        <button class="decline">✕</button>
      </div>
    `;

    // Accept
    item.querySelector(".accept").addEventListener("click", (e) => {
      e.stopPropagation();
      removeRequest(req.id);
    });

    // Decline
    item.querySelector(".decline").addEventListener("click", (e) => {
      e.stopPropagation();
      removeRequest(req.id);
    });

    requestDropdown.appendChild(item);
  });

  // Keep hidden state if it was closed
  if (isHidden) requestDropdown.classList.add("request-hidden");
}

// REMOVE ONE ITEM
function removeRequest(id) {
  const index = requests.findIndex((r) => r.id === id);
  if (index !== -1) {
    const el = document.querySelector(`.request_item[data-id="${id}"]`);
    el.classList.add("fade_out");

    setTimeout(() => {
      requests.splice(index, 1);
      renderRequests();
      updateRequestCount();
    }, 300);
  }
}

renderRequests();

// CLICK OUTSIDE TO CLOSE DROPDOWN
document.addEventListener("click", (e) => {
  // If click is inside the request component → ignore
  if (e.target.closest("requestToggle")) return;

  // Otherwise → close dropdown
  requestDropdown.classList.add("request-hidden");
});
