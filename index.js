
// Get list of current projects.
fetch("/projects/list.txt").then(res => {
    res.text().then(data => {
        load_project(data);
    })
})

// Load project info
function load_project(name) {
    fetch(`/projects/${name}/info.json`).then(res => {
        res.json().then(data => {
            return
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