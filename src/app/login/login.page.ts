import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';
import { HTTP } from '@ionic-native/http';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userName: string = 'cityon';
  password: string = '';
  constructor(private router: Router, private authService: ApiserviceService, private network: NetworkInterface) { }

  ngOnInit() {
  }

  login() {
    let data = {
      "LoginId": this.userName,
      "Password": this.password
    }
    let url = this.authService.baseUrl + this.authService.userLogin;
    this.authService.present();
    console.log(data);
    this.authService.requestServer(url, 'post', data).subscribe(res => {
      this.authService.dismiss();
      console.log(res);
      localStorage.setItem('userId', res['userId']);
      this.authService.PresentToast('login worked', 'success');
      this.router.navigate(['/home']);
    }, err => {
      this.authService.dismiss();
    })
  }

  ionViewDidEnter() {
    this.network.getWiFiIPAddress().then(address => {
      this.authService.network = address.ip
    })
  }

}
