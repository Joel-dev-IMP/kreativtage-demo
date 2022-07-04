let selectedProjects = []

function testtwo(t) {
    console.log(t);
    let value = JSON.stringify([t.dataset.value, t.parentElement.parentElement.parentElement.children[0].innerText]);


    if (selectedProjects.find(i => i == value)) {
        selectedProjects.splice(selectedProjects.indexOf(value), 1)
        t.parentElement.parentElement.parentElement.classList.remove("selected")
        // console.log(selectedProjects)
        selectedProjectsList()
        return
    }

    if (selectedProjects.length < 5) {
        // console.log(t)
        // console.log(value)
        selectedProjects.push(value)
        t.parentElement.parentElement.parentElement.classList.add("selected")
        console.log(selectedProjects)
        selectedProjectsList()
    }
}

function swapProjects(a, b) {
    let originalA = selectedProjects[a];

    selectedProjects[a] = selectedProjects[b];
    selectedProjects[b] = originalA;

    selectedProjectsList();
}

function selectedProjectsList() {
    const container = document.getElementById("selected-projects-container");
    if (container.lastChild) {
        container.removeChild(container.lastChild);
    }

    const projects = document.createElement("div")

    for (let i = 0; i < selectedProjects.length; i++) {
        const e = selectedProjects[i];

        let value = JSON.parse(e);
        // console.log(value)

        const row = document.createElement("div");
        row.className = "row"

        const text = document.createElement("div");
        text.innerText = value[1];

        const upButton = document.createElement("button");
        upButton.onclick = () => { swapProjects(i - 1, i); };
        upButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"
xmlns="http://www.w3.org/2000/svg">
<path d="M18 14L10 5L2 14" stroke="black"/>
</svg>
`;
        upButton.className = "btn btn-small"

        const downButton = document.createElement("button");
        downButton.onclick = () => { swapProjects(i, i + 1); };
        downButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6L10 15L18 6" stroke="black"/>
        </svg>`;
        downButton.className = "btn btn-small"

        const input = document.createElement("input")
        input.value = value[0]
        input.type = "hidden"
        input.name = `Wahl${i + 1}`

        row.appendChild(input);
        row.appendChild(text);
        row.appendChild(upButton);
        row.appendChild(downButton);


        projects.appendChild(row)
    };

    container.appendChild(projects)
}

function changeProjects() {

}