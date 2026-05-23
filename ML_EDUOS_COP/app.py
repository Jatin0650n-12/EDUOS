from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json
import os
import pickle
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# ------------------------------
# 1. Load Embedding Model
# ------------------------------
print("🔹 Loading embedding model...")
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# ------------------------------
# 2. Build Skill Index (No FAISS)
# ------------------------------
skill_names = [
    "Python", "Java", "C++", "HTML", "CSS", "JavaScript", "React", "Angular", "Node.js",
    "Django", "Flask", "Machine Learning", "Deep Learning", "Data Science", "SQL",
    "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "Linux", "TensorFlow", "PyTorch",
    "Computer Vision", "NLP", "Data Analysis", "AI", "DevOps", "Frontend", "Backend",
    "Cloud Computing", "Cybersecurity", "Blockchain", "Flutter", "Android", "iOS",
    "Testing", "Automation", "REST API", "Express", "UI/UX Design", "TypeScript",
    "Kotlin", "Swift", "PostgreSQL", "MySQL", "Firebase", "Redis", "Kafka", "Spark",
    "Hadoop", "ETL", "Airflow", "Terraform", "CI/CD", "Jenkins", "Ansible", "Bash",
    "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Tableau", "Power BI",
    "Excel", "Figma", "Adobe XD", "Solidity", "Web3.js", "Unity", "C#", "Unreal Engine",
    "MQTT", "Arduino", "Raspberry Pi", "IoT", "Microcontrollers", "Networking",
    "Penetration Testing", "SIEM", "Firewalls", "Encryption", "JWT", "OAuth",
    "GraphQL", "gRPC", "Microservices", "System Design", "Agile", "Scrum", "JIRA",
    "Postman", "Selenium", "JMeter", "GitHub Actions", "GitLab CI", "Helm", "GCP", "Azure"
]

print("⚙️ Building skill embeddings...")
skill_embs = np.array(embedder.encode(skill_names, normalize_embeddings=True))
print("✅ Skill embeddings ready!")

# ------------------------------
# 3. Load Career Model
# ------------------------------
try:
    model = pickle.load(open("career_model.pkl", "rb"))
    vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
    print("✅ Career model loaded!")
except Exception as e:
    print("⚠️ Could not load model:", e)
    model = None
    vectorizer = None

# ------------------------------
# 4. Dummy Students for Collaborative Filtering
# ------------------------------
students = [
    {"studentId":"S1","jobRole":"Data Scientist","quizScore":85,"responseTime":120,"resourcesUsed":["R1","R2","R3"]},
    {"studentId":"S2","jobRole":"Frontend Developer","quizScore":70,"responseTime":150,"resourcesUsed":["R4","R5"]},
    {"studentId":"S3","jobRole":"Backend Developer","quizScore":90,"responseTime":110,"resourcesUsed":["R6","R7","R8"]},
    {"studentId":"S4","jobRole":"Full Stack Developer","quizScore":65,"responseTime":180,"resourcesUsed":["R9","R10"]},
    {"studentId":"S5","jobRole":"Machine Learning Engineer","quizScore":95,"responseTime":100,"resourcesUsed":["R11","R12","R13"]},
    {"studentId":"S6","jobRole":"Data Analyst","quizScore":75,"responseTime":140,"resourcesUsed":["R14","R15"]},
    {"studentId":"S7","jobRole":"DevOps Engineer","quizScore":60,"responseTime":200,"resourcesUsed":["R16","R17"]},
    {"studentId":"S8","jobRole":"Cloud Engineer","quizScore":80,"responseTime":130,"resourcesUsed":["R18","R19","R20"]},
    {"studentId":"S9","jobRole":"Data Scientist","quizScore":78,"responseTime":150,"resourcesUsed":["R1","R21"]},
    {"studentId":"S10","jobRole":"Frontend Developer","quizScore":88,"responseTime":125,"resourcesUsed":["R4","R22","R23"]},
    {"studentId":"S11","jobRole":"Backend Developer","quizScore":82,"responseTime":135,"resourcesUsed":["R6","R24"]},
    {"studentId":"S12","jobRole":"Full Stack Developer","quizScore":70,"responseTime":160,"resourcesUsed":["R9","R25","R26"]},
    {"studentId":"S13","jobRole":"Machine Learning Engineer","quizScore":92,"responseTime":110,"resourcesUsed":["R11","R27"]},
    {"studentId":"S14","jobRole":"Data Analyst","quizScore":68,"responseTime":175,"resourcesUsed":["R14","R28"]},
    {"studentId":"S15","jobRole":"DevOps Engineer","quizScore":73,"responseTime":145,"resourcesUsed":["R16","R29","R30"]},
    {"studentId":"S16","jobRole":"Cloud Engineer","quizScore":85,"responseTime":120,"resourcesUsed":["R18","R31"]},
    {"studentId":"S17","jobRole":"Data Scientist","quizScore":88,"responseTime":115,"resourcesUsed":["R1","R32","R33"]},
    {"studentId":"S18","jobRole":"Frontend Developer","quizScore":65,"responseTime":180,"resourcesUsed":["R4","R34"]},
    {"studentId":"S19","jobRole":"Backend Developer","quizScore":90,"responseTime":105,"resourcesUsed":["R6","R35"]},
    {"studentId":"S20","jobRole":"Full Stack Developer","quizScore":80,"responseTime":130,"resourcesUsed":["R9","R36","R37"]}
]

