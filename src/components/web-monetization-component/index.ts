import WmComponent from './wm.component';
window.customElements.define('monetize-component', WmComponent);
declare global {
  interface HTMLElementTagNameMap {
    'monetize-component': WmComponent;
  }
}
