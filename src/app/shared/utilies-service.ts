import { Injectable } from '@angular/core';
import { IonButton, LoadingController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtiliesService {
  private readonly loadingController = new LoadingController();
  private loadingElement: HTMLIonLoadingElement | null = null;
  async presentLoading(message: string = 'Please wait...', duration?: number) {
    // Si ya hay uno mostrándose, lo cerramos para evitar duplicados
    if (this.loadingElement) {
      await this.dismissLoading();
    }

    this.loadingElement = await this.loadingController.create({
      message,
      duration: duration, // Si es undefined, se queda cargando infinitamente
      spinner: 'crescent',
    });

    await this.loadingElement.present();
    return this.loadingElement;
  }

  // Método para cerrar el loading manualmente
  async dismissLoading() {
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
      this.loadingElement = null;
    }
  }
}
