const products = [
  {
    id: 1,
    img: "imgs/stethoscope.jpg",
    title: "Professional Stethoscope",
    price: 49.99,
    category: "Diagnostics",
  },
  {
    id: 2,
    img: "imgs/blood-pressure-monitor.jpg",
    title: "Blood Pressure Monitor",
    price: 79.5,
    category: "Diagnostics",
  },
  {
    id: 3,
    img: "imgs/surgical-gloves.webp",
    title: "Disposable Surgical Gloves",
    price: 18.75,
    category: "Consumables",
  },
  {
    id: 4,
    img: "imgs/examination-light.png",
    title: "Medical Examination Light",
    price: 129.99,
    category: "Equipment",
  },
  {
    id: 5,
    img: "imgs/syringe.jpg",
    title: "Disposable Syringes",
    price: 22.4,
    category: "Consumables",
  },
  {
    id: 6,
    img: "imgs/otoscope.webp",
    title: "Diagnostic Otoscope Set",
    price: 95.0,
    category: "Diagnostics",
  },
  {
    id: 7,
    img: "imgs/thermometer.jpg",
    title: "Forehead Thermometer",
    price: 35.0,
    category: "Diagnostics",
  },
  {
    id: 8,
    img: "imgs/pulse-oximeter.webp",
    title: "Finger Pulse Oximeter",
    price: 27.99,
    category: "Monitoring",
  },
];

const sessionUser = JSON.parse(sessionStorage.getItem("currentUser"));
const localUser = JSON.parse(localStorage.getItem("currentUser"));
const currentUser = sessionUser || localUser;

let userCart = {};
let userFavourites = {};

if (currentUser) {
  userCart = currentUser.cart;
  userFavourites = currentUser.favourites;
}

function CheckLogin() {
  const user = document.getElementById("user");
  const noUser = document.getElementById("no-user");

  if (!currentUser) {
    noUser.classList = "";
    user.classList = "flex-row justify-content-between gap-3 d-none";
  } else {
    noUser.classList = "d-none";
    user.classList = "flex-row justify-content-between gap-3";

    const currentUserName = document.getElementById("current-user");
    currentUserName.innerHTML = `${currentUser.firstName} ${currentUser.lastName}`;
  }
}

function Logout() {
  localStorage.setItem("currentUser", null);
  sessionStorage.setItem("currentUser", null);

  location.replace("index.html");
}

function UpdateCartInStorage() {
  if (sessionUser) {
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else if (localUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let newUsers = users.map((user) => {
    if (user.email == currentUser.email) {
      return {
        ...user,
        ...currentUser,
      };
    } else {
      return { ...user };
    }
  });

  localStorage.setItem("users", JSON.stringify(newUsers));
}

function RenderList(
  itemsParent,
  itemsList,
  CreateItemCard,
  filter = "",
  filterValue = "",
) {
  itemsParent.innerHTML = "";

  if (filterValue != "") {
    searchItems = itemsList.filter((item) =>
      item[filter]
        .toLocaleLowerCase()
        .includes(filterValue.toLocaleLowerCase()),
    );
  } else {
    searchItems = itemsList;
  }

  if (searchItems.length == 0) {
    let noItemsFound = `<h2 class="text-center">No Items Found! 😐</h2>`;
    itemsParent.innerHTML += noItemsFound;
    return;
  }

  searchItems.forEach((item) => {
    let createdCard = CreateItemCard(item);
    itemsParent.innerHTML += createdCard;
  });
}

function UpdateCartCounter() {
  const cartNumOfItems = document.getElementById("num-of-items");

  if (cartNumOfItems) {
    cartNumOfItems.innerHTML = Object.keys(userCart).length;
  }
}

function RenderDictionary(
  itemsParent,
  itemsDict,
  CreateItemCard,
  type = "cart-menu",
) {
  itemsParent.innerHTML = "";
  UpdateCartCounter();
  UpdateCartInStorage();

  if (Object.keys(itemsDict).length == 0) {
    let noItemsFound = `<h3 class="text-center">No Items Yet 😐</h3>`;
    itemsParent.innerHTML += noItemsFound;

    if (type == "cart-menu") {
      const cartBtn = document.querySelector(".cart-btn");
      cartBtn.innerHTML = "";
      ShowAllProductsBtn(cartBtn);
    }
    return;
  }

  for (const id in itemsDict) {
    let product = products.find((product) => product.id == id);
    let createdCard = CreateItemCard({ ...product, quantity: userCart[id] });
    itemsParent.innerHTML += createdCard;
  }

  if (type == "cart-menu") {
    const cartBtn = document.querySelector(".cart-btn");
    cartBtn.innerHTML = "";
    ShowAllProductsBtn(cartBtn);
  }
}

function ShowAllProductsBtn(btnElement) {
  let btnComponent = `<hr/>
  <a href="view-cart.html" class="btn my-btn-primary w-100">View All Products</a>`;

  btnElement.innerHTML += btnComponent;
}
