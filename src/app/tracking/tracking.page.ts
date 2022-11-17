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
    this.router.navigate(['/singleitem-packapp'], {
      queryParams: {value: JSON.stringify(this.orderPackageList)}
    });
  }

  ionViewDidEnter() {
    this.poNumber = this.authService.packAppDetail.purchaseOrderNumber;
    this.orderPackageList = this.authService.packAppDetail.orderPackageList;
    for (let item of this.orderPackageList) {
      item.scannedQty = 0;
      item.trackingNo = "";
      item.status = "UnScanned";
      item.isScanned = false;
    }
  }

  handleUpcScanner(item) {
    setTimeout(() => {
      this.validateTrackingNo(item)
    }, 300);
  }

  validateTrackingNo(item) {
    if (item.trackingNo == item.trackingNumber) {
      this.authService.PresentToast('Tracking#: ' + item.trackingNo + ' is successfully scanned', 'success');
        this.eventLog = 'Tracking#: ' + item.trackingNo + ' is successfully scanned' + '\n' + this.eventLog;
        item.trackingNo = '';
        item.isScanned = true;
        item.status = "Scanned";
    } else {
      item.trackingNo = '';
      this.authService.PresentToast('Please enter valid Tracking number', 'danger');
      this.eventLog = 'Please enter valid Tracking number' + '\n' + this.eventLog;
    }
    let checkScanStatus = this.orderPackageList.filter(i => i.isScanned == false)
    if(checkScanStatus.length == 0){
      this.updateOrder();
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
        this.authService.PresentToast(res['popupMessage']['information'], 'success');
        this.eventLog = res['popupMessage']['information'] + '\n' + this.eventLog;
        this.router.navigate(['/singleitem-packapp']);
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
