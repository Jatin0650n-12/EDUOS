const mongoose = require("mongoose");
// const pdfParse = require("pdf-parse").default || require("pdf-parse");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse"); // <- this should work

const fs = require("fs");
const path = require("path");

// ========== Mongoose Schema ==========
const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
});

const UploadedFile =
  mongoose.models.UploadedFile || mongoose.model("UploadedFile", fileSchema);


const allSkills = [
  // 🧑‍💻 Programming Languages
  "C", "C++", "C#", "Java", "JavaScript", "TypeScript", "Python",
  "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "Perl", "Scala",
  "R", "MATLAB", "SQL", "NoSQL",

  // 🧠 Frontend Frameworks & Libraries
  "React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Svelte", "jQuery",
  "Bootstrap", "Tailwind CSS", "Material UI", "Redux",

  // ⚙️ Backend Frameworks
  "Node.js", "Express.js", "NestJS", "Spring Boot", "Django", "Flask",
  "FastAPI", "Laravel", "Ruby on Rails", "ASP.NET", "Koa", "Hapi",

  // ☁️ Cloud / DevOps / CI-CD
  "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
  "Jenkins", "GitHub Actions", "Terraform", "Ansible", "CircleCI",
  "Heroku", "DigitalOcean", "CI/CD", "Linux", "Nginx", "Apache",

  // 🗃️ Databases
  "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Firebase", "DynamoDB",
  "Redis", "Oracle", "Cassandra", "Elasticsearch", "MariaDB",

  // 📊 Data Science / Machine Learning / AI
  "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "TensorFlow",
  "PyTorch", "Keras", "OpenCV", "Hugging Face", "Natural Language Processing",
  "Computer Vision", "Deep Learning", "Machine Learning", "Data Analysis",
  "Data Visualization", "Data Mining", "Statistics",

  // 🧩 Tools & Version Control
  "Git", "GitHub", "GitLab", "Bitbucket", "VS Code", "IntelliJ",
  "Eclipse", "JIRA", "Confluence", "Postman", "Figma", "Notion",
  "Slack", "Trello", "Agile", "Scrum", "Kanban",

  // 🧱 Testing Frameworks
  "Jest", "Mocha", "Chai", "Cypress", "Selenium", "JUnit", "PyTest",
  "Postman Testing", "Unit Testing", "Integration Testing",

  // 🌐 Other Tech
  "REST API", "GraphQL", "Microservices", "WebSockets", "JSON", "XML",
  "OAuth", "JWT", "Authentication", "Authorization", "CI/CD Pipeline",
  "System Design", "Software Architecture", "Design Patterns",

  // 💡 Soft Skills
  "Communication", "Leadership", "Teamwork", "Problem Solving",
  "Critical Thinking", "Time Management", "Adaptability", "Collaboration",
  "Creativity", "Analytical Skills"
];


function extractSkills(text) {
  const textLower = text.toLowerCase();
  const foundSkills = allSkills.filter(skill =>
    textLower.includes(skill.toLowerCase())
  );
  return [...new Set(foundSkills)];
}



// ========== Main Controller Function ==========
const extractTextFromResume = async (req, res) => {
  console.log("🟢 [START] Extract Text API called");

  try {
    const fileId = req.params.id;
    console.log("📁 Received fileId:", fileId);

    // Step 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      console.warn("⚠️ Invalid file ID received");
      return res
        .status(400)
        .json({ success: false, message: "Invalid file ID" });
    }

    // Step 2️⃣ Verify DB connection
    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ Database connection not established");
      return res
        .status(500)
        .json({ success: false, message: "Database not connected" });
    }

    console.log("✅ Database connection found");

    // Step 3️⃣ Create GridFS bucket
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });
    console.log("📦 GridFS bucket initialized (uploads)");

    // Step 4️⃣ Find file metadata in UploadedFile collection
    console.log("🔍 Searching file metadata in UploadedFile...");
    const fileDoc = await UploadedFile.findOne({
      gridFsId: new mongoose.Types.ObjectId(fileId),
    });

    if (!fileDoc) {
      console.error("❌ File metadata not found for ID:", fileId);
      return res
        .status(404)
        .json({ success: false, message: "File not found in database" });
    }

    console.log("✅ File metadata found:", {
      originalName: fileDoc.originalName,
      mimeType: fileDoc.mimeType,
      size: fileDoc.size,
    });

    const mimeType = fileDoc.mimeType;
    const tempFilePath = path.join(__dirname, "temp_" + fileDoc.originalName);
    console.log("📝 Temporary file path:", tempFilePath);

    // Step 5️⃣ Stream file from GridFS into a temp local file
    console.log("📥 Downloading file from GridFS...");
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    const writeStream = fs.createWriteStream(tempFilePath);

    downloadStream.pipe(writeStream);

    // ✅ On successful file download
    writeStream.on("finish", async () => {
      console.log("✅ File successfully downloaded from GridFS");
      try {
        let text = "";

        console.log("🔍 Starting text extraction for:", mimeType);

        // Step 6️⃣ Parse file based on type
        if (mimeType === "application/pdf") {
          console.log("📄 PDF detected — parsing with pdf-parse...");
          const dataBuffer = fs.readFileSync(tempFilePath);
        //   const parsed = await pdfParse(dataBuffer);
        const parsed = await pdfParse.default ? await pdfParse.default(dataBuffer) : await pdfParse(dataBuffer);
          text = parsed.text;
          console.log("✅ PDF parsed successfully");
        } else if (
          mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          console.log("📄 DOCX detected — parsing with mammoth...");
          const result = await mammoth.extractRawText({ path: tempFilePath });
          text = result.value;
          console.log("✅ DOCX parsed successfully");
        } else {
          console.warn("⚠️ Unsupported file type:", mimeType);
          return res
            .status(400)
            .json({ success: false, message: "Unsupported file type" });
        }

        // Step 7️⃣ Return response
        console.log("✅ Text extraction completed, sending response...");
        res.status(200).json({
          success: true,
          message: "Text extracted successfully",
          fileId,
          text,
          skills: extractSkills(text)
        });
      } catch (err) {
        console.error("❌ [Inner Error] During parsing:", err);
        res.status(500).json({
          success: false,
          message: "Error parsing file",
          error: err.message,
        });
      } finally {
        // Step 8️⃣ Cleanup
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          console.log("🧹 Temporary file deleted:", tempFilePath);
        }
        console.log("🟢 [COMPLETE] Extraction process finished");
      }
    });

    // ❌ Handle write stream errors
    writeStream.on("error", (err) => {
      console.error("❌ WriteStream error:", err);
      res.status(500).json({
        success: false,
        message: "Error writing temp file",
        error: err.message,
      });
    });
  } catch (err) {
    console.error("❌ [Outer Error] Extract text failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during text extraction",
      error: err.message,
    });
  }
};

module.exports = { extractTextFromResume };
