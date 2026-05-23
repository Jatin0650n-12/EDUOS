import { Component } from '@angular/core';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css']
})
export class RoadmapComponent {

  roadmapData: any[] = [];

  ngOnInit(){

  const stored = localStorage.getItem("roadmap");

  if(!stored) return;

  const apiResponse = JSON.parse(stored);

  this.roadmapData = apiResponse.roadmap;

}
  // ngOnInit() {

  //   const stored = localStorage.getItem("roadmap");

  //   if (!stored) {
  //     console.error("No roadmap found in localStorage");
  //     return;
  //   }

  //   const apiResponse = JSON.parse(stored);
  //   let roadmapString = apiResponse.roadmap;

  //   if (!roadmapString) {
  //     console.error("Roadmap string missing");
  //     return;
  //   }

  //   let jsonString = "";

  //   // Case 1: JSON inside ```json ```
  //   const markdownMatch = roadmapString.match(/```json([\s\S]*?)```/);

  //   if (markdownMatch) {
  //     jsonString = markdownMatch[1].trim();
  //   } 
  //   else {
  //     // Case 2: Extract JSON object OR array
  //     const jsonMatch = roadmapString.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);

  //     if (!jsonMatch) {
  //       console.error("JSON block not found in AI response");
  //       return;
  //     }

  //     jsonString = jsonMatch[0];
  //   }

  //   try {

  //     const parsed = JSON.parse(jsonString);

  //     let weeksArray: any[] = [];

  //     // If AI returns array
  //     if (Array.isArray(parsed)) {
  //       weeksArray = parsed;
  //     } 
  //     else {
  //       // If AI returns object (week1, week2)
  //       weeksArray = Object.keys(parsed).map((key) => parsed[key]);
  //     }

  //     this.roadmapData = weeksArray.map((week, index) => {

  //       // Ensure topics array
  //       if (!Array.isArray(week.learning_topics)) {
  //         week.learning_topics = [week.learning_topics];
  //       }

  //       week.learning_topics = week.learning_topics.map((t:any)=>{
  //         if(typeof t === "string"){
  //           return { topic: t, description: "" };
  //         }
  //         return t;
  //       });

  //       // Ensure practice tasks array
  //       if (!Array.isArray(week.practice_task)) {
  //         week.practice_task = [week.practice_task];
  //       }

  //       return {
  //         week: week.week ?? index + 1,
  //         ...week
  //       };

  //     });

  //   } 
  //   catch (error) {
  //     console.error("JSON parsing failed:", error);
  //     console.log("Problematic JSON:", jsonString);
  //   }

  // }

}