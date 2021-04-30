import {
  ChangeDetectionStrategy,
  Component, ComponentFactoryResolver, ComponentRef, Input,
  OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef
} from '@angular/core';
import { isEqual } from 'lodash-es';
import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-framework-widget',
  template: `<div #widgetContainer></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectFrameworkComponent implements OnChanges, OnInit {
  newComponent: ComponentRef<any> = null;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  @ViewChild('widgetContainer', {
      read: ViewContainerRef,
      static: true })
    widgetContainer: ViewContainerRef;

  constructor(
    private componentFactory: ComponentFactoryResolver,
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.updateComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    let updateRequired = false;
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (change.firstChange || !isEqual(change.previousValue, change.currentValue)) {
          updateRequired = true;
          break;
        }
      }
    }
    if (updateRequired) {
      this.updateComponent();
    }
  }

  updateComponent() {
    if (this.widgetContainer && !this.newComponent && this.jsf.framework) {
      this.newComponent = this.widgetContainer.createComponent(
        this.componentFactory.resolveComponentFactory(this.jsf.framework)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
