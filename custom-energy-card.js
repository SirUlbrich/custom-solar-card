
    // private properties

import { html, LitElement, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class CustomEnergyCard extends LitElement {

  // This will make parts of the card rerender when this.hass or this._config is changed.
  // this.hass is updated by Home Assistant whenever anything happens in your system.
  static get properties() {
    return {
      hass: {},
      _config: {},
    };
  }
  getCardSize() {
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    // This is actually optional. If not present, the cardHeight is assumed to be 1.
    return 3;
  }
  static get styles() {
    return css`
      .card {
        display: grid;
        grid-template-areas:
          ". solar ."
          "pv1 pv2 pv3"
          ". line ."
          "grid consumption battery";
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        align-items: center;
        justify-items: center;
        gap: 5%;
        width: 400px;
        height: 400px;
        padding: 20px;
        border: 1px solid #ddd;
      }
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border: 1px solid #ddd;
        height: 100px;
        width: 100px;
        background-color: grey
      }
      #solar {
        grid-area: solar;
      }
      #pv1 {
        grid-area: pv1;
      }
      #pv2 {
        grid-area: pv2;
      }
      #pv3 {
        grid-area: pv3;
      }
      #battery {
        grid-area: battery;
      }
      #grid {
        grid-area: grid;
      }
      /* Gestaltung */
      #consumption {
        grid-area: consumption;
        background-color: grey;
      }
      #solar, #pv1, #pv2, #pv3 {
        background-color: lightyellow;
      }
      #battery {
        background-color: lightskyblue;
      }
      #grid {
        background-color: lightgreen;
      }
      .box .state {
        font-size: 1.5em;
        font-weight: bold;
      }
      .line {
        grid-area: line;
        position: relative;
        width: 100%;
        height: 0.1em;
        background-color: grey;
      }
      .dot {
        position: absolute;
        top: -6px;
        left: 0;
        width: 12px;
        height: 12px;
        background-color: red;
        border-radius: 50%;
        animation: moveDot 5s linear infinite;
      }
    `;
  }
  setConfig(config) {
    this._config = config;
  }

  // The render() function of a LitElement returns the HTML of your card, and any time one or the
  // properties defined above are updated, the correct parts of the rendered html are magically
  // replaced with the new values.  Check https://lit.dev for more info.
  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const solarState = this.hass.states[this._config.solar];
    const pv1State = this.hass.states[this._config.pv1];
    const consumptionState = this.hass.states[this._config.consumption];

    if (!solarState) {
      return html` <ha-card>Unknown entity: ${this._config.solar}</ha-card> `;
    }

    // @click below is also LitElement magic
    return html`
      <ha-card style="padding:1em;">
          <div>
              <div class="card">
              <div class="box" id="solar">
                  <div>☀️ Solar</div>
                  <div class="state" id="solarState"></div>
              </div>
              <div class="box" id="pv1">
                  <div>☀️ PV1</div>
                  <div class="state" id="pv1State"></div>
              </div>
              <div class="box" id="line">
                  <div class="dot"></div>
              </div>
              <div class="box" id="consumption">
                  <div>⚡ Consumption</div>
                  <div class="state" id="consumptionState"></div>
              </div>
              <div class="box" id="grid"><div>Netz</div></div>
              <div class="box" id="pv3"><div>PV3</div></div>
              <div class="box" id="pv2"><div>PV2</div></div>
              </div>
          </div>
          <div>
          reihe 2
          </div>
      </ha-card>
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "custom-energy-card",
    name: "CustomEnergyCard",
    description: "A custom card made by me!" // optional
});
customElements.define('custom-energy-card', CustomEnergyCard);