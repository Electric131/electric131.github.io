
// Get list of current projects.
setTimeout(() => {
    fetch("/projects/list.txt").then(res => {
        res.text().then(data => {
            document.querySelector("#projects").innerHTML = ""
            for (project of data.split('\n')) {
                console.log("Loading project " + project)
                load_project(project);
            }
        })
    })
}, 10)

// Load project info
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
    })
}
