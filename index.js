
// Get list of current projects.
fetch("/projects/list.txt").then(res => {
    res.text().then(data => {
        document.querySelector("#projects").innerHTML = ""
        for (project of data.split('\n')) {
            load_project(project);
        }
    })
})

// Load project info
function load_project(name) {
    fetch(`/projects/${name}/info.json`).then(res => {
        res.json().then(data => {
            document.querySelector("#projects").innerHTML += `<div class="hero-wrapper">
    <div class="hero-split">
        <img src="/projects/${name}/thumbnail.${data.thumbnailtype}" loading="lazy" alt="Thumbnail" class="shadow-two">
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


/* <div class="hero-wrapper">
        <div class="hero-split">
            <img src="/projects/genetics-playground/thumbnail.gif" loading="lazy" alt="Thumbnail" class="shadow-two">
        </div>
        <div class="hero-split">
            <h1>Loading...</h1>
            <p class="margin-bottom-24px"></p>
            <a href="/projects/genetics-playground/" class="button-primary">View</a>
        </div>
    </div> */