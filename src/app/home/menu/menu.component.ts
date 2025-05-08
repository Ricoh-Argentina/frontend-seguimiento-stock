import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

/* Angular Material */
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'

/* Componente customizado */
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { SecurityService } from '../../services/security.service';
import { User } from '../../models/user';
import { Global } from '../../services/global';

/* Element of menu */
export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  public usuario!: User;
    public url: string;
    
  sideNavCollapsed=signal(false);
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }

  constructor(
      private _securitydService: SecurityService,
      private _router: Router
      ){
      this.usuario=this._securitydService.usuario;
      this.url=Global.url;
    }
    
  menuItems = signal<MenuItem[]>([
    {
      icon: 'list_alt',
      label: 'Listado',
      route: 'task-list',
    },
    {
      icon: 'summarize',
      label: 'Reportes',
      route: 'reports',
      subItems: [
        {
          icon: 'face',
          label: 'Cliente',
          route: 'client',
        },
        {
          icon: 'square_dot',
          label: 'Producto',
          route: 'product',
        }
      ]
    },
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'edit_document',
      label: 'Administracion',
      route: 'administration',
      subItems: [
        {
          icon: 'account_box',
          label: 'Usuarios',
          route: 'users',
        },
        {
          icon: 'article',
          label: 'Articulos',
          route: 'articles',
        },
        {
          icon: 'man',
          label: 'Proveedores',
          route: 'suppliers',
        }
      ]
    },
    {
      icon: 'article',
      label: 'Articulos',
      route: 'articulos',
      subItems: [
        {
          icon: 'inventory_2',
          label: 'Inventario',
          route: 'inventory',
        },
        {
          icon: 'add_box',
          label: 'Movimiento',
          route: 'movimiento',
        },
        {
          icon: 'work_history',
          label: 'Ordenes',
          route: 'orders',
        }
      ]
    },
  ]);

  profilePicSize= computed(()=> this.sideNavCollapsed() ? '32' : '100');

  logout(){
    this._securitydService.logout();
    this._router.navigateByUrl("/");
  }

  get userImage(){
    return this.usuario.imagen ? `../../../assets/img/${this.usuario.imagen}` : `../../../assets/img/Avatar4.png`;
  }
}
