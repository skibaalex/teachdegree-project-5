let employees = [];

/**
 * Get employees
 */
const getemployees = async () => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "<h2 class='card-name'>Loading ...</h2>";
  const response = await fetch("https://randomuser.me/api/?results=12");
  return await response.json();
};

const formatPhoneNUmber = (number) => {
  const phoneFormat = /^(\d{3})(\d{3})(\d{4})/;
  const normalizedPhone = number.replace(/\D/g, "");
  return normalizedPhone.replace(phoneFormat, "($1) $2-$3");
};

const formatDate = (date) => {
  const dateObject = new Date(date);
  return `${
    dateObject.getMonth() + 1
  }/${dateObject.getDay()}/${dateObject.getFullYear()}`;
};

const getModalHtml = (employee, animate) => {
  const { location } = employee;
  return `
<div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${
              employee.picture.large
            }" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first} ${
    employee.name.last
  }</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${formatPhoneNUmber(employee.phone)}</p>
            <p class="modal-text">${location.street.number} ${
    location.street.name
  }, ${location.city}, ${
    location.country !== "United States"
      ? location.country
      : `${location.state} ${location.postcode}`
  } </p>
            <p class="modal-text">Birthday: ${formatDate(employee.dob.date)}</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
`;
};

/**
 * Handle pagination of the employees in the modal view
 * @param {object} employee object that contains employee information
 * @param {array} employees array of all employees
 */
const handleModalPagination = (employee, employees) => {
  const prevBtn = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");
  const btnContainer = document.querySelector(".modal-btn-container");
  const employeeIndex = employees.indexOf(employee);
  const modal = document.querySelector(".modal-container");
  if (employeeIndex === 0) btnContainer.removeChild(prevBtn);
  if (employeeIndex === employees.length - 1) btnContainer.removeChild(nextBtn);
  prevBtn.addEventListener("click", () => {
    document.querySelector("body").removeChild(modal);
    displayModal(employees[employeeIndex - 1], employees);
  });
  nextBtn.addEventListener("click", () => {
    document.querySelector("body").removeChild(modal);
    displayModal(employees[employeeIndex + 1], employees);
  });
  if (employees.length === 1) {
    modal.removeChild(btnContainer);
  }
};

/**
 * Display Modal for Employee
 * @param {object} employee
 */
const displayModal = (employee, employees, animate) => {
  const html = getModalHtml(employee, animate);
  const modal = document.createElement("div");
  modal.className = "modal-container";
  modal.innerHTML = html;
  const body = document.querySelector("body");
  body.appendChild(modal);
  const closeBtn = document.getElementById("modal-close-btn");
  closeBtn.addEventListener("click", (e) => {
    body.removeChild(modal);
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && Array.from(body.children).includes(modal))
      body.removeChild(modal);
  });
  modal.addEventListener("click", (e) => {
    if (e.target.className === "modal-container") body.removeChild(modal);
  });
  handleModalPagination(employee, employees);
};

/**
 * renders the employees to the gallery
 * @param {array} employees
 */
const renderEmployees = (employees) => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  employees.forEach((employee) => {
    const html = `
        <div class="card-img-container">
            <img class="card-img" src="${employee.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="card-text">${employee.email}</p>
            <p class="card-text cap">${employee.location.city}</p>
        </div>
        `;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = html;
    gallery.appendChild(div);
    div.addEventListener("click", () => {
      displayModal(employee, employees, true);
    });
  });
};

const checkName = (name, input) => {
  var pattern = input.toLowerCase();
  return name.includes(pattern);
};

const handleSearch = (value) => {
  const filteredEmployees = employees.filter((employee) => {
    const fullname = `${employee.name.first} ${employee.name.last}`.toLocaleLowerCase();
    return checkName(fullname, value);
  });
  renderEmployees(filteredEmployees);
};

const renderSearchBar = () => {
  const inputContainer = document.querySelector(".search-container");
  inputContainer.innerHTML = `<form action="#" method="get">
                                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                                </form>`;
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });
  const searchBtn = document.getElementById("search-submit");
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch(searchInput.value);
  });
};

/**
 * Initializing the App
 */
const initializeApp = () => {
  getemployees()
    .then((data) => {
      employees = data.results;
      renderEmployees(employees);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("gallery").innerHTML =
        "<h2>Sorry Something Went Wrong</h2>";
    });
  renderSearchBar();
};

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
