import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';

@Component({
  selector: 'app-singleitem-pickapp',
  templateUrl: './singleitem-pickapp.page.html',
  styleUrls: ['./singleitem-pickapp.page.scss'],
})
export class SingleitemPickappPage implements OnInit {

  poNumber: any;
  itemDetails = [];
  upc: any;
  eventLog: string = '';
  scanDetail: any;
  constructor(private router: Router, private authService: ApiserviceService) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/pickapp-menus']);
  }

  handleScanner() {
    setTimeout(() => {
      this.getSingleItem()
    }, 200);
  }

  handleUpcScanner() {
    setTimeout(() => {
      this.validateUpc()
    }, 200);
  }

  getSingleItem() {
    let data = {
      "poBarCode": this.poNumber
    }
    let url = this.authService.baseUrl + this.authService.singleitempickapp;
    this.authService.present();
    this.authService.requestServer(url, 'post', data).subscribe(res => {
      this.authService.dismiss();
      this.scanDetail = res
      console.log(this.scanDetail['popupMessage']['error']);
      if (this.scanDetail['popupMessage']['error']) {
        this.authService.PresentToast(this.scanDetail['popupMessage']['error'], 'danger');
        this.eventLog = this.scanDetail['popupMessage']['error'] + '\n' + this.eventLog;
      } else {
        this.itemDetails = this.scanDetail['orderItemList']
        console.log(this.itemDetails);
        for (let item of this.itemDetails) {
          item.unpicked = 0
        }
        this.authService.PresentToast('PO# ' + this.poNumber + ' is successfully scanned', 'success');
        this.eventLog = 'PO# ' + this.poNumber + ' is successfully scanned' + '\n' + this.eventLog;
      }
    }, err => {
      this.authService.dismiss();
      this.authService.PresentToast('Unable to reach server', 'danger');
    })
  }

  validateUpc() {
    if (this.upc == this.itemDetails[0].upc) {
      if (this.itemDetails[0].unpicked <= this.itemDetails[0].quantity) {
        this.itemDetails[0].unpicked++;
        this.itemDetails[0].quantity--;
        this.authService.PresentToast('UPC: ' + this.upc + ' is successfully scanned', 'success');
        this.eventLog = 'UPC: ' + this.upc + ' is successfully scanned' + '\n' + this.eventLog;
        this.upc = '';
        if (this.itemDetails[0].quantity == 0) {
          this.authService.PresentToast('All quantities are scanned', 'success');
          this.eventLog = 'All quantities are scanned' + '\n' + this.eventLog;
          this.updateOrder();
        }
      } else if (this.itemDetails[0].unpicked > this.itemDetails[0].quantity && this.itemDetails[0].quantity != 0) {
        this.itemDetails[0].unpicked++;
        this.itemDetails[0].quantity--;
        this.authService.PresentToast('UPC: ' + this.upc + ' is successfully scanned', 'success');
        this.eventLog = 'UPC: ' + this.upc + ' is successfully scanned' + '\n' + this.eventLog;
        this.upc = '';
        if (this.itemDetails[0].quantity == 0) {
          this.authService.PresentToast('All quantities are scanned', 'success');
          this.eventLog = 'All quantities are scanned' + '\n' + this.eventLog;
          this.updateOrder();
        }
      } else {
        this.upc = '';
        this.authService.PresentToast('All quantities are already scanned', 'danger');
        this.eventLog = 'All quantities are already scanned' + '\n' + this.eventLog;
      }
    } else {
      this.upc = '';
      this.authService.PresentToast('Please enter valid UPC', 'danger');
      this.eventLog = 'Please enter valid UPC' + '\n' + this.eventLog;
    }
  }

  updateOrder() {
    this.authService.present();
    this.scanDetail.scanStatusEnum = "30"
    for (let i of this.scanDetail.orderItemList) {
      i.itemScanStatusEnum = "30"
    }

    let url = this.authService.baseUrl + this.authService.updateOrder;
    console.log(url);
    console.log(this.scanDetail);
    this.authService.requestServer(url, 'post', this.scanDetail).subscribe(res => {
      this.authService.dismiss();
      if (res['scanStatusEnum'] == 'Picked') {
        this.authService.PresentToast('Order successfully udpated', 'success');
        this.eventLog = 'Order successfully udpated' + '\n' + this.eventLog;
        this.poNumber = '';
        this.itemDetails = [];
      } else {
        this.authService.PresentToast('Order is not updated', 'danger');
        this.eventLog = 'Order is not updated' + '\n' + this.eventLog;
      }
    }, err => {
      this.authService.dismiss();
      this.authService.PresentToast('Unable to reach server', 'danger');
      this.eventLog = 'Unable to reach server' + '\n' + this.eventLog;
    })
  }

}
