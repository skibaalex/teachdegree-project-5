/**
 * Get Users
 */
const getUsers = async () => {
    const response = await fetch('https://randomuser.me/api/?results=12')
    return await response.json()
}


/**
 * Display Modal for Employee
 * @param {object} user 
 */
const displayModal = (user) => {
    const {  }
    const html = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">(555) 555-5555</p>
                <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                <p class="modal-text">Birthday: 10/21/2015</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `
    const modal = document.createElement('div')
    modal.className = 'modal-container'
    modal.innerHTML = html;
    document.querySelector('body').appendChild(modal)
}



/**
 * renders the users to the gallery
 * @param {array} users 
 */
const renderUsers = (users) => {
    const gallery = document.getElementById('gallery')
    users.forEach(user => {
        const html = `
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
        `
        const div = document.createElement('div')
        div.className = 'card'
        div.innerHTML = html
        gallery.appendChild(div)
        div.addEventListener('click', () => displayModal(user))
    })
}


/**
 * Initializing the App
 */
const initializeApp = () => {
    getUsers().then(data => {
        renderUsers(data.results)
    }).catch(err => {
        console.error(err)
        document.getElementById('gallery').innerHTML = "<h2>Sorry Something Went Wrong</h2>"
    })
}




//Initialize the App
$(document).ready(() => {
    initializeApp()
})