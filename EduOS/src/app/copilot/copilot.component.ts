// copilot.component.ts
import { Component } from '@angular/core';
import { CopilotService } from './copilot.service';

interface ChatMessage {
  sender: 'user' | 'copilot';
  text: string;
}

@Component({
  selector: 'app-copilot',
  templateUrl: './copilot.component.html',
  styleUrls: ['./copilot.component.css']
})
export class CopilotComponent {
  userQuestion = '';
  chat: ChatMessage[] = [];
  loading = false;

  constructor(private copilotService: CopilotService) {}

  sendQuestion() {
    if (!this.userQuestion.trim()) return;

    this.chat.push({ sender: 'user', text: this.userQuestion });
    const questionToSend = this.userQuestion;
    this.userQuestion = '';
    this.loading = true;

    this.copilotService.askQuestion({ question: questionToSend })
      .subscribe({
        next: (res) => {
          this.chat.push({ sender: 'copilot', text: res.answer });
          this.loading = false;
        },
        error: (err) => {
          this.chat.push({ sender: 'copilot', text: 'Failed to get response.' });
          console.error(err);
          this.loading = false;
        }
      });
  }
}