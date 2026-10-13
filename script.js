const status = document.querySelector("#status");
const repositoryList = document.querySelector("#repositories");

function isRepository(value) {
  if (
    typeof value !== "object" ||
    value === null ||
    typeof value.name !== "string" ||
    typeof value.url !== "string" ||
    typeof value.description !== "string" ||
    typeof value.language !== "string" ||
    typeof value.stars !== "number"
  ) {
    return false;
  }

  try {
    const url = new URL(value.url);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

  for (const repository of repositories) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const description = document.createElement("p");
    const details = document.createElement("p");

    link.href = repository.url;
    link.textContent = repository.name;
    description.textContent = repository.description;
    details.className = "repository-details";
    details.textContent = `${repository.language} · ${repository.stars.toLocaleString()} stars`;

    item.append(link, description, details);
    repositoryList.append(item);
  }
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories) || !repositories.every(isRepository)) {
      throw new Error("Repository data is invalid.");
    }

    renderRepositories(repositories);
    status.textContent = repositories.length
      ? `${repositories.length} repositories`
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Failed to load starred repositories:", error);
    status.textContent = "Could not load starred repositories. Please try again later.";
  }
}

loadRepositories();