# ------------------------------
# 5. Routes
# ------------------------------

@app.route("/recommend-skills", methods=["POST"])
def recommend_skills():
    data = request.get_json()
    extracted_skills = data.get("skills", [])
    if not extracted_skills:
        return jsonify({"success": False, "message": "No skills provided"}), 400

    print(f"🧠 Received skills: {extracted_skills}")

    # Encode input skills
    query_embs = np.array(embedder.encode(extracted_skills, normalize_embeddings=True))

    # Compute cosine similarity between input skills and all skill embeddings
    similarities = cosine_similarity(query_embs, skill_embs)

    recommended = set()
    for sim_row in similarities:
        top_indices = np.argsort(sim_row)[::-1][:5]
        for idx in top_indices:
            recommended.add(skill_names[idx])

    # Remove already present skills
    recommended = list(recommended - set(extracted_skills))

    return jsonify({
        "success": True,
        "input_skills": extracted_skills,
        "recommended_skills": recommended
    })


@app.route('/predict-career', methods=['POST'])
def predict_career():
    try:
        data = request.get_json()
        skills = data.get("skills", [])

        if not skills:
            return jsonify({"success": False, "message": "Please provide skills"}), 400

        skill_text = " ".join(skills)
        X = vectorizer.transform([skill_text])
        prediction = model.predict(X)[0]

        return jsonify({
            "success": True,
            "predicted_role": prediction
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def compute_score(student):
    return 0.7 * (student["quizScore"] / 100) + 0.3 * (1 - student["responseTime"] / 300)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    target_job = data['jobRole']
    target_score = 0.7 * (data['quizScore'] / 100) + 0.3 * (1 - data['responseTime'] / 300)

    role_students = [s for s in students if s["jobRole"] == target_job and s["studentId"] != data["studentId"]]

    neighbors = []
    for s in role_students:
        similarity = 1 / (1 + abs(compute_score(s) - target_score))
        neighbors.append((s, similarity))

    neighbors.sort(key=lambda x: x[1], reverse=True)
    top_neighbors = neighbors[:3]

    recommended = {}
    for n, sim in top_neighbors:
        for r in n["resourcesUsed"]:
            if r not in data["resourcesUsed"]:
                recommended[r] = recommended.get(r, 0) + sim

    recommended_sorted = sorted(recommended.keys(), key=lambda x: recommended[x], reverse=True)
    return jsonify({"recommendedResources": recommended_sorted})


with open("career_skills.json", "r") as f:
    career_data = json.load(f)

@app.route('/api/skills/gap', methods=['POST'])
def skill_gap_analysis():
    try:
        data = request.get_json()
        user_skills = [s.strip().lower() for s in data.get("skills", [])]
        target_role = data.get("target_role")

        if not target_role or target_role not in career_data:
            return jsonify({"error": "Invalid or missing target_role"}), 400

        role_info = career_data[target_role]
        required_skills = [s.lower() for s in role_info["required_skills"]]
        importance = role_info["importance"]

        matched_skills = [s for s in required_skills if s in user_skills]
        missing_skills = [s for s in required_skills if s not in user_skills]
        readiness = round((len(matched_skills) / len(required_skills)) * 100, 2)

        missing_details = []
        for i, skill in enumerate(required_skills):
            if skill not in user_skills:
                missing_details.append({"skill": skill, "importance": importance[i]})

        return jsonify({
            "target_role": target_role,
            "total_skills_required": len(required_skills),
            "matched_skills_count": len(matched_skills),
            "missing_skills_count": len(missing_skills),
            "readiness_percentage": readiness,
            "matched_skills": matched_skills,
            "missing_skills": missing_details
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/forecast-growth", methods=["POST"])
def forecast_growth():
    data = request.json
    skills = data.get("skills", [])
    target_role = data.get("target_role", "")
    exp = float(data.get("experience_years", 0))
    projects = int(data.get("projects_done", 0))
    certs = int(data.get("certifications", 0))
    learning_rate = len(skills) / (exp + 1)

    role_skill_map = {
        "Data Scientist": ["Python", "R", "Machine Learning", "Pandas", "NumPy", "Statistics", "SQL", "TensorFlow", "Data Visualization", "Matplotlib"],
        "Backend Developer": ["Python", "Java", "C#", "Node.js", "Express", "SQL", "MongoDB", "APIs", "Docker", "Git", "AWS"],
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Angular", "TypeScript", "UI/UX", "Bootstrap", "Redux", "Tailwind"],
        "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git", "AWS"],
        "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "SQL", "NLP", "Computer Vision"],
        "Cloud Engineer": ["AWS", "Azure", "Docker", "Kubernetes", "Linux", "Terraform", "Networking", "CI/CD"],
        "Cybersecurity Analyst": ["Network Security", "Penetration Testing", "Linux", "Firewalls", "SIEM", "Encryption", "Incident Response"],
        "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "Jenkins", "AWS", "Terraform", "CI/CD", "Git"],
        "Android Developer": ["Kotlin", "Java", "Android Studio", "Firebase", "REST API", "Git", "MVVM"],
        "Data Engineer": ["Python", "Spark", "Hadoop", "ETL", "SQL", "Airflow", "Kafka", "Data Warehousing"],
    }

    role_skills = role_skill_map.get(target_role, [])
    total_skills = len(role_skills)

    if total_skills == 0:
        return jsonify({"error": "Unknown or unmapped role"}), 400

    matching_skills = [s for s in role_skills if s in skills]
    missing_skills = [s for s in role_skills if s not in skills]
    skill_coverage = len(matching_skills) / total_skills

    readiness = (
        (skill_coverage * 70)
        + (min(exp, 5) * 5)
        + (min(projects, 10) * 1.5)
        + (certs * 2)
        + min(learning_rate, 10)
    )
    readiness = max(0, min(100, readiness))
    months_to_job_ready = max(1, 12 * (1 - (readiness / 100)))

    forecast_curve = [
        min(100, round(readiness + i * (100 - readiness) / max(1, months_to_job_ready), 2))
        for i in range(int(months_to_job_ready) + 1)
    ]

    return jsonify({
        "target_role": target_role,
        "career_readiness_score": round(readiness, 2),
        "job_ready_in_months": round(months_to_job_ready, 2),
        "skill_coverage_percent": round(skill_coverage * 100, 2),
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "forecast_curve": forecast_curve
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)