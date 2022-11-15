import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';

@Component({
  selector: 'app-multiitem-packapp',
  templateUrl: './multiitem-packapp.page.html',
  styleUrls: ['./multiitem-packapp.page.scss'],
})
export class MultiitemPackappPage implements OnInit {

  upcCode: any;
  packAppDetails: any;
  itemDetails: any;
  upc: any;
  eventLog: string = "";
  isScanned: boolean = false;
  poNumber: any;
  constructor(private router: Router, private authService: ApiserviceService) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/packapp-menus']);
  }

  handleScanner() {
    setTimeout(() => {
      this.getSingleItem()
    }, 200)
  }

  getSingleItem() {
    let data = {
      "poBarCode": this.poNumber
    }
    let url = this.authService.baseUrl + this.authService.multiItemPackApp;
    this.authService.present();
    this.authService.requestServer(url, "post", data).subscribe(res => {
      this.authService.dismiss();
      this.packAppDetails = res;
      if (this.packAppDetails['popupMessage']['error']) {
        this.authService.PresentToast(this.packAppDetails['popupMessage']['error'], 'danger');
        this.eventLog = this.packAppDetails['popupMessage']['error'] + '\n' + this.eventLog;
      } else {
        this.packAppDetails.address = this.packAppDetails.shipToAddress.name1 + ', ' + this.packAppDetails.shipToAddress.address1 + ', ' + this.packAppDetails.shipToAddress.city + ', ' + this.packAppDetails.shipToAddress.state + ', ' + this.packAppDetails.shipToAddress.postalCode + ', ' + this.packAppDetails.shipToAddress.phone;
        this.itemDetails = this.packAppDetails.orderItemList;
        for (let item of this.itemDetails) {
          item.unpicked = 0;
          item.scanUPC = "";
          item.isScanned = false;
        }
        this.authService.PresentToast('PO# ' + this.poNumber + ' is scanned successfully', 'success');
        this.eventLog = 'PO# ' + this.poNumber + ' is scanned successfully' + '\n' + this.eventLog;
      }
    }, err => {
      this.authService.PresentToast('Unable to reach server', 'danger');
      this.eventLog = 'Unable to reach server' + '\n' + this.eventLog;
    })
  }

  handleUpcScanner(item) {
    setTimeout(() => {
      this.validateUpc(item)
    }, 200);
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
      this.isScanned = true;
      this.updateOrder();
    }
  }

  updateOrder() {
    this.authService.present();
    this.packAppDetails.scanStatusEnum = "30"
    for (let i of this.packAppDetails.orderItemList) {
      i.itemScanStatusEnum = "40"
    }

    let url = this.authService.baseUrl + this.authService.updateOrder;
    console.log(url);
    console.log(this.packAppDetails);
    this.authService.requestServer(url, 'post', this.packAppDetails).subscribe(res => {
      this.authService.dismiss();
      if (res['scanStatusEnum'] == 'Picked') {
        this.authService.PresentToast(res['popupMessage']['information'], 'success');
        this.eventLog = res['popupMessage']['information'] + '\n' + this.eventLog;
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

  print() {
    this.router.navigate(['/print'], {
      queryParams: { value: false }
    });
  }

}
