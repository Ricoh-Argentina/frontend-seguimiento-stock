import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-destinatarios',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDialogActions],
  templateUrl: './destinatarios.component.html',
  styleUrl: './destinatarios.component.scss'
})
export class DestinatariosDialogComponent {


  form: any = undefined;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DestinatariosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { values: string[] }
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      items: this.fb.array(this.data.values.map(v => this.fb.control(v)))
    });
  }

  get items() {
    return this.form!.get('items') as FormArray;
  }

  add() {
    this.items.push(this.fb.control(''));
  }

  remove(i: number) {
    this.items.removeAt(i);
  }

  submit() {
    this.dialogRef.close(this.items.value as string[]);
  }

  close() {
    this.dialogRef.close();
  }
}
