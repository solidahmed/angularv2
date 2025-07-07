import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Form Builder Pro';
  
  navLinks = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/forms', label: 'Forms', icon: 'description' },
    { path: '/submissions', label: 'Submissions', icon: 'assignment' },
    { path: '/reports', label: 'Reports', icon: 'assessment' }
  ];
}