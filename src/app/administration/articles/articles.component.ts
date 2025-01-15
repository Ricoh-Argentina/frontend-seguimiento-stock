import { Component } from '@angular/core';

/*Angular Material */
import { MatTabsModule } from '@angular/material/tabs';

/* Modulos custom*/
import { NewArticlesComponent } from './new/newArticles.component';
import { ListArticlesComponent } from './list/listArticles.component';
import { EditArticlesComponent } from './edit/editArticles.component';
import { DeleteArticlesComponent } from './delete/deleteArticles.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [MatTabsModule, NewArticlesComponent, ListArticlesComponent, EditArticlesComponent, DeleteArticlesComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {

}
