
// Get list of current projects.
let projects = []
fetch("/projects/list.txt").then(res => {
    res.text().then(data => {
        document.querySelector("#projects").innerHTML = ""
        projects = data.split('\n')
        load_next()
    })
})

// Load next project then remove it.
function load_next() {
    if (projects.length > 0) {
        let project = projects[0]
        projects.splice(0, 1)
        console.log("Loading project: " + project)
        load_project(project);
        console.log("Finished loading project: " + project)
    }
}

// Load project info then load next once loaded.
function load_project(name) {
    fetch(`/projects/${name}/info.json`).then(res => {
        res.json().then(data => {
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
        load_next()
    })
}
