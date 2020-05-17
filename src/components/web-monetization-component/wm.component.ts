import { Pointer } from './wm.component.interfaces';
import { prepareTemplate } from '../../helpers';
import * as htmlTemplate from './wm.component.html';
import * as stylesheet from './wm.component.css';

/** The WmComponent web component */
export default class WmComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private metaMonetization: HTMLMetaElement;
  private pointers: Pointer[];
  private pointerPosition = 0;

  constructor() {
    super();

    // Add monetization metatag
    if (typeof document !== 'undefined' /* && document.monetization*/) {
      this.metaMonetization = document.createElement('meta');
      this.metaMonetization.name = 'monetization';
      // this.metaMonetization.content = '$wallet.example.com/sloan';
      document.head.appendChild(this.metaMonetization);
    } else {
      console.log('no monetization support');
    }

    // Add the main template to the component
    const templateElement = document.createElement('template');

    // Add stylesheet
    templateElement.innerHTML = `<style>${stylesheet.default}</style>`;

    // Prepare template
    const templateVariables = {
      title: 'web monetization component',
    };
    templateElement.innerHTML += prepareTemplate(htmlTemplate.default, templateVariables);

    // Attach template content to the shadow dom
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Define witch attribunes of the custom element need to be observed
   */
  static get observedAttributes(): string[] {
    return ['data-pointers'];
  }

  /**
   * Execute every time an attribute defined in observedAttributes changes
   * @param attr The attribute that changes
   * @param oldValue Old value of the attribute
   * @param newValue New value of the attribute
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    if (attr === 'data-pointers' && oldValue !== newValue) {
      this.startMonetization(newValue);
    }
  }

  /**
   * Executed when the custom element is added to the page.
   */
  public connectedCallback(): void {
    this.addEventListeners();
  }
  /**
   * Executed when the custom element is removed from page.
   */
  public disconnectedCallback(): void {
    console.log('disconected!');
    this.shadow.removeEventListener(
      'click',
      event => {
        this.eventListerners(this.shadow, event);
      },
      false
    );
  }

  /**
   * Add EventListeners to the shadow dom of the component.
   * It allow to listen events even if the content of the component is not yet
   * created
   */
  private addEventListeners(): void {
    this.shadow.addEventListener(
      'click',
      event => {
        this.eventListerners(this.shadow, event);
      },
      false
    );
  }

  /**
   * Function executed by an eventlistener to perform onclick action
   * @param shadow The shadow DOM element attached to the class
   * @param event The Event of the parent event listener
   */
  private eventListerners(shadow: ShadowRoot, event: Event): void {
    const target = event.target as HTMLElement;

    /**
     * Add the event listener to the testButton to add a message in the
     * testMessage component's element
     */
    if (target.id === 'testButton') {
      event.preventDefault();
      const testMessage = shadow.getElementById('testMessage') as HTMLElement;
      testMessage.innerHTML = 'You click the button!';
    }
  }

  private nextPointer(): void {
    const pointer = this.pointers[this.pointerPosition];
    this.metaMonetization.content = pointer.pointer;
    if (this.pointerPosition === this.pointers.length - 1) {
      this.pointerPosition = 0;
    } else {
      this.pointerPosition++;
    }
    this.setInterval(pointer.interval);
  }

  private setInterval(time: number): void {
    setTimeout(() => this.nextPointer(), time);
  }

  private startMonetization(pointers: string): void {
    // Get pointers from attribute
    this.pointers = JSON.parse(pointers);

    // Add pointer to metatag
    this.nextPointer();
  }
}
