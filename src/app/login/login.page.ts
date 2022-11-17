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

  userName: string = '';
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
      if(res['status'] == "Success"){
        localStorage.setItem('userId', res['userId']);
        this.router.navigate(['/home']);
      }else{
        this.authService.PresentToast(res['message'], 'danger');
      }
      
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
