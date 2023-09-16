import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardShellComponent } from './jhh-client-dashboard-shell.component';

const meta: Meta<JhhClientDashboardShellComponent> = {
  title: 'Views/Dashboard/Shell',
  component: JhhClientDashboardShellComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
};
export default meta;
type Story = StoryObj<JhhClientDashboardShellComponent>;

export const Primary: Story = {};
