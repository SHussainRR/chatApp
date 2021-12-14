import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { makeUserOnline } from 'src/utils/functions';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    makeUserOnline(false);
    localStorage.removeItem('nickname');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
