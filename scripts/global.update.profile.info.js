/**
 * @fileoverview This script updates the user's profile information on the webpage using data from local storage.
 * It updates various profile elements such as the user's photo, name, bio, interests, education, occupation, and social links.
 * The script also handles the display of additional interests in a tooltip if the user has more than four interests.
 */

function updateAccountProfile() {
  // get user from localstorage
  const userInfo = getDummyUser();
  const userLittleInfo = document.getElementById("userLittleInfo");
  const userAccountType = localStorage.getItem("user-account-type") ?? "normal-account";
  const pathname = location.pathname;

  /**
   * Updates the user's profile information on the webpage using data from local storage.
   * It updates the user's photo, name, bio, interests, education, occupation, and social links (if there is social on the page).
   */

  // Update User Photo
  const profileHeaderImg = document.getElementById("profileHeaderImg");
  profileHeaderImg.src = userInfo?.image ?? "./images/creator-profile/creator-avatar.webp";

  // Profile Name
  const profileName = document.getElementById("profileName");
  profileName.innerText = userInfo.fullName ? userInfo.fullName : "username";

  // Check if the user has provided bio information
  const profileAboutContainer = document.getElementById("profileAboutContainer");
  const expandedDescription = profileAboutContainer.querySelector("#expandedDescription");
  const addDescription = profileAboutContainer.querySelector(".add");

  if (userInfo?.bio) {
    const bioContent = document.getElementById("bioContent");

    bioContent.innerText = userInfo.bio;
    bioContent.classList.add("real_content");

    if (pathname === "/creator-account-profile.html" || pathname === "/account-profile.html") {
      expandedDescription?.classList.remove(HIDDEN);
      addDescription?.remove();
    } else {
      expandedDescription?.classList.remove(HIDDEN);
      addDescription?.remove();
    }
  } else {
    if (pathname === "/creator-account-profile.html" || pathname === "/account-profile.html") {
      expandedDescription?.remove();
      addDescription?.classList.remove(HIDDEN);
    }
  }

  // Check if the user has provided interests information and is not empty
  if (userInfo?.interests?.length) {
    // Get the interests wrapper and container elements
    const profileInterestsContainer = document.getElementById("profileInterestsContainer");
    const profileAddInterests = document.getElementById("profileAddInterests");

    // Remove the interests wrapper
    profileAddInterests?.remove();

    // Clear the existing interests list
    profileInterestsContainer.innerHTML = "";

    // Add each interest to the list, up to a maximum of 12
    userInfo.interests.forEach((int, i) => {
      const color = getRandomGeneratedColor();

      const markup = `<button style="border: 1px solid ${color}; color: ${color}" class="add_interests">${int}</button>`;
      profileInterestsContainer.insertAdjacentHTML("beforeend", markup);
    });

    // If there are more than 4 interests, add a tooltip for the remaining interests
    if (userInfo.interests.length > 12) {
      profileInterestsContainer.insertAdjacentHTML("beforeend", `<button id="interest-tooltip-more" aria-expanded="false">+${userInfo.interests.length - 12}</button>`);

      const interestTooltipContainer = `
                          <div id="interest-tooltip-markup" class="interest-more-container">
                            <div class="interest-filter-container">
                              <span class="icon">
      
                                <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9.16537" cy="9.16537" r="5.83333" stroke="#666666" stroke-opacity="0.6" stroke-width="2"/><path d="M16.668 16.668L14.168 14.168" stroke="#666666" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/></svg>
                              </span>
                              <input type="text" id="tooltipInterest" placeholder="Filter interests..." />
                            </div>
      
                            <ul class="thin-scroll-bar">
                              ${userInfo.interests.map((int) => `<li>${int}</li>`).join("")}
                            </ul>
                          </div>
            `;

      profileInterestsContainer.insertAdjacentHTML("beforeend", interestTooltipContainer);
    }

    // Show the interests container
    profileInterestsContainer.classList.remove(HIDDEN);

    // Initialize the tooltip for the remaining interests
    tippy("#interest-tooltip-more", {
      content: document.getElementById("interest-tooltip-markup"), // Correct ID
      allowHTML: true, // Enable HTML content inside the tooltip
      placement: "right", // Position of the tooltip
      interactive: true, // Allow interaction with the content
      animation: "fade", // Smooth fade effect
      arrow: true, // Show arrow
      theme: "custom", // Use a custom theme
      trigger: "click", // Show tooltip on click
    });
  }

  // Check if the user has provided username information
  if (userInfo?.username) {
    const profileUsernameValue = document.getElementById("profileUsernameValue");

    // Set a data attribute to indicate that username information is available
    userLittleInfo.setAttribute("data-username", true);
    // Update the username status element with the user's username information
    profileUsernameValue.innerText = userInfo.username;
  }

  // Check if the user has provided location information
  if (userInfo?.location) {
    const profileLocationValue = document.getElementById("profileLocationValue");

    // Set a data attribute to indicate that location information is available
    userLittleInfo.setAttribute("data-location", true);
    // Update the location status element with the user's location information
    profileLocationValue.innerText = userInfo.location;
  }

  // Check if the user has provided education information
  if (userInfo?.education) {
    const educationStatusValue = document.getElementById("educationStatusValue");

    // Set a data attribute to indicate that education information is available
    userLittleInfo.setAttribute("data-education", true);
    // Update the education status element with the user's education information
    educationStatusValue.innerText = userInfo.education;
  }

  // Check if the user has provided occupation information
  if (userInfo?.occupation) {
    const workExperienceValue = document.getElementById("workExperienceValue");

    // Set a data attribute to indicate that occupation information is available
    userLittleInfo.setAttribute("data-work", true);
    // Update the work experience element with the user's occupation information
    workExperienceValue.innerText = userInfo.occupation;
  }

  /**
   * Updates the social link element's data-info attribute based on the provided state.
   * @param {string} socialEl - The ID of the social link element.
   * @param {boolean} state - The state indicating whether the social link is available.
   */
  function updateSocialHandler(socialEl, state) {
    const socialVar = document.getElementById(socialEl);

    if (state) {
      socialVar?.setAttribute("data-info", true);
    } else {
      socialVar?.removeAttribute("data-info");
    }
  }

  // Show Website Link
  if (userInfo?.website_link) {
    updateSocialHandler("socialItemHolderWebsite", true);
  } else {
    updateSocialHandler("socialItemHolderWebsite", false);
  }

  // Show Email Address
  if (userInfo?.email) {
    updateSocialHandler("socialItemHolderEmail", true);
  } else {
    updateSocialHandler("socialItemHolderEmail", false);
  }

  // Show User Phone number
  if (userInfo?.phone_number) {
    updateSocialHandler("socialItemHolderPhone", true);
  } else {
    updateSocialHandler("socialItemHolderPhone", false);
  }
}

// Initial update
updateAccountProfile();

/**
 *
 *
 *
 *
 *
 * Visitor Profile View Handlers
 *
 *
 *
 *
 *
 */
// Follow User
const visitorFollowUser = document.getElementById("visitorFollowUser");

visitorFollowUser?.addEventListener("click", function () {
  const status = this.getAttribute("data-status");

  if (status === "unfollow") {
    this.setAttribute("data-status", "follow");
    this.textContent = "Unfollow";
  } else {
    this.setAttribute("data-status", "unfollow");
    this.textContent = "Follow";
  }
});
