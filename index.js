
// Get list of current projects.
fetch("/projects/list.txt").then(res => {
    res.text().then(data => {
        document.querySelector("#projects").innerHTML = ""
        for (project of data.split('\n')) {
            console.log("Loading project: " + project)
            load_project(project);
            console.log("Finished list loading project: " + project)
        }
    })
})

// Load project info
async function load_project(name) {
    console.log("Loading project: " + name)
    await fetch(`/projects/${name}/info.json`).then(res => {
        res.json().then(data => {
            console.log("Inserting html for next project: " + name)
            document.querySelector("#projects").innerHTML += `<div class="hero-wrapper">
    <div class="hero-split">
        <img src="/projects/${name}/thumbnail.${data.thumbnailtype}" loading="lazy" alt="Thumbnail" class="shadow-two thumbnail">
    </div>
    <div class="hero-split">
        <h1>${data.title}</h1>
        <p class="margin-bottom-24px">${data.description}</p>
        <a href="/projects/${name}/" class="button-primary">View</a>
    </div>
</div>`
        })
        console.log("Html inserted for project: " + name)
    })
    console.log("Finished loading project: " + name)
}
