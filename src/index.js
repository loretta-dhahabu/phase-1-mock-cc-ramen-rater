// write your code here
document.addEventListener("DOMContentLoaded", () => {
  let ramenId;
  let ramenIdArray = [];
  const menu = document.querySelector("#ramen-menu");
  const RamenImages = menu.getElementsByTagName("img");
  const form = document.querySelector("#new-ramen");
//   const breakLine = document.querySelector("br");
  const editForm = document.querySelector("#edit-ramen");
  const newDiv = document.createElement("div");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  editBtn.id = "edit-button";
  editBtn.innerText = "Edit";
  deleteBtn.id = "delete-button";
  deleteBtn.innerText = "Delete";
  newDiv.append(editBtn, deleteBtn);
//   breakLine.after(newDiv);

//   editForm.style.display = "none";

  fetchMenu();

  setTimeout(() => {
    Array.from(RamenImages).forEach((ramen) => {
      ramenIdArray.push(parseInt(ramen.id));
    });
    ramenDetail(Math.min(...ramenIdArray));
  }, 200);

  setTimeout(() => {
    Array.from(RamenImages).forEach((ramen) => {
      ramen.addEventListener("click", (eventFn) => {
        ramenId = eventFn.target.id;
        ramenDetail(ramenId);
      });
    });
  }, 500);

  editBtn.addEventListener("click", (eventFn) => {
    editForm.style.display = "block";
  });

  editForm.addEventListener("submit", (eventFn) => {
    eventFn.preventDefault();
    const newObject = {
      rating: editForm.elements["rating"].value,
      comment: editForm.elements["new-comment"].value,
    };
    updateRamen(ramenId, newObject);
    editForm.reset();
    editForm.style.display = "none";
  });

  deleteBtn.addEventListener("click", (eventFn) => {
    deleteRamen(ramenId);
    location.reload();
  });

  form.addEventListener("submit", (eventFn) => {
    eventFn.preventDefault();
    addNewRamen(eventFn);
    form.reset();
    location.reload();
  });
});

function fetchMenu() {
  fetch("http://localhost:3000/ramens")
    .then((response) => response.json())
    .then((data) => {
      Array.from(data).forEach((ramen) => {
        createMenu(ramen);
      });
    });
}

function createMenu(menuObject) {
  const menu = document.querySelector("#ramen-menu");
  const img = document.createElement("img");
  img.src = menuObject.image;
  img.id = menuObject.id;
  menu.appendChild(img);
}

function ramenDetail(id) {
  const img = document.querySelector(".detail-image");
  const name = document.querySelector("h2, .name");
  const rest = document.querySelector(".restaurant");
  const rating = document.querySelector("#rating-display");
  const comment = document.querySelector("#comment-display");
  fetch(`http://localhost:3000/ramens/${id}`)
    .then((response) => response.json())
    .then((data) => {
      img.src = data.image;
      name.innerText = data.name;
      rest.innerText = data.restaurant;
      rating.innerText = data.rating;
      comment.innerText = data.comment;
    });
}

function addNewRamen(eventFn) {
  const newRamen = {
    name: eventFn.target.elements["name"].value,
    restaurant: eventFn.target.elements["restaurant"].value,
    image: eventFn.target.elements["image"].value,
    rating: eventFn.target.elements["rating"].value,
    comment: eventFn.target.elements["new-comment"].value,
  };
  postNewRamen(newRamen).then((data) => createMenu(data));
}

function postNewRamen(ramenObject) {
  return fetch("http://localhost:3000/ramens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accepter: "application/json",
    },
    body: JSON.stringify(ramenObject),
  })
    .then((response) => response.json())
    .then((data) => data);
}

function updateRamen(id, newObject) {
  fetch(`http://localhost:3000/ramens/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accepter: "application/json",
    },
    body: JSON.stringify(newObject),
  })
    .then((response) => response.json())
    .then((data) => {
      const rating = document.querySelector("#rating-display");
      const comment = document.querySelector("#comment-display");
      rating.innerText = data.rating;
      comment.innerText = data.comment;
    });
}

function deleteRamen(id) {
  fetch(`http://localhost:3000/ramens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const detail = document.querySelector("#ramen-detail");
      console.log(data);
    });
}
    