import { Component, inject, signal } from '@angular/core';
import { from } from 'rxjs';

/*Angular Material */
import { MatTabsModule } from '@angular/material/tabs';

/* Modulos custom*/
import { NewComponent } from './new/new.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';

/* Datos */
import { UserInterface } from '../../interfaces/user.interface';
import { UserResponse } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { SecurityService } from '../../services/security.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTabsModule, NewComponent, ListComponent, EditComponent, DeleteComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [UserService, SecurityService]
})
export class UsersComponent {

}
