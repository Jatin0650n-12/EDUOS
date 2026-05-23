import { Component } from '@angular/core';
import { UploadService } from '../shared/upload.service';
import { SkillService } from '../shared/skill.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  predictedRole: string = '';

forecastCareer(): void {
  if (!this.selectedRole) {
    alert("Please select a target role first!");
    return;
  }

  if (!this.skillsExtracted) {
    alert("Please extract skills first!");
    return;
  }

  // Basic keyword extraction from resume text
  const text = this.textExtracted.toLowerCase();
  

  // Filter detected skills
  const extractedSkills = this.skillsExtracted;
  if (extractedSkills.length === 0) {
    alert("No relevant skills detected from resume!");
    return;
  }

    // ---- 2️⃣ Estimate EXPERIENCE ----
  // Heuristic: look for phrases like “X years”, “X+ years”, “X yr”, etc.
  const expRegex = /(\d+)\s*(\+)?\s*(year|years|yr|yrs)/g;
  let expMatches = [...text.matchAll(expRegex)];
  let experienceYears = 0;
  if (expMatches.length > 0) {
    // Take the max found, assuming longest experience counts
    experienceYears = Math.max(...expMatches.map(m => parseInt(m[1])));
  } else {
    experienceYears = 1; // default
  }

  // ---- 3️⃣ Estimate PROJECT COUNT ----
  // Heuristic: count the occurrences of “project”, “developed”, or “built”
  const projectCount =
    (text.match(/project/g) || []).length +
    (text.match(/developed/g) || []).length +
    (text.match(/built/g) || []).length;
  const projectsDone = Math.max(1, Math.min(projectCount, 10)); // clamp 1–10

  // ---- 4️⃣ Estimate CERTIFICATIONS ----
  // Look for keywords like “certificate”, “certified”, “course”, “training”
  const certCount =
    (text.match(/certification/g) || []).length +
    (text.match(/certified/g) || []).length +
    (text.match(/course/g) || []).length +
    (text.match(/training/g) || []).length;
  const certifications = Math.min(certCount, 5);

  // ---- 5️⃣ Compute learning rate ----
  const learning_rate = extractedSkills.length / (experienceYears + 1);

  // Call Flask forecast API
  this.skillService.forecast(extractedSkills , this.selectedRole , experienceYears , projectsDone , certifications , learning_rate).subscribe({
    next: (res: any) => {
      console.log(res);

      // ✅ Store result
    this.skillService.setForecastResult(res);
      localStorage.setItem('forecastResult', JSON.stringify(res));
    // ✅ Navigate to result page
    this.router.navigate(['/forecast-result']);
    },
    error: (err) => {
      console.error(err);
      alert("❌ Forecast request failed. Please try again later.");
    }
  });
}




  files: any[] = [];

  selectedFile: File | null = null;
  fileName = '';
  fileSizeText = '';
  error = '';
  uploading = false;
  progress = 0;
  success = false;
  recommendedSkills: any;
  selectedRole = '';

  targetRoles: string[] = [
    'Data Scientist', 'Machine Learning Engineer', 'Backend Developer', 'Frontend Developer',
    'Full Stack Engineer', 'UI/UX Designer', 'DevOps Engineer', 'Cloud Architect',
    'Cybersecurity Analyst', 'Mobile App Developer', 'Product Manager', 'Business Analyst',
    'Data Engineer', 'Game Developer', 'AI Researcher', 'Systems Analyst', 'Database Administrator',
    'Software Tester', 'Embedded Systems Engineer', 'Blockchain Developer', 'Network Engineer',
    'AR/VR Developer', 'Automation Engineer', 'Site Reliability Engineer', 'Big Data Engineer',
    'Robotics Engineer', 'AI Product Manager', 'Web Designer', 'Digital Marketer',
    'SEO Specialist', 'Data Analyst', 'Research Scientist', 'ML Ops Engineer', 'IoT Engineer',
    'Computer Vision Engineer', 'NLP Engineer', 'Software Architect', 'Cloud DevOps Engineer',
    'Technical Writer', 'System Administrator'
  ];

  constructor(private uploadService: UploadService,
    private skillService : SkillService,
    private router : Router
  ) {}

  ngOnInit(): void {

    const savedSkills = localStorage.getItem('skillsExtracted');
  if (savedSkills) {
    this.skillsExtracted = JSON.parse(savedSkills);
  }


    this.uploadService.fetchFiles().subscribe(res=>{
      this.files = res.data;
      console.log(this.files)
    });
  }

  onFileSelected(e: Event) {
    this.error = '';
    this.success = false;
    const el = e.target as HTMLInputElement;
    if (!el.files || el.files.length === 0) return;
    const file = el.files[0];
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowed.includes(file.type)) {
      this.error = 'Only PDF and Word documents are allowed.';
      this.selectedFile = null;
      return;
    }
    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxBytes) {
      this.error = 'File is too large. Max 10 MB allowed.';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSizeText = this.humanFileSize(file.size);
  }

  humanFileSize(bytes: number) {
    const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B','KB','MB','GB'][i];
  }
  


  // selectedFile: File | null = null;
  downloadFile(id: string, originalName: string) {
    this.uploadService.downloadFile(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

textExtracted = '';
skillsExtracted = [];
  extractFile(id: string, originalName: string) {
    let skills : [] = [];
    this.uploadService.extractSkills(id).subscribe(res=>{
      this.textExtracted = res.text;
      skills = res.skills;
      this.skillsExtracted = skills;
      localStorage.setItem('skillsExtracted', JSON.stringify(skills));
      console.log(res);

      this.skillService.recommend(skills).subscribe({
  next: (res) => {
    // this.loading = false;
    if (res?.success) {
      this.recommendedSkills = res.recommended_skills || res.recommendedSkills || [];
      console.log(this.recommendedSkills);
      // ✅ Store data
    this.skillService.setRecommendedSkills(res);
       localStorage.setItem('recommendedSkills', JSON.stringify(res));
    // ✅ Navigate to new output page
    this.router.navigate(['/recommend-result']);
    } else {
      // handle error response shape
      console.warn('Recommendation failed', res);
    }
  },
  error: (err) => {
    // this.loading = false;
    console.error('Error fetching recommendations', err);
    // this.toastr.error('Could not fetch recommendations right now');
  }
});



    this.skillService.predict(skills).subscribe({
  next: (res) => {
    // this.loading = false;
    if (res?.success) {
      // this.recommendedSkills = res.recommended_skills || res.recommendedSkills || [];
      console.log("Predicted career path : ", res);

      // ✅ SAVE PREDICTED ROLE IN SERVICE
      this.skillService.setPredictedRole(res.predicted_role);

      // ✅ SAVE IN LOCAL STORAGE
      localStorage.setItem('predictedRole', res.predicted_role);
    } else {
      // handle error response shape
      console.warn('Recommendation failed', res);
    }
  },
  error: (err) => {
    // this.loading = false;
    console.error('Error fetching recommendations', err);
    // this.toastr.error('Could not fetch recommendations right now');
  }
});


    });

    
  }

  upload() {
    if (!this.selectedFile) { this.error = 'No file selected'; return; }
    this.uploading = true;
    this.progress = 0;
    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (evt: any) => {
        if (evt.type === 1 && evt.total) { // HttpEventType.UploadProgress
          this.progress = Math.round((evt.loaded / evt.total) * 100);
        } else if (evt.body) {
          this.uploading = false;
          this.success = true;
          this.selectedFile = null;
          this.fileName = '';
        }
      },
      error: (err) => {
        this.uploading = false;
        this.error = err?.error?.message || 'Upload failed';
      }
    });
  }

 analyzeGap() {
  if (!this.selectedRole) return;

  const payload = {
    target_role: this.selectedRole
  };

  this.skillService.skill_gap_analysis(this.skillsExtracted , this.selectedRole).subscribe( res=>{
    console.log(res);

    // ✅ Store result
    this.skillService.setGapResult(res);
    localStorage.setItem('gapResult', JSON.stringify(res));
    // ✅ Navigate to gap page
    this.router.navigate(['/gap-result']);
  })
}



}
