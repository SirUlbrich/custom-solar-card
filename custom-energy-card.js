class CustomEnergyCard extends HTMLElement {
    // private properties

    _config;
    _hass;
    _elements = {};
    _isAttached = false;

    // lifecycle
    constructor() {
        super();
        this.doStyle();
        this.doCard();
    }

    setConfig(config) {
        this._config = config;
        if (!this._isAttached) {
            this.doAttach();
            this.doQueryElements();
            this.doListen();
            this._isAttached = true;
        }
        this.doCheckConfig();
        this.doUpdateConfig();
    }

    set hass(hass) {
        this._hass = hass;
        this.doUpdateHass()
    }

    connectedCallback() {
        console.log("CustomSolarCard.connectedCallback()")
    }

    onClicked() {
        console.log("CustomSolarCard.onClicked()");
        this.doToggle();
    }

    // accessors
    isOff() {
        return this.getState().state == 'off';
    }

    isOn() {
        return this.getState().state == 'on';
    }

    getHeader() {
        return this._config.header;
    }

    getEntityID() {
        return this._config.solar;
    }

    getState() {
        return this._hass.states[this.getEntityID()];
    }

    getAttributes() {
        return this.getState().attributes
    }

    getName() {
        const friendlyName = this.getAttributes().friendly_name;
        return friendlyName ? friendlyName : this.getEntityID();
    }


    // jobs
    doCheckConfig() {
        if (!this._config.solar) {
            throw new Error('Please define an solar!');
        }
    }

    doStyle() {
        this._elements.style = document.createElement("style");
        this._elements.style.textContent = `
            .tcvj-error {
                text-color: red;
            }
            .tcvj-error--hidden {
                display: none;
            }
            .tcvj-dl {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .tcvj-dl--hidden {
                display: none;
            }
            .tcvj-dt {
                display: flex;
                align-content: center;
                flex-wrap: wrap;
            }
            .tcvj-dd {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, auto) minmax(0, 2fr));
                margin: 0;
            }
            .tcvj-toggle {
                padding: 0.6em;
                border: grey;
                border-radius: 50%;
            }
            .tcvj-toggle--on {
                background-color: green;
            }
            .tcvj-toggle--off{
                background-color: red;
            }
            .tcvj-button {
                display: block;
                border: outset 0.2em;
                border-radius: 50%;
                border-color: silver;
                background-color: silver;
                width: 1.4em;
                height: 1.4em;
            }
            .tcvj-toggle--on .tcvj-button {
            }
            .tcvj-toggle--off .tcvj-button {
            }
            .tcvj-value {
                padding-left: 0.5em;
                display: flex;
                align-content: center;
                flex-wrap: wrap;
            }
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
        `
    }

    doCard() {
        this._elements.card = document.createElement("ha-card");
        this._elements.card.innerHTML = `
                <div class="card-content">
                    <h1>Configuration</h1>
                    <pre>{{config}}</pre>
                    <h2>Status: </h2>
                    <div>
                        <div class="card">
                        <div class="box" id="solar">
                            <div>☀️ Solar</div>
                            <div class="state" id="solarState"></div>
                        </div>
                        <div class="box" id="pv1">
                            <div>☀️ PV1</div>
                            <div class="state" id="solarState"></div>
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
                </div>
        `;
    }

    doAttach() {
        this.append(this._elements.style, this._elements.card);
    }

    doQueryElements() {
        const card = this._elements.card;
        this._elements.error = card.querySelector(".tcvj-error")
        this._elements.dl = card.querySelector(".tcvj-dl")
        this._elements.topic = card.querySelector(".tcvj-dt")
        this._elements.toggle = card.querySelector(".tcvj-toggle")
        this._elements.value = card.querySelector(".tcvj-value")
    }

    doListen() {
        this._elements.dl.addEventListener("click", this.onClicked.bind(this), false);
    }

    doUpdateConfig() {
        if (this.getHeader()) {
            this._elements.card.setAttribute("header", this.getHeader());
        } else {
            this._elements.card.removeAttribute("header");
        }
    }

    doUpdateHass() {
        if (!this.getState()) {
            this._elements.error.textContent = `${this.getEntityID()} is unavailable.`;
            this._elements.error.classList.remove("tcvj-error--hidden");
            this._elements.dl.classList.add("tcvj-dl--hidden");
        } else {
            this._elements.error.textContent = "";
            this._elements.topic.textContent = this.getName();
            if (this.isOff()) {
                this._elements.toggle.classList.remove("tcvj-toggle--on");
                this._elements.toggle.classList.add("tcvj-toggle--off");
            } else if (this.isOn()) {
                this._elements.toggle.classList.remove("tcvj-toggle--off");
                this._elements.toggle.classList.add("tcvj-toggle--on");
            }
            this._elements.value.textContent = this.getState().state;
            this._elements.error.classList.add("tcvj-error--hidden");
            this._elements.dl.classList.remove("tcvj-dl--hidden");
        }
    }

    doToggle() {
        this._hass.callService('input_boolean', 'toggle', {
            entity_id: this.getEntityID()
        });
    }

    // configuration defaults
    static getStubConfig() {
        return { entity: "sun.sun" }
    }

}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "custom-energy-card",
    name: "CustomEnergyCard",
    description: "A custom card made by me!" // optional
});
customElements.define('custom-energy-card', CustomEnergyCard);