var currentpage = 1;
var id;

async function fetchuser() {
  event.preventDefault();
  showloader();
  try {
    id = document.getElementById("username").value;
    const response = await fetch(`https://api.github.com/users/${id}`);

    if (!response.ok) {
      // Handle other errors
      throw new Error(`Error: ${response.status}`);
    }

    const res = await response.json();
    getrepos(id);
    updateprofile(res);
  } catch (error) {
    console.log(error);
  }
}

function updateprofile(data) {
  // event.preventDefault()

  const name = document.getElementById("name");
  const bio = document.getElementById("bio");

  const following = document.getElementById("following");

  const followers = document.getElementById("followers");

  const repos = document.getElementById("repo");

  const proimg = document.getElementById("image");

  proimg.src = data.avatar_url;

  name.innerHTML = data.name;

  bio.innerHTML = data.bio;

  following.innerHTML = data.following;

  followers.innerHTML = data.followers;

  repos.innerHTML = data.public_repos;

  if (data.public_repos === 0) {
    const dis = document.getElementById("repotable");

    dis.innerHTML = "No Repos Available";
  }
}

function showloader() {
  document.getElementById("loader").style.display = "block";
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("profilesection").style.display = "block";
}

async function getrepos() {
  const meta = document.getElementById("reposearch");

  const selector = document.getElementById("pageselector");

  const noofreposperpage = selector.value;

  try {
    const response = await fetch(
      `https://api.github.com/users/${id}/repos?page=${currentpage}&per_page=${noofreposperpage}`
    );

    if (!response.ok) {
      // Handle other errors
      throw new Error(`Error: ${response.status}`);
    }

    const res = await response.json();

    const metadata = meta.value;

    const filteredRepos = res.filter((repo) => {
      // Customize the condition based on your metadata requirements
      return repo.name && repo.name.includes(metadata);
    });

    displayrepos(filteredRepos);
  } catch (error) {
    console.log(error);
  }
}

function setcurrentpage(pageno) {
  currentpage = pageno;
  getrepos();
}

function incrementpage() {
  currentpage++;
  getrepos();
}

function decrementpage() {
  currentpage--;
  getrepos();
}

function displayrepos(data) {
  const dis = document.getElementById("repotable");

  const formattteddata = data.map((ele, idx) => {
    return `
    <div class="card mb-3 style="width: 400px"">
    <div class="row no-gutters">
      <div class="col-md-4">  
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${ele.name}</h5>
          <p class="card-text">${ele.description}</p>
  ${
    ele.topic
      ? ele.topic.forEach((element) => {
          `<p class="card-text">${element}</p> `;
        })
      : `<p class="card-text">No topics</p>`
  }

          <p class="card-text"><small class="text-muted">No of Watchers: ${
            ele.watchers_count
          }</small></p>
        </div>
      </div>
    </div>
  </div>`;
  });

  dis.innerHTML = formattteddata;
}
