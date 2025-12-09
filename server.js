// modules
const express = require("express");
const cors = require("cors");

// app
const app = express();
app.use(cors());

// data
const artists = require("./data/artists.json");
const galleries = require("./data/galleries.json");
const paintings = require("./data/paintings-nested.json");


/* ----- PAINTINGS -----*/

// all paintings
app.get("/api/paintings", function (req, res) {
  res.json(paintings);
});

// one single painting by id
app.get("/api/painting/:id", function (req, res) {
  const id = req.params.id;
  const painting = paintings.find(function (p) {
    return p.paintingID == id; // works for strings & numbers
  });

  if (!painting) {
    return res.json({ message: "No Painting Found" });
  }

  res.json(painting);
});

// paintings by gallery id
app.get("/api/painting/gallery/:id", function (req, res) {
  const id = req.params.id;
  const result = paintings.filter(function (p) {
    return p.gallery && p.gallery.galleryID == id;
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found For This Gallery" });
  }

  res.json(result);
});

// paintings by artist id
app.get("/api/painting/artist/:id", function (req, res) {
  const id = req.params.id;
  const result = paintings.filter(function (p) {
    return p.artist && p.artist.artistID == id;
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found For This Artist" });
  }

  res.json(result);
});

// paintings in years
app.get("/api/painting/year/:min/:max", function (req, res) {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);

  const result = paintings.filter(function (p) {
    return p.yearOfWork >= min && p.yearOfWork <= max;
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found For This Year Range" });
  }

  res.json(result);
});

// text in the title
app.get("/api/painting/title/:text", function (req, res) {
  const text = req.params.text.toLowerCase();

  const result = paintings.filter(function (p) {
    if (!p.title) return false;
    return p.title.toLowerCase().includes(text);
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found With This Title Text" });
  }

  res.json(result);
});

// matching colour names
app.get("/api/painting/color/:name", function (req, res) {
  const name = req.params.name.toLowerCase();

  const result = paintings.filter(function (p) {
    if (
      !p.details ||
      !p.details.annotation ||
      !p.details.annotation.dominantColors    // nested colours
    ) {
      return false;
    }

    const colors = p.details.annotation.dominantColors;

    return colors.some(function (c) {
      if (!c.name) return false;
      return c.name.toLowerCase().includes(name);
    });
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found With This Colour" });
  }

  res.json(result);
});


/* ----- ARTISTS -----*/

// all artists
app.get("/api/artists", function (req, res) {
  res.json(artists);
});

// artists from a country
app.get("/api/artists/:country", function (req, res) {
  const country = req.params.country.toLowerCase();

  const result = artists.filter(function (a) {
    if (!a.Nationality) return false;
    return a.Nationality.toLowerCase() === country;
  });

  if (result.length === 0) {
    return res.json({ message: "No Artists Found For This Country" });
  }

  res.json(result);
});


/* -----GALLERIES -----*/

// all galleries
app.get("/api/galleries", function (req, res) {
  res.json(galleries);
});

// galleries from a country 
app.get("/api/galleries/:country", function (req, res) {
  const country = req.params.country.toLowerCase();

  const result = galleries.filter(function (g) {
    if (!g.GalleryCountry) return false;
    return g.GalleryCountry.toLowerCase() === country;
  });

  if (result.length === 0) {
    return res.json({ message: "No Galleries Found For This Country" });
  }

  res.json(result);
});

/* ----- START SERVER -----*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});