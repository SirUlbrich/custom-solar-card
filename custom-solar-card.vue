<template>
    <ha-card style="padding:1em;">
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
    </ha-card>
</template>

<script>
export default {
  props: {
    config: Object,
    hass: Object  // To access the Home Assistant object and its states
  },
  data() {
    return {
      solarState: 'Unknown',  // Default value for solar state
      pv1State: 'Unknown',
      consumptionState: 'Unknown'
    };
  },
  mounted() {
    // Fetch the state of the Home Assistant sensor when the component mounts
    this.updateSolarState();

    /*/ Optionally, set up a watcher for changes to Home Assistant states
    this.$watch('hass.states', () => {
      this.updateSolarState();
    });*/
  },
  methods: {
    updateStates() {
      if (this.hass) {
        // Fetch and set the state for the sensors based on passed config
        this.solarState = this.hass.states[this.config.sensors.solar] ? this.hass.states[this.config.sensors.solar].state : 'Unavailable';
        this.pv1State = this.hass.states[this.config.sensors.pv1] ? this.hass.states[this.config.sensors.pv1].state : 'Unavailable';
        this.consumptionState = this.hass.states[this.config.sensors.consumption] ? this.hass.states[this.config.sensors.consumption].state : 'Unavailable';
      }
    }
  }
};
</script>