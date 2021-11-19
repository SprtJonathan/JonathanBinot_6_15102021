/* eslint-disable no-undef */
// Emplacement du fichier JSON contenant les donées
const dataLocation = '../public/json/photographers-data.json'

const photographerSectionArticle = document.getElementById(
  'photographer-section-article'
) // Article contenant les informations du photographe
const photographerMediaSection = document.getElementById(
  'photographer-media-section'
) // Section pour l'affichage des photographies de l'auteur

let totalLikes = 0 // Nombre de likes total sur toutes les photos du photographe

let photographer = '' // Initialisation de l'objet photographe

const photographerId = location.search.substring(4) // Récupération de l'ID du photographe dans l'URL de la page

const orderMediaSelected = document.getElementById('order-by') // Ordre d'affichage des photographies
let orderMediaSelectedValue = document.getElementById('order-by').value // Ordre d'affichage des photographies

let mediaData // Initialisation du tableau contenant les différents médias

orderMediaSelect() // Appel de la fonction permettant d'ordonner les médias

orderMediaSelected.addEventListener('change', orderMediaSelect)

// Fonction permettant de trier les photos selon les critères
function orderMediaSelect () {
  orderMediaSelectedValue = document.getElementById('order-by').value
  console.log(orderMediaSelectedValue)

  totalLikes = 0

  displayPage(orderMediaSelectedValue)
  return orderMediaSelectedValue
}

