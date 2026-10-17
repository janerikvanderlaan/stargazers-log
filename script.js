const list = document.querySelector("#repositories-list");
const status = document.querySelector("#repositories-status");

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`La requête a échoué (statut ${response.status})`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Les données des dépôts doivent être un tableau JSON");
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
      date.textContent = `Ajouté le ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}`;

      item.append(link, description, date);
      fragment.append(item);
    }

    list.replaceChildren(fragment);
    status.textContent = repositories.length
      ? `${repositories.length} dépôt${repositories.length > 1 ? "s" : ""} étoilé${repositories.length > 1 ? "s" : ""}`
      : "Aucun dépôt étoilé pour le moment.";
  } catch (error) {
    console.error("Impossible de charger les dépôts étoilés :", error);
    status.textContent = "Impossible de charger les dépôts. Réessayez plus tard.";
  }
}

loadRepositories();
