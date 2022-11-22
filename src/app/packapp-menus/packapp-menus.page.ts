import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packapp-menus',
  templateUrl: './packapp-menus.page.html',
  styleUrls: ['./packapp-menus.page.scss'],
})
export class PackappMenusPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotohome() {
    this.router.navigate(['/home']);
  }

  gotosingleitemscan() {
    this.router.navigate(['/singleitem-packapp']);
  }

  gotomultiitemscan() {
    this.router.navigate(['/multiitem-packapp']);
  }

}
