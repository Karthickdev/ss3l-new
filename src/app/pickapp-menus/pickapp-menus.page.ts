import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pickapp-menus',
  templateUrl: './pickapp-menus.page.html',
  styleUrls: ['./pickapp-menus.page.scss'],
})
export class PickappMenusPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotohome() {
    this.router.navigate(['/home']);
  }

  gotosingleitemscan() {
    this.router.navigate(['/singleitem-pickapp']);
  }

  gotomultiItemscan() {
    this.router.navigate(['/multi-item-pickapp']);
  }

}
