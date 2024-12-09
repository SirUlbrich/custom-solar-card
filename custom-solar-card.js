class CustomSolarCard extends HTMLElement {
    // Initialize the card
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    // Set card configuration
    setConfig(config) {
      if (!config.title) {
        throw new Error('You need to define a title.');
      }
  
      // Save the config to use later
      this._config = config;
  
      // Call the render method to update the card
      this.render();
    }
  
    // Render the card
    render() {
      if (!this._config) {
        return;
      }
  
      // Create the card's main container
      const card = document.createElement('ha-card');
      card.header = this._config.title; // Set the title from config
  
      // Create a content section
      const content = document.createElement('div');
      content.className = 'card-content';
      content.innerHTML = `
        <p>${this._config.description || 'Custom content goes here!'}</p>
        <button id="customButton">Click Me</button>
      `;
  
      // Append content to the card
      card.appendChild(content);
  
      // Apply styles
      const style = document.createElement('style');
      style.textContent = `
        ha-card {
          padding: 16px;
          background-color: #f0f0f0;
          border-radius: 10px;
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        }
        .card-content {
          color: #333;
        }
        #customButton {
          background-color: #ff9800;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        #customButton:hover {
          background-color: #e68a00;
        }
      `;
  
      // Append the style and card to the shadow DOM
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(card);
  
      // Add event listener to the button
      this.shadowRoot.querySelector('#customButton').addEventListener('click', () => {
        alert('Button clicked!');
      });
    }
  
    // Handle Home Assistant updates
    set hass(hass) {
      // In case you want to interact with hass states
      this._hass = hass;
    }
  
    // Size of the card (for layout optimization)
    getCardSize() {
      return 2;
    }
  }
  
  // Define the custom element
customElements.define('custom-solar-card', CustomSolarCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'custom-solar-card',
    name: 'CustomSolarCard',
    preview: true,
    description: 'A custom card created in Vue 3',
});
