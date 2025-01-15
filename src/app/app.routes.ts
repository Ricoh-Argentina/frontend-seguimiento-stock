import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsByClientsComponent } from './reports/reports-by-clients/reports-by-clients.component';
import { ReportsByProductsComponent } from './reports/reports-by-products/reports-by-products.component';
import { AdministrationComponent } from './administration/administration.component';
import { UsersComponent } from './administration/users/users.component';
import { ArticlesComponent } from './administration/articles/articles.component';
import { SuppliersComponent } from './administration/suppliers/suppliers.component';
import { ArticleComponent } from './article/article.component';
import { InventoryComponent } from './article/inventory/inventory.component';
import { MovimientoComponent } from './article/movimiento/movimiento.component';
import { OrdersComponent } from './article/orders/orders.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    //{ path: '', component: HomeComponent },       
    {
        path: 'home', component: HomeComponent,
        children: [
            { path: 'task-list', component: TaskListComponent }, 
            { path: 'reports', component: ReportsComponent, 
                children: [
                    { path: 'client', component: ReportsByClientsComponent }, 
                    { path: 'product', component: ReportsByProductsComponent },
                ]
            },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'administration', component: AdministrationComponent, 
                children: [
                    { path: 'users', component: UsersComponent }, 
                    { path: 'articles', component: ArticlesComponent },
                    { path: 'suppliers', component: SuppliersComponent },
                ]
            },
            { path: 'articulos', component: ArticleComponent, 
                children: [
                    { path: 'inventory', component: InventoryComponent }, 
                    { path: 'movimiento', component: MovimientoComponent },
                    { path: 'orders', component: OrdersComponent },
                ]
            },
        ]
    },
    { path: '**', component: LoginComponent },
];