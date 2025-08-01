async function getSearchUsers(num) {
  const response = await fetch(`https://randomuser.me/api/?results=${num}`);
  const data = await response.json();

  return data.results.map((d) => {
    return {
      name: `${d.name.first} ${d.name.last}`,
      photo: d.picture.medium,
    };
  });
}

// Search results accounts
const resultAccountContainer = document.getElementById("search_accounts_results");
async function renderSearchAccount() {
  const accounts = await getSearchUsers(3);

  if (!accounts.length) return;

  accounts.forEach((acc) => {
    const html = `
                 <li class="account_list">
                    <a href="/profile.html" class="account_list-profile">
                      <img src="${acc.photo}" alt="User profile" class="rounded-full" />
                      <span class="account_list-profile-name">${acc.name}</span>
                    </a>
                    <a href="#" class="account_list-follow">Follow</a>
                  </li>
        `;

    resultAccountContainer.insertAdjacentHTML("beforeend", html);
  });
}

const resultCreatorsContainer = document.getElementById("search_creators_results");
async function renderCreatorAccount() {
  const creators = await getSearchUsers(2);

  if (!creators.length) return;

  creators.forEach((acc) => {
    const html = `
                <li class="account_list">
                    <a href="/profile.html" class="account_list-profile">
                      <img src="${acc.photo}" alt="User profile" class="rounded-md" />
                      <span class="account_list-profile-name">${acc.name}</span>
                    </a>
                    <a href="#" class="account_list-follow">Follow</a>
                  </li>
        `;

    resultCreatorsContainer.insertAdjacentHTML("beforeend", html);
  });
}

const resultLiveContainer = document.getElementById("search_live_results");
async function renderLiveAccount() {
  const lives = await getSearchUsers(20);

  if (!lives.length) return;

  lives.forEach((acc) => {
    const html = `
                <li class="result_category-list-box">
                    <div class="live-wrapper">
                      <div class="live-img-wrapper">
                        <img src="${acc.photo}" alt="live image" />
                      </div>
                      <div class="live-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 24 24"><path fill="white" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></svg>
                        <span class="live-label">Live</span>
                      </div>
                    </div>
                  </li>
        `;

    resultLiveContainer.insertAdjacentHTML("beforeend", html);
  });
}

// Navbar Form
const navbarForm = document.getElementById("navbar_search_form");
navbarForm.addEventListener("submit", function (e) {
  const inputValue = this.querySelector("input").value;

  // prevent browser default behaviour on form
  e.preventDefault();

  if (inputValue === "not found") {
    location.href = "not-found.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderSearchAccount();
    renderCreatorAccount();
    renderLiveAccount();
  }, 4000);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#search_dialog") && !e.target.closest("#navbar_search_form")) {
    document.getElementById("search_dialog").style.display = "none";
  }
});

document.querySelector(".navbar-search-input").addEventListener("input", (e) => {
  if (e.target.value) {
    document.getElementById("search_dialog").style.display = "block";
  } else {
    document.getElementById("search_dialog").style.display = "none";
  }
});
