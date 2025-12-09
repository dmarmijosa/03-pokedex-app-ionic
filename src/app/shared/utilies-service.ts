import { Injectable } from '@angular/core';
import { IonButton, LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtiliesService {
  private readonly loadingController = new LoadingController();

  async presentLoading(message: string = 'Please wait...') {
    const loading = await this.loadingController.create({
      message,
      duration: 100,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }
}
