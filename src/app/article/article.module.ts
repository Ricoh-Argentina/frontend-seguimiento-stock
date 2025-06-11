import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    // ... existing declarations ...
  ],
  imports: [
    // ... existing imports ...
    ZXingScannerModule,
    MatDialogModule
  ],
  // ... rest of the module configuration ...
})
export class ArticleModule { } 