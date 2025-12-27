const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Category = require("./models/Category");
const Question = require("./models/Question");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const importData = async () => {
    try {
        const dataDir = path.join(__dirname, "data");
        const files = fs.readdirSync(dataDir);

        for (const file of files) {
            if (file.endsWith(".json")) {
                const categoryName = path.basename(file, ".json");
                const filePath = path.join(dataDir, file);
                const questionsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

                // Create or find Category
                let category = await Category.findOne({ name: categoryName });
                if (!category) {
                    category = await Category.create({
                        name: categoryName,
                        description: `Questions related to ${categoryName}`,
                    });
                    console.log(`Created Category: ${categoryName}`);
                } else {
                    console.log(`Category already exists: ${categoryName}`);
                }

                // Insert Questions
                const questionsToInsert = questionsData.map((q) => ({
                    category: category._id,
                    text: q.questionText,
                    options: q.options.map((opt, index) => ({
                        id: index + 1,
                        text: opt,
                    })),
                    correctOptionId: q.correctAnswerIndex + 1,
                    difficulty: q.difficulty || "medium",
                }));

                // Avoid duplicates (simple check based on text)
                for (const q of questionsToInsert) {
                    const exists = await Question.findOne({ text: q.text, category: category._id });
                    if (!exists) {
                        await Question.create(q);
                    }
                }
                console.log(`Imported questions for: ${categoryName}`);
            }
        }

        console.log("Data Import Success!");
        process.exit();
    } catch (error) {
        console.error("Error with data import", error);
        process.exit(1);
    }
};

importData();
