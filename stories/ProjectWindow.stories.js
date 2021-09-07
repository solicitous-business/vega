import ProjectWindow from "~/components/ProjectWindow.vue";

export default {
  title: "ProjectWindow",
  component: ProjectWindow,
  argTypes: {},
};

export const Template = (_, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ProjectWindow },
  template: `
<ProjectWindow/>
`,
});
