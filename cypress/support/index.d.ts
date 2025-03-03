/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * @description data-cy로 설정된 엘리먼트를 쉽게 찾을 수 있는 커스텀 API
     * @param text 찾고 싶은 data-cy 값
     * @example cy.getByCy('submit-button')
     */
    getByCy(text: string): Chainable<JQuery<HTMLElement>>;
  }
}
