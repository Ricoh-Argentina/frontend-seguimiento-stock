import { Component, inject, signal } from '@angular/core';
import { from } from 'rxjs';

/*Angular Material */
import { MatTabsModule } from '@angular/material/tabs';

/* Modulos custom*/
import { NewSuppliersComponent } from './new/newSuppliers.component';
import { ListSuppliersComponent } from './list/listSuppliers.component';
import { DeleteSuppliersComponent } from './delete/deleteSuppliers.component';

/* Datos */
import { UserInterface } from '../../interfaces/user.interface';
import { UserResponse } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { SecurityService } from '../../services/security.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [MatTabsModule, NewSuppliersComponent, ListSuppliersComponent, DeleteSuppliersComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
  providers: [UserService, SecurityService]
})
export class SuppliersComponent {

}
