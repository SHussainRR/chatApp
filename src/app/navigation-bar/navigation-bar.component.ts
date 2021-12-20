import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    UserService.makeUserOnline(false);
    localStorage.removeItem('nickname');
    localStorage.removeItem('userId');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
