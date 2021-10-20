// Création de la class Media et de la factory
class Media {
    constructor(
      id,
      photographerId,
      title,
      image,
      video,
      tags,
      likes,
      date,
      price,
    ) {
      this._id = id;
      this._photographerId = photographerId;
      this._title = title;
      this._image = image;
      this._video = video;
      this._tags = tags;
      this._likes = likes;
      this._date = date;
      this._price = price;
    }
  
    get id() {
      return this._id;
    }
  
    get photographerId() {
      return this._photographerId;
    }
  
    get title() {
      return this._title;
    }
  
    get image() {
      return this._image;
    }
    
    get video() {
      return this._video;
    }
  
    get tags() {
      return this._tags;
    }
  
    get likes() {
      return this._likes;
    }
  
    get date() {
      return this._date;
    }
  
    get price() {
      return this._price;
    }
  }
  
  const MediaFactory = {
    makeMedia: function (
        id,
        photographerId,
        title,
        image,
        video,
        tags,
        likes,
        date,
        price,
    ) {
      return new Media(
        id,
      photographerId,
      title,
      image,
      video,
      tags,
      likes,
      date,
      price,
      );
    },
  };
  