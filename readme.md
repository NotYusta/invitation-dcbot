## Invitation Discord Bot

The invitation system will simply be just a command to send an invite which sends a DM to the target user with accept and deny buttons. When any of them are pressed, the original sender of the invite will be notified of the recipient's response. Only 1 invitation may exist between the sender and recipient at any time and a configurable cooldown must be there between invites being sent.

* /pic <dog/cat> - Gets a picture of a dog or cat depending on what is specified from https://some-random-api.ml/
*/invite send <@user> - Sends an invitation to a user
* /invite cancel <@user> - Cancel an invitation that has been sent to a user

#### Sidenotes:
* Typescript based discord bot
* Uses sequelize for the data storage.
* Uses js-yaml for the configuration.

## Installation
1. Install the dependecies - Please run `npm install` if you are using npm package manager or use `yarn install` if you are using yarn package manager.
2. Copy the config.example.yaml to config.yml
3. Write in the config.yml
4. Run `node .` to start the bot!