import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ResetComponent]',
  standalone: true
})
export class ResetDirective implements OnChanges {

  @Input() ResetComponent!: boolean;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
    this.viewContainerRef.createEmbeddedView(templateRef);
    console.log("Entre");
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['ResetComponent'] && changes['ResetComponent'].previousValue != undefined){
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

}
