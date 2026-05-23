import pandas as pd
import random
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import joblib
from flask import Flask, request, jsonify
import numpy as np

# ------------------------------------
# 1️⃣  Define all 40 Job Roles (consistent everywhere)
# ------------------------------------
roles = [
    "Data Scientist", "Data Analyst", "Backend Developer", "Frontend Developer", "Full Stack Developer",
    "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "Machine Learning Engineer", "AI Engineer",
    "Database Administrator", "Mobile App Developer", "Game Developer", "Blockchain Developer", "UI/UX Designer",
    "Product Manager", "Software Tester", "Business Analyst", "Data Engineer", "Cloud Architect",
    "Game Designer", "Embedded Systems Engineer", "IoT Developer", "Robotics Engineer", "System Administrator",
    "Network Engineer", "Computer Vision Engineer", "NLP Engineer", "AI Researcher", "Game AI Developer",
    "SEO Specialist", "Digital Marketer", "Content Writer", "Video Editor", "Graphic Designer",
    "Financial Analyst", "HR Analyst", "Operations Manager", "Sales Executive"
]

# ------------------------------------
# 2️⃣  Create Synthetic Dataset
# ------------------------------------
data = []
for _ in range(2000):
    role = random.choice(roles)
    skills_count = random.randint(5, 35)
    projects_done = random.randint(0, 10)
    certs = random.randint(0, 5)
    exp = random.uniform(0, 8)
    learning_rate = skills_count / (exp + 1)

    # readiness score formula (weighted linear combination)
    readiness = (
        0.35 * skills_count +
        3 * projects_done +
        3 * certs +
        4 * exp +
        random.uniform(-10, 10)
    )
    readiness = max(0, min(100, readiness))
    months_to_job_ready = max(1, 12 - readiness / 10)

    data.append([role, skills_count, projects_done, certs, exp, learning_rate, readiness, months_to_job_ready])

df = pd.DataFrame(data, columns=[
    "target_role", "skills_count", "projects_done", "certifications",
    "experience_years", "learning_rate", "career_readiness_score", "months_to_job_ready"
])

df.to_csv("career_forecast_dataset.csv", index=False)
print("✅ Synthetic dataset created successfully with 40 roles!")

# ------------------------------------
# 3️⃣  Train Linear Regression Model
# ------------------------------------
le = LabelEncoder()
df["target_role_encoded"] = le.fit_transform(df["target_role"])

X = df[["skills_count", "projects_done", "certifications", "experience_years", "learning_rate", "target_role_encoded"]]
y = df["career_readiness_score"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

# Save model and encoder
joblib.dump(model, "career_forecast_model.pkl")
joblib.dump(le, "career_role_encoder.pkl")

print("✅ Linear Regression model trained and saved successfully!")