const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", function (req, res) {
  res.json({ items });
});

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name || !req.body.price) {
      throw new ExpressError("Name and Price are required", 400);
    }
    const price = Number(req.body.price);
    if (isNaN(price)) {
      throw new ExpressError("Price should be a valid number", 400);
    }
    const newItem = { name: req.body.name, price };
    items.push(newItem);
    return res.status(200).json({ item: newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", function (req, res, next) {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (!foundItem) {
      throw new ExpressError("Item not found", 404);
    }
    res.json({ item: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", function (req, res, next) {
  try {
    const foundItem = items.find((item) => item.name === req.params.name);
    if (!foundItem) {
      throw new ExpressError("Item not found", 404);
    }

    if (req.body.name) {
      foundItem.name = req.body.name;
    }

    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (isNaN(price)) {
        throw new ExpressError("Price should be a valid number", 400);
      }
      foundItem.price = price;
    }

    res.json({ item: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", function (req, res, next) {
  try {
    const itemIndex = items.findIndex((item) => item.name === req.params.name);
    if (itemIndex === -1) {
      throw new ExpressError("Item not found", 404);
    }
    items.splice(itemIndex, 1);
    res.json({ message: "Deleted" });
  } catch (e) {
    return next(e);
  }
});
module.exports = router;
