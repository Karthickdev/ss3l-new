import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {

  poNumber: any;
  orderPackageList: any[] = [];
  trackingNumber: any;
  eventLog: string = "";
  isScanned: boolean = false;

  constructor(private router: Router, private authService: ApiserviceService) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/print']);
  }

  ionViewDidEnter() {
    this.poNumber = this.authService.packAppDetail.purchaseOrderNumber;
    this.orderPackageList = this.authService.packAppDetail.orderPackageList;
    for (let item of this.orderPackageList) {
      item.scannedQty = 0;
      item.status = "UnScanned"
    }
  }

  handleUpcScanner() {
    setTimeout(() => {
      this.validateTrackingNo()
    }, 300);
  }

  validateTrackingNo() {
    if (this.trackingNumber == this.orderPackageList[0].trackingNumber) {
      if (this.orderPackageList[0].scannedQty <= this.orderPackageList[0].itemQuantity) {
        this.orderPackageList[0].scannedQty++;
        this.orderPackageList[0].itemQuantity--;
        this.authService.PresentToast('Tracking#: ' + this.trackingNumber + ' is successfully scanned', 'success');
        this.eventLog = 'Tracking#: ' + this.trackingNumber + ' is successfully scanned' + '\n' + this.eventLog;
        this.trackingNumber = '';
        if (this.orderPackageList[0].itemQuantity == 0) {
          this.isScanned = true;
          this.orderPackageList[0].status = "Scanned";
          this.updateOrder();
        }
      } else if (this.orderPackageList[0].scannedQty > this.orderPackageList[0].itemQuantity && this.orderPackageList[0].itemQuantity != 0) {
        this.orderPackageList[0].scannedQty++;
        this.orderPackageList[0].itemQuantity--;
        this.authService.PresentToast('Tracking#: ' + this.trackingNumber + ' is successfully scanned', 'success');
        this.eventLog = 'Tracking#: ' + this.trackingNumber + ' is successfully scanned' + '\n' + this.eventLog;
        this.trackingNumber = '';
        if (this.orderPackageList[0].itemQuantity == 0) {
          this.isScanned = true;
          this.orderPackageList[0].status = "Scanned";
          this.updateOrder();
        }
      } else {
        this.trackingNumber = '';
        this.authService.PresentToast('All quantities are already scanned', 'danger');
        this.eventLog = 'All quantities are already scanned' + '\n' + this.eventLog;
      }
    } else {
      this.trackingNumber = '';
      this.authService.PresentToast('Please enter valid UPC', 'danger');
      this.eventLog = 'Please enter valid UPC' + '\n' + this.eventLog;
    }
  }

  updateOrder() {
    this.authService.present();
    this.authService.packAppDetail.scanStatusEnum = "40"
    for (let i of this.authService.packAppDetail.orderItemList) {
      i.itemScanStatusEnum = "40"
    }

    let url = this.authService.baseUrl + this.authService.updateOrder;
    this.authService.requestServer(url, 'post', this.authService.packAppDetail).subscribe(res => {
      this.authService.dismiss();
      if (res['scanStatusEnum'] == 'Scanned') {
        this.authService.PresentToast('Order successfully udpated', 'success');
        this.eventLog = 'Order successfully udpated' + '\n' + this.eventLog;
        this.router.navigate(['/packapp-menus']);
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
