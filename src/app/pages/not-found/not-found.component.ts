import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  currentPath: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentPath = this.router.url;
    console.error('404 Error: User attempted to access non-existent route:', this.currentPath);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}