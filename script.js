const list = document.querySelector("#repositories-list");
const status = document.querySelector("#repositories-status");

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a JSON array");
    }

    const fragment = document.createDocumentFragment();
    for (const repository of repositories) {
      const item = document.createElement("li");
      item.className = "repository";

      const link = document.createElement("a");
      link.href = repository.url;
      link.textContent = repository.full_name;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const description = document.createElement("p");
      description.textContent = repository.description;

      const date = document.createElement("time");
      date.dateTime = repository.starred_at;
      date.textContent = `Starred ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}`;

      item.append(link, description, date);
      fragment.append(item);
    }

    list.replaceChildren(fragment);
    status.textContent = repositories.length
      ? `${repositories.length} repositories`
      : "No starred repositories yet.";
  } catch (error) {
    console.error("Unable to load starred repositories:", error);
    status.textContent = "Could not load repositories. Please try again later.";
  }
}

loadRepositories();
