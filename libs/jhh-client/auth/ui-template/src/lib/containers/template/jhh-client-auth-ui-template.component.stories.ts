import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';

import { JhhClientAuthUiTemplateComponent } from './jhh-client-auth-ui-template.component';
import { JhhStorybookAuthContainerComponent } from '@jhh/jhh-client/storybook-host';

export default {
  title: 'Views/Auth/Components/Template',
  component: JhhClientAuthUiTemplateComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule,
        HttpClientModule,
        JhhClientAuthUiTemplateComponent,
        JhhStorybookAuthContainerComponent,
      ],
      providers: [MatIconRegistry],
    }),
  ],
  argTypes: {
    heading: { control: 'text' },
  },
} as Meta;

const Template: Story<JhhClientAuthUiTemplateComponent> = (
  args: JhhClientAuthUiTemplateComponent
) => ({
  component: JhhClientAuthUiTemplateComponent,
  props: args,
  template: `
    <jhh-storybook-auth-container>
       <jhh-auth-ui-template [heading]="heading"></jhh-auth-ui-template>
    </jhh-storybook-auth-container>
  `,
});

export const Default = Template.bind({});
Default.args = {
  heading: 'Register',
};
