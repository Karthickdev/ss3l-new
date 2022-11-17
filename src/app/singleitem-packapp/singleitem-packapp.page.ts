import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../services/auth.service';

@Component({
  selector: 'app-singleitem-packapp',
  templateUrl: './singleitem-packapp.page.html',
  styleUrls: ['./singleitem-packapp.page.scss'],
})
export class SingleitemPackappPage implements OnInit {
  @ViewChild('upcInput', { static: false }) upcInput;
  upcCode: string = '';
  packAppDetails: any;
  itemDetails: any;
  upc: any;
  eventLog: string = "";
  isScanned: boolean = false;
  showPrint: boolean = true;
  showBag: boolean = false;
  showDetails: boolean = false;
  constructor(private router: Router, private authService: ApiserviceService) { }

  ngOnInit() {
    setTimeout(() => {
      this.upcInput.setFocus();
    }, 400);
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
        this.showDetails = false;
        this.upcCode = '';
        setTimeout(() => {
          this.upcInput.setFocus();
        }, 400);
      } else if(this.packAppDetails['apiResponse']['status'] == "Error"){
        this.upcCode = '';
        this.authService.PresentToast(this.packAppDetails['apiResponse']['message'], 'danger');
        this.eventLog = this.packAppDetails['apiResponse']['message'] + '\n' + this.eventLog;
        this.showDetails = false;
        setTimeout(() => {
          this.upcInput.setFocus();
        }, 400);
      } else {
        this.showDetails = true;
        this.packAppDetails.address = this.packAppDetails.shipToAddress.name1 + ', ' + this.packAppDetails.shipToAddress.address1 + ', ' + this.packAppDetails.shipToAddress.city + ', ' + this.packAppDetails.shipToAddress.state + ', ' + this.packAppDetails.shipToAddress.postalCode + ', ' + this.packAppDetails.shipToAddress.phone;
        this.itemDetails = this.packAppDetails.orderItemList;
        this.authService.packAppDetail = this.packAppDetails;
        for (let item of this.itemDetails) {
          item.scanUpc = "";
          item.isScanned = false;
          if(item.itemScanStatusEnum == "Scanned"){
            item.unpicked = item.quantity
            item.quantity = 0;
            item.isScanned = true;
            this.isScanned = true;
            this.updateOrder();
          }else{
            item.unpicked = 1;
            item.quantity--;
            if(item.quantity == 0){
              item.isScanned = true;
              this.isScanned = true;
              this.updateOrder();
            }
          }
          
        }
        this.authService.PresentToast(this.packAppDetails.popupMessage.information, 'success');
        this.eventLog = this.packAppDetails.popupMessage.information + '\n' + this.eventLog;
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
    if (item.scanUpc== item.upc) {
      if (item.unpicked <= item.quantity) {
        item.unpicked++;
        item.quantity--;
        this.authService.PresentToast('UPC: ' + item.scanUpc+ ' is successfully scanned', 'success');
        this.eventLog = 'UPC: ' + item.scanUpc+ ' is successfully scanned' + '\n' + this.eventLog;
        item.scanUpc= '';
        if (item.quantity == 0) {
          this.authService.PresentToast('All quantities are scanned', 'success');
          this.eventLog = 'All quantities are scanned' + '\n' + this.eventLog;
          this.isScanned = true;
          item.isScanned = true;
          this.authService.packAppDetail = this.packAppDetails
          //this.updateOrder();
        }
      } else if (item.unpicked > item.quantity && item.quantity != 0) {
        item.unpicked++;
        item.quantity--;
        this.authService.PresentToast('UPC: ' + item.scanUpc+ ' is successfully scanned', 'success');
        this.eventLog = 'UPC: ' + item.scanUpc+ ' is successfully scanned' + '\n' + this.eventLog;
        item.scanUpc= '';
        if (item.quantity == 0) {
          this.authService.PresentToast('All quantities are scanned', 'success');
          this.eventLog = 'All quantities are scanned' + '\n' + this.eventLog;
          this.isScanned = true;
          item.isScanned = true;
          this.authService.packAppDetail = this.packAppDetails
          //this.updateOrder();
        }
      } else {
        item.scanUpc= '';
        this.authService.PresentToast('All quantities are already scanned', 'danger');
        this.eventLog = 'All quantities are already scanned' + '\n' + this.eventLog;
      }
    } else {
      item.scanUpc= '';
      this.authService.PresentToast('Please enter valid UPC', 'danger');
      this.eventLog = 'Please enter valid UPC' + '\n' + this.eventLog;
    }
    let checkScanStatus = this.itemDetails.filter(i => i.isScanned == false)
    if(checkScanStatus.length == 0){
      this.updateOrder();
    }
  }

  ionViewWillLeave(){
    this.eventLog = "";
    this.isScanned= false;
    this.showPrint=true;
    this.showBag=false;
    this.showDetails= false;
    this.upcCode = "";
    this.packAppDetails = "";
    this.itemDetails = [];
  }

  updateOrder() {
    this.authService.present();
    this.packAppDetails.scanStatusEnum = "30";
    this.packAppDetails.isBagAdded = "false";
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
        if (this.packAppDetails.clientName == "Jingle Bunnies") {
          this.showBag = true;
          this.showPrint = false;
          this.packAppDetails.isBagAdded = "true";
        }else{
          this.showBag = false;
          this.showPrint = true;
        }
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

  addBag() {
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
