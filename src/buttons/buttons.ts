import { ButtonInteraction, Client, MessageButton } from 'discord.js';
import crypto from 'node:crypto';
import { ButtonDataModel } from '../models/buttonData.js';

export class InteractionButtonData {
    public customId: string | null = null;
    public name: string;
    public label: string;
    public messageButton: MessageButton = new MessageButton();

    constructor(name: string, label: string) {
        this.name = name;
        this.label = label;
        
        this.messageButton.setLabel(this.label);
    }

    public async exec(_client: Client,_interaction: ButtonInteraction): Promise<void> {
        throw new Error("Method not implemented.");
    }
    

    public clone(): InteractionButtonData {
        const buttonData = new InteractionButtonData(this.name, this.label);
        buttonData.messageButton = this.messageButton;
        buttonData.messageButton.setCustomId(crypto.randomBytes(8).toString('hex'));
        buttonData.customId = buttonData.messageButton.customId;


        return buttonData;
    }

    public async createModel(): Promise<boolean> {
        if(this.customId) {
            await ButtonDataModel.create({
                name: this.name,
                customId: this.customId,
            });
            return true;
        }

        return false;
    }
}
