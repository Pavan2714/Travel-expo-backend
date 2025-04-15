const Place = require("../models/Place");

module.exports = {
  addPlaces: async (req, res, next) => {
    const {
      country_id,
      description,
      imageUrl,
      location,
      contact_id,
      title,
      rating,
      review,
      latitude,
      longitude,
    } = req.body;

    try {
      const newPlace = new Place({
        country_id,
        description,
        imageUrl,
        location,
        contact_id,
        title,
        rating,
        review,
        latitude,
        longitude,
      });

      await newPlace.save();
      res
        .status(201)
        .json({ status: true, message: "Place added successfully" });
    } catch (error) {
      return next(error);
    }
  },

  getPlaces: async (req, res, next) => {
    try {
      const places = await Place.find(
        {},
        "_id review rating imageUrl title country_id"
      );
      res.status(200).json({ places });
    } catch (error) {
      return next(error);
    }
  },

  getPlace: async (req, res, next) => {
    const placeId = req.params.id;
    try {
      const place = await Place.findById(placeId, {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }).populate({
        path: "popular",
        select: "title rating review imageUrl location",
      });

      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }

      res.status(200).json({ place });
    } catch (error) {
      return next(error);
    }
  },

  getPlacesByCountry: async (req, res, next) => {
    const countryId = req.params.id;
    try {
      const places = await Place.find(
        { country_id: countryId },
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );

      if (places.length === 0) {
        return res.status(200).json([]);
      }

      res.status(200).json({ places });
    } catch (error) {
      return next(error);
    }
  },

  search: async (req, res, next) => {
    try {
      const results = await Place.aggregate([
        {
          $search: {
            index: "places",
            text: {
              query: req.params.key,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ]);
      res.status(200).json(results);
    } catch (error) {
      return next(error);
    }
  },
  // controller function
  updatePopularHotelsInPlace: async (req, res, next) => {
    const { placeId, hotelId } = req.body;

    try {
      const place = await Place.findById(placeId);
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }

      const index = place.popular.indexOf(hotelId);
      if (index !== -1) {
        place.popular.splice(index, 1); // Remove
      } else {
        place.popular.push(hotelId); // Add
      }

      await place.save();
      res.status(200).json({ status: true, message: "Popular hotels updated" });
    } catch (error) {
      return next(error);
    }
  },
};
