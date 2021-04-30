import {
  ChangeDetectionStrategy,
  Component, ComponentFactoryResolver, ComponentRef, Input,
  OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef
} from '@angular/core';
import { isEqual } from 'lodash-es';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-widget-widget',
  template: `<div #widgetContainer></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectWidgetComponent implements OnChanges, OnInit {
  newComponent: ComponentRef<any> = null;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  @ViewChild('widgetContainer', { read: ViewContainerRef, static: true })
    widgetContainer: ViewContainerRef;

  constructor(
    private componentFactory: ComponentFactoryResolver
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
    if (this.widgetContainer && !this.newComponent && (this.layoutNode || {}).widget) {
      this.newComponent = this.widgetContainer.createComponent(
        this.componentFactory.resolveComponentFactory(this.layoutNode.widget)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
