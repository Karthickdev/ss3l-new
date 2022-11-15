import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';

@Component({
  selector: 'app-multi-item-pickapp',
  templateUrl: './multi-item-pickapp.page.html',
  styleUrls: ['./multi-item-pickapp.page.scss'],
})
export class MultiItemPickappPage implements OnInit {

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

  getMultiItem() {
    let data = {
      "poBarCode": this.poNumber
    }
    let url = this.authService.baseUrl + this.authService.singleitempickapp;
    this.authService.present();
    this.authService.requestServer(url, 'post', data).subscribe(res => {
      this.authService.dismiss();
      this.scanDetail = res
      if (this.scanDetail['popupMessage']['error']) {
        this.authService.PresentToast(this.scanDetail['popupMessage']['error'], 'danger');
        this.eventLog = this.scanDetail['popupMessage']['error'] + '\n' + this.eventLog;
      } else {
        this.itemDetails = this.scanDetail['orderItemList']
        for (let item of this.itemDetails) {
          item.unpicked = 0
          item.scanUPC = '';
          item.isScanned = false;
        }
        this.authService.PresentToast('PO# ' + this.poNumber + ' is successfully scanned', 'success');
        this.eventLog = 'PO# ' + this.poNumber + ' is successfully scanned' + '\n' + this.eventLog;
      }
    }, err => {
      this.authService.dismiss();
      this.authService.PresentToast('Unable to reach server', 'danger');
    })
  }

  validateUpc(item) {
    if (item.scanUPC == item.upc) {
      if (item.unpicked <= item.quantity) {
        item.unpicked++;
        item.quantity--;
        this.authService.PresentToast('UPC: ' + item.scanUPC + ' is successfully scanned', 'success');
        this.eventLog = 'UPC: ' + item.scanUPC + ' is successfully scanned' + '\n' + this.eventLog;
        item.scanUPC = '';
        if (item.quantity == 0) {
          this.authService.PresentToast('All quantities are scanned', 'success');
          this.eventLog = 'All quantities are scanned' + '\n' + this.eventLog;
          item.isScanned = true;
        }
      } else if (item.unpicked > item.quantity && item.quantity != 0) {
        item.unpicked++;
        item.quantity--;
        this.authService.PresentToast('UPC: ' + item.scanUPC + ' is successfully scanned', 'success');
        this.eventLog = 'UPC: ' + item.scanUPC + ' is successfully scanned' + '\n' + this.eventLog;
        item.scanUPC = '';
        if (item.quantity == 0) {
          this.authService.PresentToast('All quantities are scanned', 'success');
          this.eventLog = 'All quantities are scanned' + '\n' + this.eventLog;
          item.isScanned = true;
        }
      } else {
        item.scanUPC = '';
        this.authService.PresentToast('All quantities are already scanned', 'danger');
        this.eventLog = 'All quantities are already scanned' + '\n' + this.eventLog;
      }
    } else {
      item.scanUPC = '';
      this.authService.PresentToast('Please enter valid UPC', 'danger');
      this.eventLog = 'Please enter valid UPC' + '\n' + this.eventLog;
    }

    let unScannedUpcItems = this.itemDetails.filter(i => i.isScanned == false);
    if (unScannedUpcItems.length == 0) {
      this.updateOrder();
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
