/* eslint-disable no-undef */
// URL du fichier JSON
const dataLocation = './public/json/photographers-data.json'

// Variable servant à localiser la section contenant les photographes
const photographerSection = document.getElementById('photographer-section')

// Identification des boutons
const allPhotographers = document.getElementById('allPhotographers')

// Sélection des tags
const portraitFilter = document.getElementById('portrait')
const artFilter = document.getElementById('art')
const fashionFilter = document.getElementById('fashion')
const architectureFilter = document.getElementById('architecture')
const travelFilter = document.getElementById('travel')
const sportFilter = document.getElementById('sport')
const animalsFilter = document.getElementById('animals')
const eventsFilter = document.getElementById('events')

// Evènements déclenchés lors de la sélection des tags
allPhotographers.addEventListener('click', displayPhotographers)

portraitFilter.addEventListener('click', filterPhotographer)
artFilter.addEventListener('click', filterPhotographer)
fashionFilter.addEventListener('click', filterPhotographer)
architectureFilter.addEventListener('click', filterPhotographer)
travelFilter.addEventListener('click', filterPhotographer)
sportFilter.addEventListener('click', filterPhotographer)
animalsFilter.addEventListener('click', filterPhotographer)
eventsFilter.addEventListener('click', filterPhotographer)

// Même chose pour la pression de la touche entrée
portraitFilter.addEventListener('keypress', filterPhotographer)
artFilter.addEventListener('keypress', filterPhotographer)
fashionFilter.addEventListener('keypress', filterPhotographer)
architectureFilter.addEventListener('keypress', filterPhotographer)
travelFilter.addEventListener('keypress', filterPhotographer)
sportFilter.addEventListener('keypress', filterPhotographer)
animalsFilter.addEventListener('keypress', filterPhotographer)
eventsFilter.addEventListener('keypress', filterPhotographer)

// Fonction déclenchant l'affichage du bouton passer au contenu lors du scroll
function scrollDiv () {
  const y = window.scrollY
  if (y >= 8) {
    allPhotographers.className = 'content-button--link--show'
  } else {
    allPhotographers.className = 'content-button--link'
  }
}

window.addEventListener('scroll', scrollDiv)

// Fonction permettant l'affichage des photographes

function displayPhotographers () {
  photographerSection.innerHTML = ''

  // Récupération des données des photographes
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function getPhotographersInfo (data) {
      for (const object of data.photographers) {
        const photographer = PhotographerFactory.makePhotographer(
          object.id,
          object.name,
          object.description,
          object.city,
          object.country,
          object.tags,
          object.tagline,
          object.price,
          object.portrait
        ) // Création de l'objet Photographe en utilisant la fonction de la factory

        // Bloc créé pour chaque photographe
        photographerSection.innerHTML += createHTMLCode(photographer) // Fonction cherchée dans le fichier helpers.js pour créer le code HTML pour chaque photographe du site

        // Récupération des tags correspondant à chaque photographe
        const articleTags = document.getElementById(
          'article-tags-' + photographer.id
        )
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`
        } // Affichage des tags relatifs à chaque photographe
      }
    })
}

// Fonction permettant de filtrer les photographes selon les tags
function filterPhotographer () {
  photographerSection.innerHTML = ''
  const activeFilter = this.dataset.filter
  console.log(activeFilter)
  const photographerMatchList = []

  // Récupération des photographes dans le JSON
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function (data) {
      for (object of data.photographers) {
        const photographer = PhotographerFactory.makePhotographer(
          object.id,
          object.name,
          object.description,
          object.city,
          object.country,
          object.tags,
          object.tagline,
          object.price,
          object.portrait
        )
        // On appelle la fonction permettant de comparer les tags des photographes
        compareTags()
        function compareTags () {
          // Pour chaque photographe contenant le tag actif
          photographer.tags.forEach((e) => {
            if (e === activeFilter) {
              // On ajoute l'objet au tableau
              photographerMatchList.push(photographer)
            }
          })
        }
      }
      // On parcours ensuite le tableau afin de créer le code HTML de chaque photographe correspondant au tag sélectionné
      for (photographer of photographerMatchList) {
        photographerSection.innerHTML += createHTMLCode(photographer)
        // Récupération des tags
        const articleTags = document.getElementById(
          'article-tags-' + photographer.id
        )
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`
        }
      }
    })
}
