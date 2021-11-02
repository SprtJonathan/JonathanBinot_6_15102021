const photographerPageSection = document.getElementById(
  "photographer-page-section"
);
const photographerSectionArticle = document.getElementById(
  "photographer-section-article"
);
const photographerMediaSection = document.getElementById(
  "photographer-media-section"
);

let totalLikes = 0;

let photographer = "";

const dataLocation = "../public/json/photographers-data.json";

const photographerName = document.getElementById("photographer-name");

const photographerId = location.search.substring(4);

let orderMediaSelectedValue = document.getElementById("order-by").value;

let mediaData;

function orderMediaSelect() {
  orderMediaSelectedValue = document.getElementById("order-by").value;
  console.log(orderMediaSelectedValue);

  displayPage(orderMediaSelectedValue);
  return orderMediaSelectedValue;
}

displayPage(orderMediaSelectedValue);

function displayPage(sorter) {
  fetch(dataLocation)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data.photographers[0].id);
      for (let i = 0; i < data.photographers.length; i++) {
        if (data.photographers[i].id == photographerId) {
          foundPhotographer = data.photographers[i];
          console.log(data.photographers[i]);
          photographer = PhotographerFactory.makePhotographer(
            data.photographers[i].id,
            data.photographers[i].name,
            data.photographers[i].description,
            data.photographers[i].city,
            data.photographers[i].country,
            data.photographers[i].tags,
            data.photographers[i].tagline,
            data.photographers[i].price,
            data.photographers[i].portrait
          );
          console.log(photographer);
          photographerSectionArticle.innerHTML = `
        <div class="photographer-page--lblock">
        <h1 id="photographer-name" class="photographer-page--name" aria-label="Le photographe sélectionné">
          ${photographer.name}
        </h1>
        <h3 tabindex="4" class="photographer-page--location">${photographer.city}, ${photographer.country}</h3>
        <blockquote tabindex="5" class="photographer-page--tagline">${photographer.tagline}</blockquote>
        <aside id="article-tags-${photographer.id}" tabindex="6"></aside>
        </div>
        <div id="contact-button-block" class="contact-button-div"><span id="contact-button" class="contact-button">Contactez-moi</span></div>
        <img id="${photographer.id}-profilePicture" class="photographer-page--picture photographer-profile-picture" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="7"/>
        `;

          // Récupération des tags correspondant à chaque photographe
          const articleTags = document.getElementById(
            "article-tags-" + photographer.id
          );
          for (tag of photographer.tags) {
            articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
          }
        }
      }

      // Affichage du nom du photographe dans le formulaire de contact
      let contactFormTitle = document.getElementById("contact-me");
      contactFormTitle.textContent = photographer.name;

      const modalbg = document.getElementById("form-background"); // Div d'arrière plan du formulaire

      const contactButton = document.getElementById("contact-button");

      const closeButton = document.getElementById("close-button");

      contactButton.addEventListener("click", openModal);
      closeButton.addEventListener("click", closeModal);

      function openModal() {
        modalbg.style.display = "flex";
        contactButton.style.display = "none";
      }

      function closeModal() {
        modalbg.style.display = "none";
        contactButton.style.display = "flex";
      }

      mediaData = data.media.filter(
        (media) => media.photographerId === parseInt(photographerId)
      );

      console.log("mediaData" + mediaData);

      function GetSortOrder(prop) {
        return function (a, b) {
          if (a[prop] > b[prop]) {
            return 1;
          } else if (a[prop] < b[prop]) {
            return -1;
          }
          return 0;
        };
      }

      // Constructeur de l'objet Media
      photographerMediaSection.innerHTML = "";
      for (let j = 0; j < mediaData.length; j++) {
        mediaData.sort(GetSortOrder(sorter));
        const media = MediaFactory.makeMedia(
          mediaData[j].id,
          mediaData[j].photographerId,
          mediaData[j].title,
          mediaData[j].image,
          mediaData[j].video,
          mediaData[j].tags,
          mediaData[j].likes,
          mediaData[j].date,
          mediaData[j].price
        );

        console.log(media);

        totalLikes += media.likes;

        // Récupération des images du photographe

        let filteredMedia = data.media.filter(
          (mediaData) => mediaData.photographerId === photographerId
        );

        console.log(filteredMedia);

        // Création d'un bloc figure pour chaque média du photographe
        photographerMediaSection.innerHTML += createMediaHTMLCode(media);

        photographerMediaSection.addEventListener("click", incrementLikes); // Détection du clic sur la séction media pour appeler la fonction des likes

        let isLiked = false; // Variable permettant de vérifier si un élément est déjà liké

        // Fonction permettant d'incrémenter le nombre de likes d'une photo
        function incrementLikes(e) {
          // Si l'élément cliqué correspond au compteur de likes ou au coeur, alors on incrémente
          if (
            (e.target && e.target.id == `like-div-${media.id}`) ||
            e.target.id == `like-counter-${media.id}` ||
            e.target.id == `like-media-${media.id}`
          ) {
            // Si l'élement n'a pas déjà été liké, alors on effectue la fonction d'incrémentation
            if (!isLiked) {
              const likesText = document.getElementById(
                `like-counter-${media.id}`
              );
              let likesValue = parseInt(likesText.innerHTML);
              console.log(likesValue);
              likesValue++;
              likesText.innerHTML = likesValue;
              isLiked = true;
              refreshLikesCounter(1);
            } else {
              // Sinon on le décrémente en appelant la fonction chargée de le faire
              decrementLikes();
            }
          } else {
            console.log(e.target.id);
          }
        }

        // Fonction permettant de décrémenter le nombre de likes
        function decrementLikes(e) {
          const likesText = document.getElementById(`like-counter-${media.id}`);
          let likesValue = parseInt(likesText.innerHTML);
          console.log(likesValue);
          likesValue--;
          likesText.innerHTML = likesValue;
          isLiked = false;
          refreshLikesCounter(-1);
        }

        // Fonction permettant de rafraîchir le nombre total de likes selon un paramètre correspondant au nombre à ajouter
        function refreshLikesCounter(value) {
          totalLikes += value;
          totalLikesText.innerHTML = totalLikes;
        }
      }

      const totalLikesText = document.getElementById(
        "photographer-total-likes"
      );

      const priceText = document.getElementById("photographer-price");

      totalLikesText.innerHTML = totalLikes + ' <i class="fas fa-heart"></i>';
      priceText.textContent = photographer.price + "€ / jour";

      // Lightbox

      const lightboxModal = document.getElementById("lightbox-modal");
      const lightboxImage = document.getElementById("lightbox-image");
      const lightboxClose = document.getElementById("lightbox-close");
      const lightboxPrevious = document.getElementById("lightbox-previous");
      const lightboxNext = document.getElementById("lightbox-next");
      const lightboxTitle = document.getElementById("lightbox-title");

      photographerMediaSection.addEventListener("click", launchLightbox);
      lightboxClose.addEventListener("click", closeLightbox);
      lightboxPrevious.addEventListener("click", previousPicture);
      lightboxNext.addEventListener("click", nextPicture);

      let currentMedia;

      function closeLightbox() {
        lightboxModal.style.display = "none";
      }

      function launchLightbox(e) {
        if (e.target.id.startsWith("media-img-")) {
          let pictureId = e.target.id.split("-").pop();
          let media = mediaData.find((element) => element.id == pictureId);
          currentMedia = media;
          console.log(pictureId);
          console.log(media);
          lightboxImage.innerHTML = generateMediaTag(media);
          lightboxTitle.textContent = currentMedia.title;
          lightboxModal.style.display = "flex";
        }
      }

      function previousPicture() {
        let index = mediaData.indexOf(currentMedia);
        console.log(index);
        let previousMedia = mediaData[index - 1];
        currentMedia = previousMedia;

        if (currentMedia != undefined) {
          lightboxImage.innerHTML = generateMediaTag(currentMedia);
          lightboxTitle.textContent = currentMedia.title;
        }
      }
      function nextPicture() {
        let index = mediaData.indexOf(currentMedia);
        let nextMedia = mediaData[index + 1];
        currentMedia = nextMedia;

        if (currentMedia != undefined) {
          lightboxImage.innerHTML = generateMediaTag(currentMedia);
          lightboxTitle.textContent = currentMedia.title;
        }
      }
    });
}
