const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");
const Question = require("./models/Question");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const checkDB = async () => {
    try {
        console.log("Checking Database Content...");

        const categories = await Category.find();
        console.log(`\nTotal Categories Found: ${categories.length}`);

        if (categories.length === 0) {
            console.log("No categories found.");
        } else {
            for (const cat of categories) {
                const count = await Question.countDocuments({ category: cat._id });
                console.log(`- Category: ${cat.name} (ID: ${cat._id})`);
                console.log(`  Description: ${cat.description}`);
                console.log(`  Total Questions: ${count}`);

                // Optional: List a few questions to verify
                const sampleQuestions = await Question.find({ category: cat._id }).limit(3);
                if (sampleQuestions.length > 0) {
                    console.log("  Sample Questions:");
                    sampleQuestions.forEach((q, i) => {
                        console.log(`    ${i + 1}. ${q.text} (Difficulty: ${q.difficulty})`);
                    });
                } else {
                    console.log("  No questions in this category.");
                }
                console.log("---------------------------------------------------");
            }
        }

        // Check for orphaned questions (questions with no valid category)
        const allCategoryIds = categories.map(c => c._id);
        const orphanedCount = await Question.countDocuments({ category: { $nin: allCategoryIds } });
        if (orphanedCount > 0) {
            console.log(`\nWARNING: Found ${orphanedCount} orphaned questions (no valid category).`);
        } else {
            console.log("\nNo orphaned questions found.");
        }

        process.exit();
    } catch (error) {
        console.error("Error checking database:", error);
        process.exit(1);
    }
};

checkDB();