// Fonction affichant la page
function displayPage (sorter) {
  fetch(dataLocation)
    .then((data) => {
      return data.json()
    }) // récupération des données
    .then((data) => {
      const photographerData = data.photographers.filter((photographer) => photographer.id === parseInt(photographerId))
      photographer = PhotographerFactory.makePhotographer(
        photographerData[0].id,
        photographerData[0].name,
        photographerData[0].description,
        photographerData[0].city,
        photographerData[0].country,
        photographerData[0].tags,
        photographerData[0].tagline,
        photographerData[0].price,
        photographerData[0].portrait
      )
      // Affichage de l'en-tête contenant les infos du photographe
      photographerSectionArticle.innerHTML = `
        <div class="photographer-page--header">
        <div class="photographer-page--lblock">
        <h1 id="photographer-name" class="photographer-page--name" aria-label="Le photographe sélectionné est ${photographer.name}" tabindex="3">
          ${photographer.name}
        </h1>
        <h3 tabindex="4" class="photographer-page--location">${photographer.city}, ${photographer.country}</h3>
        <blockquote tabindex="5" class="photographer-page--tagline">${photographer.tagline}</blockquote>
        <aside id="article-tags-${photographer.id}" tabindex="6"></aside>
        </div>
        <div id="contact-button-block" class="contact-button-div"><span id="contact-button" class="button" tabindex="7">Contactez-moi</span></div>
        </div>
        <img id="${photographer.id}-profilePicture" class="photographer-page--picture photographer-profile-picture" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="19"/>
        `

      // Récupération des tags correspondant au photographe sélectionné
      const articleTags = document.getElementById(
        'article-tags-' + photographer.id
      )
      for (tag of photographer.tags) {
        articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`
      }

      // Affichage du nom du photographe dans le formulaire de contact
      const contactFormTitle = document.getElementById('contact-me')
      contactFormTitle.textContent = photographer.name

      const modalbg = document.getElementById('form-background') // Div d'arrière plan du formulaire

      const contactButton = document.getElementById('contact-button') // Bouton permettant d'ouvrir le formulaire

      const closeButton = document.getElementById('close-button') // Bouton pour fermer la modale de contact

      const formBody = document.getElementById('contact-form') // Formulaire

      const formSubmitButton = document.getElementById('contact-button-submit')

      const closeFormButton = document.getElementById('form-close-button')

      contactButton.addEventListener('click', openModal) // Evènement déclencheant l'ouverture de la modale
      closeButton.addEventListener('click', closeModal) // Fermeture de la modale

      function openModal () {
        modalbg.style.display = 'flex'
        contactButton.style.display = 'none'
      }

      function resetForm () {
        formBody.reset()
        successMessage.style.display = 'none'
        formBody.style.display = 'flex'
        closeModal()
      }

      function closeModal () {
        console.log(validateForm())
        if (validateForm() === 1) {
          resetForm()
        }
        modalbg.style.display = 'none'
        contactButton.style.display = 'flex'
      }

      // Lorsque l'on clique sur le bouton de validation
      formSubmitButton.addEventListener('click', ($event) => {
        $event.preventDefault() // On empêche le comportement par défaut
        // On vérifie que tous les champs soient validés grâce à une variable
        validateForm()
      })

      // Lorsque l'on clique sur le bouton de fermeture
      closeFormButton.addEventListener('click', ($event) => {
        $event.preventDefault() // On empêche le comportement par défaut
        // On ferme la modale
        resetForm()
      })

      // Filtrage des médias selon l'ID du photographe afin que seuls les médias du photographe sélectionné soient visibles
      mediaData = data.media.filter(
        (media) => media.photographerId === parseInt(photographerId)
      )

      // Fonction permettant de trier les photos selon les critères du média
      function GetSortOrder (prop) {
        return function (a, b) {
          if (a[prop] > b[prop]) {
            return 1
          } else if (a[prop] < b[prop]) {
            return -1
          }
          return 0
        }
      }

      // Constructeur de l'objet Media
      photographerMediaSection.innerHTML = ''
      for (let j = 0; j < mediaData.length; j++) {
        mediaData.sort(GetSortOrder(sorter))
        const media = MediaFactory.makeMedia(
          mediaData[j].id,
          mediaData[j].photographerId,
          mediaData[j].title,
          mediaData[j].image,
          mediaData[j].video,
          mediaData[j].tags,
          mediaData[j].likes,
          mediaData[j].date,
          mediaData[j].price,
          mediaData[j].description
        )

        console.log(media)

        totalLikes += media.likes

        // Récupération des images du photographe
        // Création d'un bloc figure pour chaque média du photographe
        photographerMediaSection.innerHTML += createMediaHTMLCode(media)

        const likesIcon = document.querySelectorAll('.fa-heart')

        // photographerMediaSection.addEventListener("click", setLikes); // Détection du clic sur la séction media pour appeler la fonction des likes

        likesIcon.forEach((el) =>
          el.addEventListener('click', (e) => {
            console.log(e.target.id)
            console.log('Clic une fois')
            setLikes(e.target.id)
          })
        ) // Détection du clic sur la séction media pour appeler la fonction des likes

        const likedElements = [] // Tableau dans lequel seront stockés les id des éléments déjà likés

        // Fonction permettant d'incrémenter ou de décrémenter le nombre de likes d'une photo
        function setLikes (e) {
          console.log(e + ' et ' + `like-media-${media.id}`)
          // Si l'élément cliqué correspond au compteur de likes ou au coeur, alors on incrémente
          if (e.startsWith('like-media-')) {
            // On récupère l'id seul du like souhaité
            const elementId = e.split('like-media-').pop()

            // Si l'élement n'a pas déjà été liké (n'est pas dans le tableau), alors on effectue la fonction d'incrémentation
            if (likedElements.includes(elementId)) {
              const elementIndex = likedElements.indexOf(elementId)
              if (elementIndex !== -1) {
                likedElements.splice(elementIndex, 1)
              }
              tweakLikes(elementId, -1)
              document
                .getElementById(e)
                .setAttribute('aria-label', 'Like retiré')
              document.getElementById(e).className = 'fa fa-heart'
            } else {
              // Sinon on le décrémente en appelant la fonction chargée de le faire

              likedElements.push(elementId)
              tweakLikes(elementId, 1)
              document
                .getElementById(e)
                .setAttribute('aria-label', 'Like ajouté')
              document.getElementById(e).className = 'liked fa fa-heart'
            }
            console.log(likedElements)
          }
        }
      }

      function tweakLikes (elementId, value) {
        const likesText = document.getElementById(`like-counter-${elementId}`)
        const likesValue = parseInt(likesText.innerHTML)
        console.log(likesValue)
        const newLikesValue = likesValue + value
        likesText.innerHTML = newLikesValue
        console.log(
          'on ajoute ' +
            value +
            ' à ' +
            likesValue +
            '. Et on a donc ' +
            newLikesValue
        )
        refreshLikesCounter(value)
      }

      // Fonction permettant de rafraîchir le nombre total de likes selon un paramètre correspondant au nombre à ajouter
      function refreshLikesCounter (value) {
        totalLikes += value
        totalLikesText.innerHTML = totalLikes
      }

      const totalLikesText = document.getElementById(
        'photographer-total-likes'
      )

      const priceText = document.getElementById('photographer-price')

      totalLikesText.innerHTML = totalLikes + ' <i class="fas fa-heart"></i>'
      priceText.textContent = photographer.price + '€ / jour'

      // Lightbox

      let currentMedia

      const lightboxModal = document.getElementById('lightbox-modal')
      const lightboxImage = document.getElementById('lightbox-image')
      const lightboxClose = document.getElementById('lightbox-close')
      const lightboxPrevious = document.getElementById('lightbox-previous')
      const lightboxNext = document.getElementById('lightbox-next')
      const lightboxTitle = document.getElementById('lightbox-title')

      photographerMediaSection.addEventListener('click', launchLightbox)
      lightboxClose.addEventListener('click', closeLightbox)
      lightboxPrevious.addEventListener('click', (event) => {
        changePicture(-1)
      })
      lightboxNext.addEventListener('click', (event) => {
        changePicture(1)
      })
      lightboxClose.addEventListener('click', closeLightbox)
      window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          changePicture(-1)
        }
      })
      window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          changePicture(1)
        }
      })
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeLightbox()
        }
      })

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          launchLightbox(event)
        }
      })

      function closeLightbox () {
        lightboxModal.style.display = 'none'
      }

      function launchLightbox (e) {
        if (e.target.id.startsWith('media-img-')) {
          const pictureId = e.target.id.split('-').pop()
          const media = mediaData.find((element) => element.id === parseInt(pictureId))
          currentMedia = media
          console.log(pictureId)
          console.log(media)
          lightboxImage.innerHTML = generateMediaTag(
            media,
            'lightbox--image--img'
          )
          lightboxTitle.innerHTML = `<p class="lightbox--title" tabindex="${currentMedia.photographerId}" aria-label="La photo actuellement à l'écran est ${currentMedia.title} ${currentMedia.description}">${currentMedia.title}</p>`
          lightboxModal.style.display = 'flex'
        }
      }

      function changePicture (value) {
        const index = mediaData.indexOf(currentMedia)
        console.log(index)
        const newMedia = mediaData[index + value]
        currentMedia = newMedia

        if (currentMedia !== undefined) {
          lightboxImage.innerHTML = generateMediaTag(
            currentMedia,
            'lightbox--image--img'
          )
          lightboxTitle.innerHTML = `<p class="lightbox--title" tabindex="${currentMedia.photographerId}" aria-label="La photo actuellement à l'écran est ${currentMedia.title}. ${currentMedia.description}">${currentMedia.title}</p>`
        }
      }
    })
}
