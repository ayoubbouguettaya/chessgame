Update 06 November 2022 :It has been almost 8 month since i 'm was active developing this game.unfortently i don't have time to maintain the existing code and adding new fonctuality ,i was planning to refectore the whole code base ,introducing typescript everywhere and migrating the Backend to Nestjs 
.i was enthosiate about the project in the begining i have purshased a chessxone.com domain name and went Online.have to some with higher priority.
it sad when you drop a personal project.

# CHESSXONE
chessxone is an online multiplayer chess game , developed from scratch for the love of chess and building cool staff

![ezgif com-gif-maker(1)](https://user-images.githubusercontent.com/63568455/169714620-de25bd97-2100-49f5-9f0f-e8dd66a9df11.gif)


## about the UI UX
you can see [this illustration](https://drive.google.com/file/d/1n-9JAr8VObJbvP-bBwWYDiXLxR3egZxs/view?usp=sharing) to have an overview :

- the new user have at first authenticate,the UI shows multiple choice (email/password,continue with google or continue with facebook oauth provider), after authenticate successfully ,
- a new UI appear shows an avatar photo (provider photo or a default one) the user have to enter a user name to continue. the account is created and the user get redirected to the home page .
- in ordre to setup a game , the home page will suggest you last connected users to invite and  you can also invite a fiends from outside ,the friend has to connect first,one part share his tag id so the other can find and invite him, we have an issue if the player don't respond quickly so we add a section of Historical game so the player may have interest and not get bothered by waiting for couple of minute.noting that the game request expire after a certain time , for now it's setted up at "10 min" - as soon as the opponent accept the invitation both players get redirected to the Game and that's it. the users are supposed to connect with each others in ordre to re - match and find previous opponent .



















## about the system Design

this [illustatration](https://drive.google.com/file/d/1piTuOTnQCJMVAigSiyOQVNoRRPoj2Hbx/view?usp=sharing) shows the big view of the system, as you can see we are using two Databases (MongoDB and Redis) hosted  on the cloud and we using third party auth (Firebase Auth), the server contains some components (controllers,event handler,ect) as will we dive into details in the following sections , and the client also is represent as combaination of components

### why we are using Mongo DB and Redis:

### stateless game vs stateful game:

### no validation of moves is made in the server:

### scaling:
## technologies and implementation

## what's coming Next
