const { validationResult } = require('express-validator');
const Product = require('../models/Product');

exports.getAll = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const products = await Product.findAll({ category, search });
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, price, stock, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const id = await Product.create({ name, description, price, stock, image_url, category_id });
    const product = await Product.findById(id);

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = {};
    const allowedFields = ['name', 'description', 'price', 'stock', 'category_id'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        fields[field] = req.body[field];
      }
    }

    if (req.file) {
      fields.image_url = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(fields).length > 0) {
      await Product.update(id, fields);
    }

    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.delete(id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
