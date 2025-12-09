// server.js

// 1. Load modules
const express = require("express");
const cors = require("cors");

// 2. Create app
const app = express();
app.use(cors());

// 3. Load data (from the /data folder)
const artists = require("./data/artists.json");
const galleries = require("./data/galleries.json");
const paintings = require("./data/paintings-nested.json");

// 4. Simple home route (for sanity check)
app.get("/", function (req, res) {
  res.send("COMP 3612 Assignment 3 API is running");
});

/* -----------------------
        PAINTINGS
------------------------*/

// /api/paintings  → all paintings
app.get("/api/paintings", function (req, res) {
  res.json(paintings);
});

// /api/painting/:id  → single painting by id
app.get("/api/painting/:id", function (req, res) {
  const id = req.params.id;
  const painting = paintings.find(function (p) {
    return p.paintingID == id; // == so string/number both work
  });

  if (!painting) {
    return res.json({ message: "Painting Not Found" });
  }

  res.json(painting);
});

// /api/painting/gallery/:id  → paintings by gallery id
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

// /api/painting/artist/:id  → paintings by artist id
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

// /api/painting/year/:min/:max  → paintings between years
app.get("/api/painting/year/:min/:max", function (req, res) {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);

  const result = paintings.filter(function (p) {
    return p.yearOfWork >= min && p.yearOfWork <= max;
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found In This Year Range" });
  }

  res.json(result);
});

// /api/painting/title/:text  → title contains text (case-insensitive)
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

// /api/painting/color/:name  → color name match (case-insensitive)
app.get("/api/painting/color/:name", function (req, res) {
  const name = req.params.name.toLowerCase();

  const result = paintings.filter(function (p) {
    // colors are nested inside: details.annotation.dominantColors
    if (
      !p.details ||
      !p.details.annotation ||
      !p.details.annotation.dominantColors
    ) {
      return false;
    }

    const colors = p.details.annotation.dominantColors;

    // check if any color's name matches the text
    return colors.some(function (c) {
      if (!c.name) return false;
      return c.name.toLowerCase().includes(name);
    });
  });

  if (result.length === 0) {
    return res.json({ message: "No Paintings Found With This Color" });
  }

  res.json(result);
});

/* -----------------------
        ARTISTS
------------------------*/

// /api/artists  → all artists
app.get("/api/artists", function (req, res) {
  res.json(artists);
});

// /api/artists/:country  → artists from a country (case-insensitive)
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

/* -----------------------
        GALLERIES
------------------------*/

// /api/galleries  → all galleries
app.get("/api/galleries", function (req, res) {
  res.json(galleries);
});

// /api/galleries/:country  → galleries from a country (case-insensitive)
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

/* -----------------------
        START SERVER
------------------------*/

// IMPORTANT for Render: use process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});
