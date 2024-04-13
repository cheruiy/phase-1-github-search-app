// index.js

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const toggleButton = document.getElementById("toggleButton"); // Bonus
    const resultsDiv = document.getElementById("results");
  
    let searchType = "users"; // Default search type
  
    searchForm.addEventListener("submit", async event => {
      event.preventDefault();
  
      const query = searchInput.value.trim();
      if (query === "") return;
  
      try {
        let response;
        if (searchType === "users") {
          response = await fetch(`https://api.github.com/search/users?q=${query}`);
        } else if (searchType === "repos") { // Bonus
          response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch data from GitHub");
        }
  
        const data = await response.json();
  
        // Clear previous search results
        resultsDiv.innerHTML = "";
  
        if (searchType === "users") {
          displayUsers(data.items);
        } else if (searchType === "repos") { // Bonus
          displayRepositories(data.items);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    });
  
    // Bonus: Toggle search type
    toggleButton.addEventListener("click", () => {
      searchType = searchType === "users" ? "repos" : "users";
      searchInput.placeholder = `Search for ${searchType}`;
    });
  
    function displayUsers(users) {
      users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.innerHTML = `
          <h3>${user.login}</h3>
          <img src="${user.avatar_url}" alt="${user.login}" width="100">
          <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        userDiv.addEventListener("click", () => {
          fetchRepositories(user.login);
        });
        resultsDiv.appendChild(userDiv);
      });
    }
  
    async function fetchRepositories(username) {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const repositories = await response.json();
        displayRepositories(repositories);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  
    function displayRepositories(repositories) {
      resultsDiv.innerHTML = "";
      repositories.forEach(repo => {
        const repoDiv = document.createElement("div");
        repoDiv.innerHTML = `
          <h3>${repo.full_name}</h3>
          <p>${repo.description}</p>
          <a href="${repo.html_url}" target="_blank">Repository</a>
        `;
        resultsDiv.appendChild(repoDiv);
      });
    }
  });
  