import { html, fixture, expect } from '@open-wc/testing';
import '../form/form-select.js';
import { I18n } from '../../i18n/index.js';

suite('FormSelect', () => {
  test('default initialization', async () => {
    const el = await fixture(html`<form-select></form-select>`);
    
    expect(el.label).to.equal('');
    expect(el.name).to.equal('');
    expect(el.value).to.equal('');
    expect(Array.isArray(el.options)).to.be.true;
    expect(el.options).to.have.length(0);
    expect(el.placeholder).to.equal(I18n.t('select.placeholder'));
    expect(el.disabled).to.be.false;
    expect(el.error).to.equal('');
    expect(el.required).to.be.false;
  });

  test('property reflection', async () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    const el = await fixture(html`
      <form-select
        label="Test Label"
        name="test-select"
        value="option1"
        .options=${options}
        placeholder="Select an option"
        ?disabled=${false}
        error=""
        ?required=${true}
      ></form-select>
    `);
    
    const select = el.shadowRoot.querySelector('select');
    
    expect(el.shadowRoot.querySelector('label').textContent).to.equal('Test Label');
    expect(select.id).to.equal('test-select');
    expect(select.name).to.equal('test-select');
    expect(select.value).to.equal('option1');
    expect(select.hasAttribute('disabled')).to.be.false;
    expect(select.hasAttribute('required')).to.be.true;
    expect(el.shadowRoot.querySelector('.error')).to.be.null;
  });

  test('renders options correctly', async () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    const el = await fixture(html`
      <form-select
        .options=${options}
        value="option1"
      ></form-select>
    `);
    
    const optionElements = el.shadowRoot.querySelectorAll('option');
    expect(optionElements.length).to.equal(options.length + 1); // +1 for placeholder
    expect(optionElements[1].value).to.equal('option1');
    expect(optionElements[1].textContent.trim()).to.equal('Option 1');
    expect(optionElements[1].selected).to.be.true;
  });

  test('renders string options correctly', async () => {
    const stringOptions = ['Option A', 'Option B'];
    
    const el = await fixture(html`
      <form-select
        .options=${stringOptions}
        value="Option A"
      ></form-select>
    `);
    
    const optionElements = el.shadowRoot.querySelectorAll('option');
    expect(optionElements.length).to.equal(stringOptions.length + 1); // +1 for placeholder
    expect(optionElements[1].value).to.equal('Option A');
    expect(optionElements[1].textContent.trim()).to.equal('Option A');
    expect(optionElements[1].selected).to.be.true;
  });

  test('error display', async () => {
    const el = await fixture(html`
      <form-select
        label="Test Label"
        name="test-select"
        error="This field is required"
      ></form-select>
    `);
    
    const errorDiv = el.shadowRoot.querySelector('.error');
    expect(errorDiv).to.exist;
    expect(errorDiv.textContent).to.equal('This field is required');
  });

  test('change event', async () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    const el = await fixture(html`
      <form-select
        name="test-select"
        .options=${options}
      ></form-select>
    `);
    
    const select = el.shadowRoot.querySelector('select');
    
    let eventFired = false;
    let eventDetail = null;
    
    el.addEventListener('select-change', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    });
    
    select.value = 'option2';
    select.dispatchEvent(new Event('change'));
    
    expect(eventFired).to.be.true;
    expect(eventDetail).to.deep.equal({
      name: 'test-select',
      value: 'option2'
    });
    expect(el.value).to.equal('option2');
  });

  test('disabled state', async () => {
    const el = await fixture(html`<form-select ?disabled=${true}></form-select>`);
    const select = el.shadowRoot.querySelector('select');
    
    expect(select.hasAttribute('disabled')).to.be.true;
  });

  test('a11y', async () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    const el = await fixture(html`
      <form-select
        label="Accessible Select"
        name="accessible-select"
        .options=${options}
      ></form-select>
    `);
    
    await expect(el).to.be.accessible();
  });
  
  test('placeholder option is selected when no value is provided', async () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    
    const el = await fixture(html`
      <form-select
        .options=${options}
      ></form-select>
    `);
    
    const optionElements = el.shadowRoot.querySelectorAll('option');
    expect(optionElements[0].selected).to.be.true;
    expect(optionElements[0].disabled).to.be.true;
    expect(optionElements[0].value).to.equal('');
    expect(optionElements[0].textContent).to.equal(I18n.t('select.placeholder'));
  });
  
  test('custom placeholder text', async () => {
    const customPlaceholder = 'Choose an option';
    const el = await fixture(html`
      <form-select
        placeholder="${customPlaceholder}"
      ></form-select>
    `);
    
    const placeholderOption = el.shadowRoot.querySelector('option');
    expect(placeholderOption.textContent).to.equal(customPlaceholder);
  });
});