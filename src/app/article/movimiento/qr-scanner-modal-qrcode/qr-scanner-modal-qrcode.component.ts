import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeCameraScanConfig, Html5QrcodeSupportedFormats, Html5QrcodeResult } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scanner-modal-qrcode',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './qr-scanner-modal-qrcode.component.html',
  styleUrl: './qr-scanner-modal-qrcode.component.scss'
})
export class QrScannerModalQrcodeComponent implements OnInit, OnDestroy {
  @ViewChild('qrContainer', { static: true }) qrContainer!: ElementRef;

  html5QrCode!: Html5Qrcode;
  cameras: { id: string, label: string }[] = [];
  selectedCameraId: string | null = null;
  scanning: boolean = false;
  errorMessage: string = '';

  constructor(public dialogRef: MatDialogRef<QrScannerModalQrcodeComponent>) {}

  ngOnInit(): void {
    Html5Qrcode.getCameras().then(devices => {
      this.cameras = devices.map(d => ({ id: d.id, label: d.label }));
      if (this.cameras.length > 0) {
        this.selectedCameraId = this.cameras[0].id;
        this.startScanner();
      } else {
        this.errorMessage = 'No se encontraron cámaras disponibles';
      }
    }).catch(err => {
      this.errorMessage = 'Error al acceder a la cámara: ' + err;
    });
  }

  startScanner(): void {
    if (!this.selectedCameraId) return;
    this.html5QrCode = new Html5Qrcode(this.qrContainer.nativeElement.id);
    this.scanning = true;
    this.html5QrCode.start(
      this.selectedCameraId,
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText: string, result: Html5QrcodeResult) => {
        this.scanning = false;
        this.html5QrCode.stop().then(() => {
          this.dialogRef.close(decodedText);
        });
      },
      (errorMessage: string) => {
        // No mostrar errores de escaneo repetidos
      }
    ).catch(err => {
      this.errorMessage = 'No se pudo iniciar el escáner: ' + err;
      this.scanning = false;
    });
  }

  onCameraChange(cameraId: string): void {
    this.selectedCameraId = cameraId;
    if (this.scanning) {
      this.html5QrCode.stop().then(() => {
        this.startScanner();
      });
    } else {
      this.startScanner();
    }
  }

  cancelar(): void {
    if (this.scanning && this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        this.dialogRef.close();
      });
    } else {
      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    if (this.scanning && this.html5QrCode) {
      this.html5QrCode.stop();
    }
  }
}
