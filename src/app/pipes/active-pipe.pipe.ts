import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activePipe',
  standalone: true
})
export class ActivePipePipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): unknown {
    return value ? "ACTIVO" : "INACTIVO";
  }

}
