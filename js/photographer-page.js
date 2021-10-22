const photographerPageSection = document.getElementById(
  "photographer-page-section"
);
const photographerMediaSection = document.getElementById(
  "photographer-media-section"
);

let totalLike = 0;

let photographer = "";

const dataLocation = "../public/json/photographers-data.json";

const photographerName = document.getElementById("photographer-name");

const photographerId = location.search.substring(4);

console.log(photographerId);

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
        photographerName.textContent = data.photographers[i].name;
        console.log(photographer);
        photographerPageSection.innerHTML = `
              <article class="photographer--section--article">
                  <h3 tabindex="4">${photographer.city}, ${photographer.country}</h3>
                  <blockquote tabindex="5">${photographer.tagline}</blockquote>
        
                  <aside id="article-tags-${photographer.id}" tabindex="6"></aside>
              </article>
              <img id="${photographer.id}-profilePicture" class="photographer-profile-picture" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="7"/>`;

        // Récupération des tags correspondant à chaque photographe
        const articleTags = document.getElementById(
          "article-tags-" + photographer.id
        );
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
        }
      }
    }

    const mediaData = data.media.filter(
      (media) => media.photographerId === parseInt(photographerId)
    );

    console.log(mediaData)

    // Constructeur de l'objet Media
    for (let j = 0; j < mediaData.length ; j++) {
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
      );

      console.log(media)

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
        return `<video controls class='media--video' id="media-img-${media.id}" src='./public/img/SamplePhotos/${media.photographerId}/${media.video}' alt='${media.description}'></video>`;
      }

      // Création dynamique (from JSON) d'un article pour chaque médias du photographe
      photographerMediaSection.innerHTML += `
        <article class="media--card" tabindex="${
          media.photographerId
        }" aria-label ="Le média de ${photographer.name} se nomme : ${media.title}">
            ${generateMediaTag()} 
            <div class="media--image--description">
            <p tabindex="${
              media.photographerId
            }" aria-label=" le titre de l'oeuvre est ${media.titre}">${
        media.title
      }</p>
            <div class="prix-like">
               <p tabindex="${
                 media.photographerId
               }" aria-label=" le prix de cette photo est ${media.price}€">${
        media.price
      } €</p>
               <div class="media--like-counter" tabindex="${
                 media.photographerId
               }"> <span class="media--like-counter--span" id="like-counter-${
        media.id
      }" aria-label="il à été aimé ${media.likes} fois ">${
        media.likes
      }</span><span><i class="fas fa-heart" id="like-media-${
        media.id
      }"></i></span></div>
            </div>
            </div>
        </article>`;
    }
  });
