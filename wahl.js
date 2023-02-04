function getSelectedProjects() {
  let selectedProjects = [];
  document.querySelectorAll(".drag-container>div").forEach((selected) => {
    selectedProjects.push(selected.dataset.value);
  });

  return selectedProjects;
}

function handleSelect({ target }) {
  const projectId = target.dataset.value;
  const projectName =
    target.parentElement.parentElement.parentElement.children[0].innerText;

  const container = document.querySelector(".drag-container");

  const selectedProjects = getSelectedProjects();
  console.log(selectedProjects);
  console.log(target);

  // Projekt entfernen
  if (selectedProjects.includes(projectId)) {
    // Projekt, das entfernt werden soll, aus der Drag-n-drop-Liste auswählen und entfernen.
    const removedProject = container.querySelector(
      `div[data-value="${projectId}"]`
    );
    container.removeChild(removedProject);

    container.style.height = 6 * (selectedProjects.length - 1) + "rem";

    // Projekt in der Liste als "Nicht ausgewählt" markieren.
    target.parentElement.parentElement.parentElement.classList.remove(
      "selected"
    );
    target.innerText = "Auswählen";

    return;
  }

  if (selectedProjects.length >= 5) {
    // Es dürfen nur fünf Projekte gewählt werden.
    return;
  }

  // Add the project to the selected projects list.
  target.parentElement.parentElement.parentElement.classList.add("selected");
  target.innerText = "Auswahl aufheben";

  container.style.height = 6 * (selectedProjects.length + 1) + "rem";

  addProject(projectId, projectName);
  console.log(selectedProjects);
}

function addProject(projectId, projectName) {
  const container = document.querySelector(".drag-container");
  const index = container.children.length + 1;

  const draggable = document.createElement("div");
  draggable.classList.add("draggable");
  draggable.dataset.index = index;
  draggable.dataset.value = projectId;
  draggable.draggable = false;
  draggable.innerText = projectName;

  container.appendChild(draggable);
}

function validateSubmit() {
  const selectedProjects = getSelectedProjects();
  console.log(selectedProjects);

  if (selectedProjects.length !== 5) {
    return false;
  }

  const container = document.querySelector(".drag-container");

  // Sicherstellen, dass ansonsten keine Inputs im Formular sind (keine Daten doppelt/verfälscht geschickt werden)
  let inputs = container.parentElement.getElementsByTagName("input");
  while (inputs.length > 0) {
    container.removeChild(inputs[0]);
  }

  selectedProjects.forEach((projectId, index) => {
    const input = document.createElement("input");
    input.value = projectId;
    input.type = "hidden";
    input.name = `Wahl${index + 1}`;

    container.appendChild(input);
  });

  return true;
}

console.log(document.querySelectorAll(".select-button"));
document.querySelectorAll(".select-button").forEach((button) => {
  button.addEventListener("click", handleSelect);
});
