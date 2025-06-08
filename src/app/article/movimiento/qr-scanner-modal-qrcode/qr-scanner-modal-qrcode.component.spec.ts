import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScannerModalQrcodeComponent } from './qr-scanner-modal-qrcode.component';

describe('QrScannerModalQrcodeComponent', () => {
  let component: QrScannerModalQrcodeComponent;
  let fixture: ComponentFixture<QrScannerModalQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrScannerModalQrcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrScannerModalQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
