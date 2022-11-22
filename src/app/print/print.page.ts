import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
//import { File } from '@awesome-cordova-plugins/file/ngx';
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
  showImg = false;
  blobUrl: any;
  constructor(private router: Router, private file: File, private fileOpener: FileOpener, private printer: Printer, private authService: ApiserviceService,
    private alertCtrl: AlertController, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.isSingleItem = res.value;
      console.log(this.isSingleItem);
      if (this.isSingleItem == "false") {
        this.showSkip = false;
      } else {
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

    const writeDirectory = this.file.documentsDirectory;

    let filename = this.authService.packAppDetail.attachmentList[0].name;
    let pdf = this.authService.packAppDetail.attachmentList[0].file;
    let mimeType = this.authService.packAppDetail.attachmentList[0].mimeType;
    let blob = this.convertBase64ToBlob(pdf, 'application/octet-stream');

    // this.blobUrl = URL.createObjectURL(blob);
    // console.log(this.blobUrl);
    // this.showImg = true;

    //setTimeout(() => {
    this.file.checkDir(writeDirectory, 'southshore').then(() => {
      this.file.writeFile(writeDirectory + 'southshore/', filename + '.pdf', blob, { replace: true })
        .then((res) => {
          this.showAlert(res.toString());
          this.showAlert('blobcreated.. opening file');
          this.fileOpener.open(writeDirectory + 'southshore/' + filename + '.pdf', 'application/pdf').then(() => {
          }, err => {
            this.showAlert(err + ' fileopen err1');
          }).catch((err) => {
            this.showAlert(err + ' fileopen err2');
            console.error('Error open pdf file');
          });
        }, err => {
          this.showAlert(err + ' filewrite err3');
        })
        .catch((err) => {
          this.showAlert(err + ' printErr4');
          console.error('Error writing pdf file');
        });
    }).catch(err => {
      this.showAlert(err + ' check dir error');
      this.file.createDir(writeDirectory, 'southshore', false).then(() => {
        this.file.writeFile(writeDirectory + 'southshore/', filename + '.pdf', blob, { replace: true })
          .then((res) => {
            this.showAlert(res.toString());
            this.showAlert('blobcreated.. opening file');
            this.fileOpener.open(writeDirectory + 'southshore/' + filename + '.pdf', 'application/pdf').then(() => {
            }, err => {
              this.showAlert(err + ' fileopen err5');
            }).catch((err) => {
              this.showAlert(err + ' fileopen err6');
              console.error('Error open pdf file');
            });
          }, err => {
            this.showAlert(err + ' filewrite err7');
          })
          .catch((err) => {
            this.showAlert(err + ' printErr8');
            console.error('Error writing pdf file');
          });
      }).catch(err => {
        this.showAlert(err + ' create dir error');
      })
    })

    // }, 500);

    // this.printer.print(writeDirectory + filename + '.pdf', { name: filename + '.pdf', orientation: 'portrait', printer: 'ipp://' + this.authService.network }).then(onSuccess => {
    //   if (this.isSingleItem) {
    //     this.router.navigate(['/tracking']);
    //   } else {
    //     this.updateOrder();
    //   }
    // }).catch(err => {
    //   this.showAlert(err + ' printErr');
    // })
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
      message: err,
      buttons: [
        {
          text: "ok",
          handler: () => { }
        }
      ]
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
