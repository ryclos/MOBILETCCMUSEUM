import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult} from '@ionic-native/barcode-scanner';




@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {

  result: BarcodeScanResult;
  constructor(public navCtrl: NavController, public navParams: NavParams, private bcs: BarcodeScanner, private toastCtrl: ToastController) {
    this.scanBarcode();
  }

  ionViewWillEnter(){
    this.scanBarcode();
  }

  scanBarcode(){

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
  }


}
