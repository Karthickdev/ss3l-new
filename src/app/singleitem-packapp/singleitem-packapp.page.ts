import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';

@Component({
  selector: 'app-singleitem-packapp',
  templateUrl: './singleitem-packapp.page.html',
  styleUrls: ['./singleitem-packapp.page.scss'],
})
export class SingleitemPackappPage implements OnInit {

  upcCode: any;
  packAppDetails: any;
  itemDetails: any;
  upc: any;
  eventLog: string = "";
  isScanned: boolean = false;
  showPrint: boolean = true;
  showBag: boolean = false;
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
      "upcCode": this.upcCode
    }
    let url = this.authService.baseUrl + this.authService.singleItemPackApp;
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
          item.unpicked = 1;
          item.quantity--;
        }
        this.authService.PresentToast(this.packAppDetails.popupMessage.information, 'success');
        this.eventLog = this.packAppDetails.popupMessage.information + '\n' + this.eventLog;
      }
    }, err => {
      this.authService.PresentToast('Unable to reach server', 'danger');
      this.eventLog = 'Unable to reach server' + '\n' + this.eventLog;
    })
  }

  handleUpcScanner() {
    setTimeout(() => {
      this.validateUpc()
    }, 200);
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
          this.isScanned = true;
          this.updateOrder();
          this.authService.packAppDetail = this.packAppDetails
          if (this.packAppDetails.clientName == "Jingle Bunnies") {
            this.showBag = true;
            this.showPrint = false;
            this.packAppDetails.isBagAdded = "true";
          }
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
          this.isScanned = true;
          this.updateOrder();
          this.authService.packAppDetail = this.packAppDetails
          if (this.packAppDetails.clientName == "Jingle Bunnies") {
            this.showBag = true;
            this.showPrint = false;
            this.packAppDetails.isBagAdded = "true";
          }
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
        this.showBag = false;
        this.showPrint = true;
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
      queryParams: { value: true }
    });
  }

}
