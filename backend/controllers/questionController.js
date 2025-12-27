const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ message: "Question added", question });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getQuestionsByCategory = async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.categoryId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
