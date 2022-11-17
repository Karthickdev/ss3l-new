import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { ApiserviceService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {

  isSingleItem: any;
  showSkip = true;
  constructor(private router: Router, private file: File, private fileOpener: FileOpener, private printer: Printer, private authService: ApiserviceService,
    private alertCtrl: AlertController, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.isSingleItem = res.value;
      console.log(this.isSingleItem);
      if(this.isSingleItem == "false"){
        this.showSkip = false;
      }else{
        this.showSkip = true;
      }
    })
  }

  ngOnInit() {
  }

  back() {
    if (this.isSingleItem == "true") {
      this.router.navigate(['/singleitem-packapp']);
    } else {
      this.router.navigate(['/multiitem-packapp']);
    }

  }

  gotoTracking() {
    this.router.navigate(['/tracking']);
  }

  createPdf() {
    
    const writeDirectory = this.file.externalDataDirectory
    let filename = this.authService.packAppDetail.attachmentList[0].name;
    let pdf = this.authService.packAppDetail.content[0];
    let mimeType = this.authService.packAppDetail.attachmentList[0].mimeType;
    this.file.writeFile(writeDirectory, filename + '.pdf', this.convertBase64ToBlob(pdf, mimeType), { replace: true })
      .then(() => {
        this.fileOpener.open(writeDirectory + filename+'.pdf', 'application/pdf').then(()=>{

        }).catch((err) => {
        this.showAlert(err + ' fileopen err');
        console.error('Error open pdf file');
      });
        // this.printer.print(writeDirectory + filename + '.pdf', { name: filename + '.pdf', orientation: 'portrait', printer: 'ipp://' + this.authService.network }).then(onSuccess => {
        //   if (this.isSingleItem) {
        //     this.router.navigate(['/tracking']);
        //   } else {
        //     this.updateOrder();
        //   }
        // }).catch(err => {
        //   this.showAlert(err + ' printErr');
        // })
      })
      .catch((err) => {
        this.showAlert(err + ' printErr');
        console.error('Error writing pdf file');
      });
  }

  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  async showAlert(err) {
    let alert = await this.alertCtrl.create({
      message: err
    });
    alert.present();
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
      } else {
        this.authService.PresentToast('Order is not updated', 'danger');
      }
    }, err => {
      this.authService.dismiss();
      this.authService.PresentToast('Unable to reach server', 'danger');
    })
  }

}
