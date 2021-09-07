import VegaSelect from "../components/vega/VegaSelect.vue";

export default {
  title: "VegaSelect",
  component: VegaSelect,
  argTypes: {
    onChange: { action: "changed" },
  },
  args: {
    value: 1,
    items: [
      {
        text: "Item1",
        value: 1,
      },
      {
        text: "Item2",
        value: 2,
      },
    ],
  },
};

export const Template = (_, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VegaSelect },
  template: `
<VegaSelect :items="items" :value="value" @change="onChange">Button</VegaSelect>
`,
});
