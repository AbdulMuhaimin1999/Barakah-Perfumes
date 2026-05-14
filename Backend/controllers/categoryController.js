const { validationResult } = require('express-validator');
const Category = require('../models/Category');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, categories });
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

    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const id = await Category.create({ name, slug });

    res.status(201).json({ success: true, category: { id, name, slug } });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.update(id, { name, slug });
    res.json({ success: true, category: { id: Number(id), name, slug } });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.delete(id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
