const photographerPageSection = document.getElementById(
  "photographer-page-section"
);
const photographerMediaSection = document.getElementById(
  "photographer-media-section"
);

const dataLocation = "../public/json/photographers-data.json";

const photographerName = document.getElementById("photographer-name");

let photographerId = location.search.substring(4);

console.log(photographerId);

fetch(dataLocation)
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    let foundPhotographer = null;
    console.log(data.photographers[0].id);
    for (let i = 0; i < data.photographers.length; i++) {
      if (data.photographers[i].id == photographerId) {
        foundPhotographer = data.photographers[i];
        console.log(data.photographers[i]);
        const photographer = PhotographerFactory.makePhotographer(
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
              <article class="presentation">
                  <h3 tabindex="4">${photographer.city}, ${photographer.country}</h3>
                  <blockquote tabindex="5">${photographer.tagline}</blockquote>
        
                  <aside id="article-tags-${photographer.id}" tabindex="6"></aside>
              </article>
              <img id="${photographer.id}-profilePicture" class="photographer--profilePicture" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="7"/>`;

        // Récupération des tags correspondant à chaque photographe
        const articleTags = document.getElementById(
          "article-tags-" + photographer.id
        );
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span class="photographerTag" data-tag="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
        }
      }
    }

    // Récupération des images du photographe

    let filteredMedia = data.media.filter(
      (mediaData) => mediaData.photographerId === Number(photographerId)
    );

    console.log(filteredMedia)

    function factoryMedia(element) {
      if (element.image) {
        return new Image(
          element.id,
          element.photographerId,
          element.title,
          element.image,
          element.tags,
          element.likes,
          element.date,
          element.price
        );
      }
    
      if (element.video) {
        return new Video(
          element.id,
          element.photographerId,
          element.title,
          element.video,
          element.tags,
          element.likes,
          element.date,
          element.price
        );
      }
    }
  });


