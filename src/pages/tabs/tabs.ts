import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScanResult, BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { HomePage } from '../home/home';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;

  options: any = {
    name: 'data.db',
    location: 'default',
    createFromLocation: 1
  }

  private fixedURL: string = 'http://tcc.1click.pf/museum/index.php?mat=42ZENOI09G&oeuvre=';
  private scannedData: any;

  result: BarcodeScanResult;
  constructor(private alertCtrl: AlertController, public dbService: HomePage, private bcs: BarcodeScanner, private toastCtrl: ToastController, public iab: InAppBrowser) {
    
  }


/*   scanBarcode(){

    const options: BarcodeScannerOptions = {
      prompt: 'Veuillez scanner l\'oeuvre',
      torchOn: false
    };

    this.bcs.scan(options)
    .then(res => {
      this.result = res;
    })

    .catch(err => {
      this.toastCtrl.create({
        message: err.message
      }).present();
    })
  } */

  private goToScanner(): any {
    this.bcs.scan()
      .then(barcodeData => {
        console.log('Barcode data', barcodeData);
        this.scannedData = barcodeData.text;
        this.checkCodeValidity();
      })
      .catch(err => {
        this.toastCtrl.create({
          message: err.message
        }).present();
      });
  }


  private checkCodeValidity(): any {
    this.dbService.db.executeSql('SELECT qrcode FROM `oeuvre` WHERE oeuvre.qrcode=' +this.scannedData, {})
      .then(checkCode => {
        console.log('Check QR code validity', checkCode.rows.item(0));
        if(checkCode.rows.item(0)) {
          this.updateSeenStatus();
        } else {
          this.invalidCodeAlert();
        }
      })
      .catch(err => {
          console.log('Error check code validity', err);
      });
  }


  private updateSeenStatus(): any {
    this.dbService.db.executeSql("UPDATE `oeuvre` SET checked = '1' WHERE oeuvre.qrcode="+this.scannedData, {})
      .then(() => {
        console.log('Status updated to "seen"');
        this.goToBrowser()
      })
      .catch(err => {
          console.log('Error updateSeenStatus', err);
          console.log(JSON.stringify(err));
      });
  }


  private goToBrowser(): void {

    const closed: InAppBrowserOptions = {
      closebuttoncaption: "yes"
    }
    
    this.iab.create(this.fixedURL + this.scannedData, '_self', closed);
  }


  private invalidCodeAlert(): any {
    this.alertCtrl.create({
      title: "QR code invalide !",
      message: "Ce QR code ne correspond à aucune oeuvre du Tahiti Code Camp Museum.",
      buttons: [
        {
          text: "OK",
          handler: this.goToScanner(),
        },
      ]
    }) 
  }

}
