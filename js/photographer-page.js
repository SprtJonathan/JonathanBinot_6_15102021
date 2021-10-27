const photographerPageSection = document.getElementById(
  "photographer-page-section"
);
const photographerSectionArticle = document.getElementById(
  "photographer-section-article"
);
const photographerMediaSection = document.getElementById(
  "photographer-media-section"
);

let totalLike = 0;

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
        <div id="contact-button" class="contact-button-div"><span id="contact-button" class="contact-button">Contactez-moi</span></div>
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

        totalLike += media.likes;

        // Récupération des images du photographe

        let filteredMedia = data.media.filter(
          (mediaData) => mediaData.photographerId === photographerId
        );

        console.log(filteredMedia);

        // Pattern Factory pour créer des vidéos ou photos selon la nature du média
        function generateMediaTag() {
          if (media.video == undefined) {
            return `<img class='media--image' id="media-img-${media.id}" src='./public/img/SamplePhotos/${media.photographerId}/${media.image}' alt='${media.description}'/>`;
          }
          return `<video controls class='media--image' id="media-img-${media.id}" src='./public/img/SamplePhotos/${media.photographerId}/${media.video}' alt='${media.description}'></video>`;
        }

        // Création d'un bloc figure pour chaque média du photographe
        photographerMediaSection.innerHTML += `
      <figure class="media--card" tabindex="${
        media.photographerId
      }" aria-label="Le média de ${photographer.name} se nomme : ${
          media.title
        }">
        ${generateMediaTag()}
        <figcaption class="media--image--description">
          <p tabindex="${
            media.photographerId
          }" aria-label=" le titre de l'oeuvre est ${media.titre}">
            ${media.title}
          </p>
          <div class="media--like-counter" tabindex="${media.photographerId}">
            <span class="media--like-counter--span" id="like-counter-${
              media.id
            }" aria-label="il à été aimé ${media.likes} fois ">${
          media.likes
        }</span>
            <span class="media--like-counter--icon"><i class="fas fa-heart" id="like-media-${
              media.id
            }"></i></span>
          </div>
        </figcaption>
      </figure>`;
      }
    });
  return 0;
}
