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
  constructor(private router: Router, private file: File, private fileOpener: FileOpener, private printer: Printer, private authService: ApiserviceService,
    private alertCtrl: AlertController, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.isSingleItem = res.value;
    })
  }

  ngOnInit() {
  }

  back() {
    if (this.isSingleItem) {
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
    let filename = this.authService.packAppDetail.attachmentList.name;
    let pdf = this.authService.packAppDetail.attachmentList.file;
    let mimeType = this.authService.packAppDetail.attachmentList.mimeType;
    this.file.writeFile(writeDirectory, filename + '.pdf', this.convertBase64ToBlob(pdf, mimeType), { replace: true })
      .then(() => {
        this.printer.print(writeDirectory + filename + '.pdf', { name: filename + '.pdf', orientation: 'portrait', printer: 'ipp://' + this.authService.network }).then(onSuccess => {
          if (this.isSingleItem) {
            this.router.navigate(['/tracking']);
          } else {
            this.updateOrder();
          }
        }).catch(err => {
          this.showAlert(err + ' printErr');
        })
      })
      .catch(() => {
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
