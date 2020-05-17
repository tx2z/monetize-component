/**
 * Add here the custom interfaces that will be used in the component
 */
/**
 * The data we want to pass to the main template of the component
 */
export interface TemplateVariables {
  hello: string;
  testMessage?: string;
  attributeValue?: string;
}

export interface Pointer {
  name: string;
  pointer: string;
  interval: number;
}
