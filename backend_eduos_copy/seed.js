const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = "mongodb+srv://hardikmakkar2024_db_user:hardikmakkar2024_db_user@cluster0.sj7doaf.mongodb.net/";

async function seedDatabase() {

    const client = new MongoClient(uri);

    try {

        await client.connect();

        console.log("Connected to MongoDB");

        const db = client.db("eduos");

        const roles = JSON.parse(fs.readFileSync("./eduOS-dataset/roles.json"));
        const roleSkills = JSON.parse(fs.readFileSync("./eduOS-dataset/role_skills.json"));
        const questions = JSON.parse(fs.readFileSync("./eduOS-dataset/questions.json"));

        await db.collection("roles").insertMany(roles);
        console.log("Roles inserted");

        await db.collection("role_skills").insertMany(roleSkills);
        console.log("Role skills inserted");

        await db.collection("questions").insertMany(questions);
        console.log("Questions inserted");

        console.log("Database seeding completed");

    } catch (error) {

        console.error(error);

    } finally {

        await client.close();

    }
}

seedDatabase();