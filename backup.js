import { createApp} from 'vue';
import CustomSolarCard from './custom-solar-card.vue';
import './custom-solar-card.css';
import CustomSolarCard from './custom-solar-card.vue';

customElements.define('custom-solar-card', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
        this.config = config;
        const root = this.shadowRoot;

        while (root.lastChild) {
            root.removeChild(root.lastChild);
        }

        const cardContainer = document.createElement('div');
        root.appendChild(cardContainer);

        const app = createApp(CustomSolarCard, { config });

        app.mount(cardContainer);
    }

    getCardSize() {
        return 3;
    }

});

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'custom-solar-card',
    name: 'CustomSolarCard',
    preview: true,
    description: 'A custom card created in Vue 3',
});
