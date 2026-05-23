import pandas as pd

data = [
    ["Data Scientist", "Python, Machine Learning, Pandas, NumPy, SQL, Statistics, Data Visualization"],
    ["Data Analyst", "Excel, SQL, Tableau, Power BI, Data Cleaning, Python"],
    ["Backend Developer", "Node.js, Express, MongoDB, REST APIs, Docker, Authentication"],
    ["Frontend Developer", "HTML, CSS, JavaScript, React, Redux, TypeScript"],
    ["Full Stack Developer", "React, Node.js, Express, MongoDB, Docker, Git"],
    ["DevOps Engineer", "AWS, Docker, Kubernetes, CI/CD, Jenkins, Terraform"],
    ["Cloud Engineer", "AWS, Azure, GCP, Docker, Kubernetes, Linux"],
    ["Cybersecurity Analyst", "Network Security, Firewalls, Ethical Hacking, Python, Penetration Testing"],
    ["Machine Learning Engineer", "Python, TensorFlow, PyTorch, Deep Learning, Computer Vision, NLP"],
    ["AI Engineer", "Python, Neural Networks, TensorFlow, PyTorch, LLMs"],
    ["Database Administrator", "SQL, MySQL, PostgreSQL, Oracle, Backup, Replication"],
    ["Mobile App Developer", "Flutter, Dart, React Native, Firebase, Android Studio"],
    ["Game Developer", "Unity, C#, 3D Modelling, Blender, Physics Engines"],
    ["Blockchain Developer", "Solidity, Ethereum, Smart Contracts, Web3.js, Cryptography"],
    ["UI/UX Designer", "Figma, Adobe XD, Wireframing, User Research, Prototyping"],
    ["Product Manager", "Agile, Scrum, Jira, Market Research, Roadmapping"],
    ["Software Tester", "Selenium, JMeter, Test Cases, Manual Testing, Automation"],
    ["Business Analyst", "Excel, SQL, Business Intelligence, Communication, Power BI"],
    ["Data Engineer", "Python, Spark, Hadoop, ETL, SQL, Airflow"],
    ["Cloud Architect", "AWS, Azure, GCP, Terraform, Docker, Networking"],
    ["Game Designer", "Unity, Game Mechanics, Storyboarding, UX Design"],
    ["Embedded Systems Engineer", "C, C++, Microcontrollers, IoT, PCB Design"],
    ["IoT Developer", "Arduino, MQTT, Raspberry Pi, Sensors, Python"],
    ["Robotics Engineer", "ROS, Python, C++, Computer Vision, Control Systems"],
    ["System Administrator", "Linux, Networking, Shell Scripting, Firewalls, Troubleshooting"],
    ["Network Engineer", "Networking, Cisco, Routers, Switches, Firewalls"],
    ["Computer Vision Engineer", "Python, OpenCV, Deep Learning, Image Processing, CNN"],
    ["NLP Engineer", "Python, Transformers, BERT, Text Mining, NLTK"],
    ["AI Researcher", "Deep Learning, PyTorch, TensorFlow, Research, Mathematics"],
    ["Game AI Developer", "Unity, C#, AI Algorithms, Pathfinding, Machine Learning"],
    ["SEO Specialist", "SEO, Google Analytics, Keyword Research, Content Strategy"],
    ["Digital Marketer", "Google Ads, SEO, Social Media Marketing, Content Marketing"],
    ["Content Writer", "Copywriting, SEO, Content Creation, Blogging"],
    ["Video Editor", "Premiere Pro, After Effects, Storyboarding, Motion Graphics"],
    ["Graphic Designer", "Photoshop, Illustrator, Figma, Color Theory"],
    ["Financial Analyst", "Excel, Financial Modelling, SQL, Power BI"],
    ["HR Analyst", "Excel, HR Analytics, Reporting, Communication"],
    ["Operations Manager", "Planning, Forecasting, Leadership, Supply Chain"],
    ["Sales Executive", "CRM, Negotiation, Communication, Lead Generation"]
]

df = pd.DataFrame(data, columns=["job_role", "skills"])
df.to_csv("skills_career_dataset.csv", index=False)
print("✅ Dataset saved as skills_career_dataset.csv")
