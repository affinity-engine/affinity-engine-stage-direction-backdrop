import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { initialize as initializeHook } from 'ember-hook';
import { initializeQUnitAssertions } from 'ember-message-bus';
import { initialize as initializeStage } from 'affinity-engine-stage';
import { deepStub } from 'affinity-engine';

const {
  get,
  getOwner,
  getProperties,
  set,
  setProperties
} = Ember;

moduleForComponent('affinity-engine-stage-direction-backdrop', 'Integration | Component | Affinity Engine stage direction backdrop', {
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeHook();
    initializeQUnitAssertions(appInstance);
    initializeStage(appInstance);
  }
});

const configurationTiers = [
  'directable.attrs',
  'directable.attrs.fixture',
  'config.attrs.stage.backdrop',
  'config.attrs.globals'
];

configurationTiers.forEach((priority) => {
  test(`imageElement is assigned by priority ${priority}`, function(assert) {
    assert.expect(1);

    const stub = deepStub(priority, 'imageElement', '<img id="success">');

    setProperties(this, getProperties(stub, 'config', 'directable'));

    this.render(hbs`{{affinity-engine-stage-direction-backdrop directable=directable config=config}}`);

    assert.ok(this.$('#success').length > 0, 'img is present');
  });

  test(`src is assigned by priority ${priority}`, function(assert) {
    assert.expect(1);

    const stub = deepStub(priority, 'src', 'foo');

    setProperties(this, getProperties(stub, 'config', 'directable'));

    this.render(hbs`{{affinity-engine-stage-direction-backdrop directable=directable config=config}}`);

    assert.equal(this.$('img').attr('src'), 'foo', 'src is correct');
  });

  test(`caption is assigned by priority ${priority}`, function(assert) {
    assert.expect(1);

    const translator = {
      keyMap: {
        foo: 'bar'
      },
      translate(key) {
        return get(this.keyMap, key);
      }
    };

    const stub = deepStub(priority, 'caption', 'foo');

    setProperties(this, getProperties(stub, 'config', 'directable'));
    set(this, 'translator', translator);

    this.render(hbs`{{affinity-engine-stage-direction-backdrop directable=directable config=config translator=translator}}`);

    assert.equal(this.$('img').attr('alt'), 'bar', 'alt is correct');
  });
});

test('alt is set by the fixture id if no caption is present', function(assert) {
  assert.expect(1);

  const translator = {
    keyMap: {
      backdrops: {
        foo: 'bar'
      }
    },
    translate(key) {
      return get(this.keyMap, key);
    }
  };

  set(this, 'translator', translator);
  set(this, 'directable', { attrs: { fixture: { id: 'foo' } } });

  this.render(hbs`{{affinity-engine-stage-direction-backdrop directable=directable translator=translator}}`);

  assert.equal(this.$('img').attr('alt'), 'bar', 'alt is correct');
});
