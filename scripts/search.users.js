document.addEventListener("DOMContentLoaded", () => {
  const shareUserContainer = document.getElementById("shareUser");

  // Function to fetch users from the Random User API
  const fetchUsers = async (userCount = 20) => {
    // Show a loading message while fetching
    shareUserContainer.innerHTML = "<p>Loading users...</p>";

    try {
      const response = await fetch(
        `https://randomuser.me/api/?results=${userCount}`
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const users = data.results;

      // Clear the loading message
      shareUserContainer.innerHTML = "";

      // Call the function to display the users
      displayUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Display an error message to the user
      shareUserContainer.innerHTML =
        "<p>Could not load users. Please try again later.</p>";
    }
  };

  // Function to create and inject the HTML for each user
  const displayUsers = (users) => {
    users.forEach((user) => {
      // Extract the first name and the large profile picture
      const firstName = user.name.first;
      const profilePicture = user.picture.large;

      // Create the HTML markup for a single user
      const userHtml = `
        <div class="share_user-item" title="${firstName}">
          <img src="${profilePicture}" alt="Profile picture of ${firstName}" class="share_user-avatar">
          <span class="share_user-name">${firstName}</span>
        </div>
      `;

      // Inject the HTML into the container
      shareUserContainer.insertAdjacentHTML("beforeend", userHtml);
    });
  };

  // Initial call to fetch and display the users when the page loads
  fetchUsers();
});
