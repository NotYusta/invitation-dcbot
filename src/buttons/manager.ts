import { InteractionButtonData } from "./buttons.js"
import { AcceptInviteButton } from "./invite/accept.js"
import { RejectInviteButton } from "./invite/reject.js"

const interactionButtonsData: InteractionButtonData[] = [
    RejectInviteButton,
    AcceptInviteButton
]

export const buttonManager = {
    interactionButtonsData
}