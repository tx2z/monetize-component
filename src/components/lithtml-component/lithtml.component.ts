import { html, render, TemplateResult } from 'lit-html';
import * as interfaces from './lithtml.component.interfaces';
import * as stylesheet from './lithtml.component.css';

/** The LithtmlComponent web component */
export default class LithtmlComponent extends HTMLElement {
  private metaMonetization: HTMLMetaElement;
  private pointers: interfaces.Pointer[];
  private pointerPosition = 0;

  /**
   * Define witch attribunes of the custom element need to be observed
   */
  static get observedAttributes(): string[] {
    return ['data-pointers'];
  }
  private shadow: ShadowRoot;

  // Define the variables we wil use in the component's main template
  private templateVariables: interfaces.TemplateVariables = {
    hello: 'web monetization component',
  };

  constructor() {
    super();

    // Create shadow dom
    this.shadow = this.attachShadow({ mode: 'open' });

    // Add monetization metatag
    if (typeof document !== 'undefined' /* && document.monetization*/) {
      this.metaMonetization = document.createElement('meta');
      this.metaMonetization.name = 'monetization';
      // this.metaMonetization.content = '$wallet.example.com/sloan';
      document.head.appendChild(this.metaMonetization);
    } else {
      console.log('no monetization support');
    }
  }

  /**
   * Executed when the custom element is added to the page.
   */
  public connectedCallback(): void {
    this.render();
  }

  /**
   * Execute every time an attribute defined in observedAttributes changes
   * @param attr The attribute that changes
   * @param oldValue Old value of the attribute
   * @param newValue New value of the attribute
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    if (attr === 'data-pointers' && oldValue !== newValue) {
      console.log('start');
      this.startMonetization(newValue);
      /*
      this.templateVariables.attributeValue = newValue;
      // Render the template with the changes
      this.render();
      */
    }
  }

  /**
   * Public funtion for test purposes. This function can be called from the temaplte.
   */
  public buttonClick(): void {
    this.templateVariables.testMessage = 'You click the button!';
    // Render the template with the changes
    this.render();
  }

  /**
   * Render the lit-html teamplate and add it to the shadow dom.
   */
  private render(): void {
    const { buttonClick } = this;
    // Define the lit-html template
    const lithtmlTemplate = (data: interfaces.TemplateVariables): TemplateResult =>
      html`
        <style>
          ${stylesheet.default}
        </style>
        ${data.hello}
        <br />
        <button id="testButton" @click=${buttonClick}>Test button</button>
        <p id="testMessage">${data.testMessage}</p>
        <p>Attribute value: <span id="attributeValue">${data.attributeValue}</span></p>
      `;
    /**
     * Render the lit-html teamplate and add it to the shadow dom. EventContext
     * is assigned to this so we can execute the public functions of the class
     * in the template
     */
    render(lithtmlTemplate(this.templateVariables), this.shadow, { eventContext: this });
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
