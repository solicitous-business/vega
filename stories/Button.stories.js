import VegaButton from "../components/vega/VegaButton.vue";

export default {
  title: "VegaButton",
  component: VegaButton,
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export const Template = (_, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { VegaButton },
  template: `
<VegaButton @click="onClick">Button</VegaButton>
`,
});
