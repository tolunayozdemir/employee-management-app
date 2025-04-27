import { html, fixture, expect } from '@open-wc/testing';
import '../form/form-input.js';

suite('FormInput', () => {
  test('default initialization', async () => {
    const el = await fixture(html`<form-input></form-input>`);
    
    expect(el.label).to.equal('');
    expect(el.name).to.equal('');
    expect(el.type).to.equal('text');
    expect(el.value).to.equal('');
    expect(el.placeholder).to.equal('');
    expect(el.disabled).to.be.false;
    expect(el.error).to.equal('');
    expect(el.required).to.be.false;
  });

  test('property reflection', async () => {
    const el = await fixture(html`
      <form-input
        label="Test Label"
        name="test-input"
        type="email"
        value="test@example.com"
        placeholder="Enter email"
        ?disabled=${false}
        error=""
        ?required=${true}
      ></form-input>
    `);
    
    const input = el.shadowRoot.querySelector('input');
    
    expect(el.shadowRoot.querySelector('label').textContent).to.equal('Test Label');
    expect(input.id).to.equal('test-input');
    expect(input.name).to.equal('test-input');
    expect(input.type).to.equal('email');
    expect(input.value).to.equal('test@example.com');
    expect(input.placeholder).to.equal('Enter email');
    expect(input.hasAttribute('disabled')).to.be.false;
    expect(input.hasAttribute('required')).to.be.true;
    expect(el.shadowRoot.querySelector('.error')).to.be.null;
  });

  test('error display', async () => {
    const el = await fixture(html`
      <form-input
        label="Test Label"
        name="test-input"
        error="This field is required"
      ></form-input>
    `);
    
    const errorDiv = el.shadowRoot.querySelector('.error');
    expect(errorDiv).to.exist;
    expect(errorDiv.textContent).to.equal('This field is required');
  });

  test('input event', async () => {
    const el = await fixture(html`<form-input name="test-input"></form-input>`);
    const input = el.shadowRoot.querySelector('input');
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('input-change', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.deep.equal({
      name: 'test-input',
      value: 'new value'
    });
    expect(el.value).to.equal('new value');
  });

  test('disabled state', async () => {
    const el = await fixture(html`<form-input ?disabled=${true}></form-input>`);
    const input = el.shadowRoot.querySelector('input');
    
    expect(input.hasAttribute('disabled')).to.be.true;
  });

  test('a11y', async () => {
    const el = await fixture(html`
      <form-input
        label="Accessible Input"
        name="accessible-input"
      ></form-input>
    `);
    
    await expect(el).to.be.accessible();
  });
});