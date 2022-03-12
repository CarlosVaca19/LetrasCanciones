// App config
const API = "https://api.lyrics.ovh"

// Grab DOM elements
const search = document.querySelector(".search")
const form = document.querySelector(".form")
const content = document.querySelector(".content")

// Listen form form submits
form.addEventListener("submit", event => {
    event.preventDefault()

    const searchTerm = search.value.trim()

    if (!searchTerm) {
        alert("You must type a valid search term")
        return
    } 

    searchSongs(searchTerm)
})

// Search for songs and artists
async function searchSongs(search) {
    const request = await fetch(`${API}/suggest/${search}`)
    const response = await request.json()
    const songs = response
    
    showSongs(songs)
}

// Show fetched songs
function showSongs(songs) {
    content.innerHTML = `
        <ul class="songs">
            ${songs.data.map(song => {
                return `<li class="song">
                            <img class="avatar" src="${song.album.cover}">
                            <span>${song.title} by ${song.artist.name}</span>
                            <button data-title="${song.title}" data-artist="${song.artist.name}" class="show">Show Lyric</button>
                        </li>`
            }).join("")}

            ${ songs.prev ? `<button onclick="showMoreSongs(${songs.prev})">Prev</button>` : ""}
            ${ songs.next ? `<button onclick="showMoreSongs(${songs.next})">Next</button>` : ""}
        </ul>
    `
}

// Show more songs 
async function showMoreSongs(req) {
    console.log(req)
    const request = await fetch(req)
    const response = await request.json()
    console.log(response)
}

content.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON") {
        const element = event.target
        const title = element.getAttribute("data-title")
        const artist = element.getAttribute("data-artist")

        getSong(title, artist)
    }
})

// Get song lyric
async function getSong(title, artist) {
    const request = await fetch(`${API}/v1/${artist}/${title}`)
    const response = await request.json()
    const lyric = response.lyrics
    
    showSong(title, artist, lyric)
}

// Show song lyric
function showSong(title, artist, lyric) {
    lyric = lyric.replace(/(\n\r|\n|\r)/g, "<br>")
    content.innerHTML = `
        <h1 class="title">${title} by ${artist}</h1>
        <p class="lyric">
            ${lyric}
        </p>
   `
}

showMoreSongs("http://api.deezer.com/search?limit=15&q=fuel&index=15")