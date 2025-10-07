// Message template system for consistent messaging across channels
import { Message, MessageChannel } from '../adapters/messageAdapters.js';

export interface MessageTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  channels: MessageChannel[];
  variables: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface TemplateVariables {
  [key: string]: string | number | boolean;
}

export class MessageTemplateService {
  private templates: Map<string, MessageTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    // Event notification template
    this.addTemplate({
      id: 'event_notification',
      name: 'Event Notification',
      subject: 'New Event: {{eventTitle}}',
      content: `🎉 New Event Available!

**{{eventTitle}}**
{{eventDescription}}

📅 Date: {{eventDate}}
📍 Location: {{eventLocation}}
👤 Organizer: {{organizerName}}

{{joinLink}}

Best regards,
The Linea Team`,
      channels: [
        MessageChannel.EMAIL,
        MessageChannel.TELEGRAM,
        MessageChannel.WHATSAPP,
      ],
      variables: [
        'eventTitle',
        'eventDescription',
        'eventDate',
        'eventLocation',
        'organizerName',
        'joinLink',
      ],
      priority: 'normal',
    });

    // Waitlist confirmation template
    this.addTemplate({
      id: 'waitlist_confirmation',
      name: 'Waitlist Confirmation',
      subject: "You're on the waitlist for {{eventTitle}}",
      content: `✅ You're on the waitlist!

**{{eventTitle}}**
{{eventDescription}}

📅 Date: {{eventDate}}
📍 Location: {{eventLocation}}

We'll notify you when a spot becomes available.

Best regards,
The Linea Team`,
      channels: [MessageChannel.EMAIL, MessageChannel.WHATSAPP],
      variables: [
        'eventTitle',
        'eventDescription',
        'eventDate',
        'eventLocation',
      ],
      priority: 'normal',
    });

    // Event reminder template
    this.addTemplate({
      id: 'event_reminder',
      name: 'Event Reminder',
      subject: 'Reminder: {{eventTitle}} tomorrow',
      content: `⏰ Event Reminder!

**{{eventTitle}}** is tomorrow!

📅 Date: {{eventDate}}
📍 Location: {{eventLocation}}
⏰ Time: {{eventTime}}

{{joinLink}}

See you there!
The Linea Team`,
      channels: [
        MessageChannel.EMAIL,
        MessageChannel.TELEGRAM,
        MessageChannel.WHATSAPP,
        MessageChannel.SMS,
      ],
      variables: [
        'eventTitle',
        'eventDate',
        'eventLocation',
        'eventTime',
        'joinLink',
      ],
      priority: 'high',
    });

    // Magic link template
    this.addTemplate({
      id: 'magic_link',
      name: 'Magic Link Authentication',
      subject: 'Your login link for Linea',
      content: `🔐 Your login link

Click the link below to sign in to Linea:

{{magicLink}}

This link will expire in 15 minutes.

If you didn't request this link, please ignore this message.

Best regards,
The Linea Team`,
      channels: [MessageChannel.EMAIL],
      variables: ['magicLink'],
      priority: 'high',
    });

    // Owner invitation template
    this.addTemplate({
      id: 'owner_invitation',
      name: 'Owner Invitation',
      subject: "You're invited to join Linea as an event organizer",
      content: `🎉 You're invited to join Linea!

As an event organizer, you can:
• Create and manage events
• Build your community
• Track waitlists and attendees

Get started: {{invitationLink}}

Best regards,
The Linea Team`,
      channels: [MessageChannel.EMAIL, MessageChannel.WHATSAPP],
      variables: ['invitationLink'],
      priority: 'normal',
    });

    // System alert template
    this.addTemplate({
      id: 'system_alert',
      name: 'System Alert',
      subject: 'System Alert: {{alertType}}',
      content: `🚨 System Alert

**{{alertType}}**
{{alertMessage}}

Time: {{timestamp}}
Severity: {{severity}}

{{actionRequired}}

Best regards,
The Linea Team`,
      channels: [MessageChannel.EMAIL, MessageChannel.TELEGRAM],
      variables: [
        'alertType',
        'alertMessage',
        'timestamp',
        'severity',
        'actionRequired',
      ],
      priority: 'urgent',
    });
  }

  addTemplate(template: MessageTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): MessageTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): MessageTemplate[] {
    return Array.from(this.templates.values());
  }

  renderTemplate(
    templateId: string,
    variables: TemplateVariables,
    channel: MessageChannel
  ): Message | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    if (!template.channels.includes(channel)) {
      throw new Error(
        `Template ${templateId} not supported for channel ${channel}`
      );
    }

    // Check if all required variables are provided
    const missingVariables = template.variables.filter(
      variable => !(variable in variables)
    );
    if (missingVariables.length > 0) {
      throw new Error(
        `Missing required variables: ${missingVariables.join(', ')}`
      );
    }

    // Render content for specific channel
    const content = this.renderContent(template.content, variables, channel);
    const subject = template.subject
      ? this.renderContent(template.subject, variables, channel)
      : undefined;

    return {
      to: variables.to as string,
      content,
      subject: subject || '',
      channel,
      priority: template.priority as any,
      metadata: {
        templateId,
        renderedAt: new Date().toISOString(),
      },
    };
  }

  private renderContent(
    content: string,
    variables: TemplateVariables,
    channel: MessageChannel
  ): string {
    let rendered = content;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Channel-specific formatting
    switch (channel) {
      case MessageChannel.TELEGRAM:
        // Convert markdown to HTML for Telegram
        rendered = this.formatForTelegram(rendered);
        break;
      case MessageChannel.WHATSAPP:
        // Format for WhatsApp
        rendered = this.formatForWhatsApp(rendered);
        break;
      case MessageChannel.SMS:
        // Format for SMS (remove formatting, limit length)
        rendered = this.formatForSMS(rendered);
        break;
      case MessageChannel.EMAIL:
        // Keep as is for email
        break;
    }

    return rendered;
  }

  private formatForTelegram(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '\n');
  }

  private formatForWhatsApp(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '*$1*')
      .replace(/\*(.*?)\*/g, '_$1_')
      .replace(/`(.*?)`/g, '```$1```');
  }

  private formatForSMS(content: string): string {
    // Remove all formatting and limit length
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\n\n+/g, '\n')
      .trim();

    // Limit to SMS length (160 characters for single SMS)
    if (formatted.length > 160) {
      formatted = formatted.substring(0, 157) + '...';
    }

    return formatted;
  }

  createCustomTemplate(
    id: string,
    name: string,
    content: string,
    channels: MessageChannel[],
    variables: string[],
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal',
    subject?: string
  ): MessageTemplate {
    const template: MessageTemplate = {
      id,
      name,
      content,
      channels,
      variables,
      priority,
      subject: subject || '',
    };

    this.addTemplate(template);
    return template;
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  getTemplatesByChannel(channel: MessageChannel): MessageTemplate[] {
    return this.getAllTemplates().filter(template =>
      template.channels.includes(channel)
    );
  }
}
