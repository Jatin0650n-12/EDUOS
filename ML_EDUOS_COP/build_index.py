from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import json

# Step 1: Define your base skill list
skills = [
    # ---------------- Programming Languages ----------------
    "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift",
    "Kotlin", "TypeScript", "JavaScript", "Scala", "Perl", "R", "Dart", "MATLAB",
    "Objective-C", "Shell Scripting",

    # ---------------- Web Development ----------------
    "HTML", "CSS", "SASS", "Bootstrap", "Tailwind CSS", "React", "Angular",
    "Vue.js", "Next.js", "Nuxt.js", "Svelte", "jQuery", "REST API", "GraphQL",
    "Express", "Node.js", "FastAPI", "Flask", "Django", "Spring Boot", "Laravel",
    "ASP.NET Core", "EJS", "Handlebars", "WebSockets", "Webpack", "Vite", "Gulp",
    "Nginx", "Apache", "WordPress",

    # ---------------- Databases ----------------
    "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Cassandra", "DynamoDB",
    "Redis", "Elasticsearch", "Firebase", "MariaDB", "Neo4j", "Oracle DB",
    "CouchDB", "InfluxDB", "Supabase", "Prisma", "Sequelize", "Mongoose",

    # ---------------- Cloud Platforms ----------------
    "AWS", "Microsoft Azure", "Google Cloud Platform", "DigitalOcean",
    "Heroku", "Vercel", "Netlify", "Firebase Hosting", "Render", "Cloudflare",
    "Linode", "Koyeb",

    # ---------------- DevOps & CI/CD ----------------
    "Docker", "Kubernetes", "Jenkins", "GitLab CI/CD", "GitHub Actions",
    "Terraform", "Ansible", "Puppet", "Chef", "Bash", "Shell", "PowerShell",
    "Linux", "Unix", "System Administration", "Monitoring", "Prometheus",
    "Grafana", "Elastic Stack", "CI/CD", "Agile", "Scrum", "Kanban",

    # ---------------- Version Control & Collaboration ----------------
    "Git", "GitHub", "GitLab", "Bitbucket", "SourceTree", "Code Review",
    "JIRA", "Confluence", "Slack", "Trello", "Asana", "ClickUp",

    # ---------------- Software Architecture ----------------
    "Microservices", "Monolithic Architecture", "Serverless", "Design Patterns",
    "Clean Architecture", "MVC", "MVVM", "Event-Driven Architecture",
    "Domain-Driven Design", "API Gateway", "Load Balancing", "Caching",

    # ---------------- Testing ----------------
    "Unit Testing", "Integration Testing", "End-to-End Testing", "Jest",
    "Mocha", "Chai", "Cypress", "Playwright", "Selenium", "Postman",
    "PyTest", "JUnit", "TestNG", "Robot Framework", "TDD", "BDD",

    # ---------------- Data Science & ML ----------------
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP",
    "Computer Vision", "Data Science", "Data Engineering", "TensorFlow",
    "PyTorch", "Keras", "Scikit-learn", "Pandas", "NumPy", "Matplotlib",
    "Seaborn", "Plotly", "OpenCV", "Hugging Face", "LangChain", "RAG",
    "Feature Engineering", "Model Deployment", "MLOps", "AutoML",

    # ---------------- Big Data & Analytics ----------------
    "Apache Spark", "Hadoop", "Hive", "Pig", "Kafka", "Flink", "Snowflake",
    "Databricks", "ETL", "Airflow", "Data Warehousing", "Data Visualization",
    "Tableau", "Power BI", "Google Data Studio",

    # ---------------- Cybersecurity ----------------
    "Ethical Hacking", "Penetration Testing", "Network Security", "Firewalls",
    "Encryption", "OWASP", "Vulnerability Scanning", "SIEM", "SOC", "Threat Analysis",

    # ---------------- Mobile Development ----------------
    "Android", "iOS", "React Native", "Flutter", "SwiftUI", "Jetpack Compose",
    "Kotlin Multiplatform", "Cordova", "Ionic", "Xamarin",

    # ---------------- AI / LLM Development ----------------
    "Prompt Engineering", "OpenAI API", "Hugging Face Transformers",
    "LangChain", "Vector Databases", "FAISS", "Pinecone", "ChromaDB",
    "RAG Systems", "LLM Fine-Tuning", "Sentence Transformers", "Embedding Models",

    # ---------------- Game Development ----------------
    "Unity", "Unreal Engine", "Blender", "Cocos2d", "Three.js", "WebGL",
    "Game Physics", "2D Game Design", "3D Modeling", "Animation",

    # ---------------- Blockchain ----------------
    "Blockchain", "Web3", "Solidity", "Ethereum", "Smart Contracts",
    "Hardhat", "Truffle", "MetaMask", "IPFS", "DeFi", "NFT Development",
    "Hyperledger", "Polygon", "Smart Contract Testing",

    # ---------------- Soft Skills ----------------
    "Leadership", "Communication", "Problem Solving", "Critical Thinking",
    "Teamwork", "Adaptability", "Time Management", "Creativity",
    "Attention to Detail", "Decision Making", "Collaboration",

    # ---------------- Other / Tools ----------------
    "VS Code", "IntelliJ IDEA", "Postman", "Figma", "Adobe XD", "Jupyter Notebook",
    "Colab", "Swagger", "Notion", "API Testing", "Performance Optimization",
    "Debugging", "Documentation", "Version Control", "Continuous Deployment",
    "Continuous Integration"
]


# Step 2: Load a pretrained model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Step 3: Create embeddings for all skills
skill_embs = model.encode(skills, normalize_embeddings=True)

# Step 4: Save embeddings and skill names
np.save("skill_embs.npy", skill_embs)
with open("skill_ids.json", "w") as f:
    json.dump(skills, f)

# Step 5: Build FAISS index
d = skill_embs.shape[1]  # embedding dimension
index = faiss.IndexFlatIP(d)  # cosine similarity (if normalized)
index.add(np.array(skill_embs, dtype=np.float32))

faiss.write_index(index, "skill_index.faiss")

print("✅ Skill index built and saved successfully!")
