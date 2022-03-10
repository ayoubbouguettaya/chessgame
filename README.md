# CHESS X ONE (DRAFT VERSION OF THE README) 
chessxone is an online multiplayer chess game , developed from scratch for the love of chess and building cool staff

![screen](https://user-images.githubusercontent.com/63568455/157675920-fdd4d78a-0003-40ac-8ed0-445d59678ad7.jpeg)

## about the UI UX
the first draft version was simple and quick ready to go ,the player entre a user name and just generate a link ,he share it with a friend via social media
,the friend enter the link, assuming that one player is waiting the game is ready to go.
after sharing this game with friends and some players who used to play chess in platforms like (chess.com and lichess.org), i recieved some good feedbacks about the 
quick setup of a game (no authentication needed) , but after seeing my Logs actually no one return after the first time ,and that lack of engagement is justified.
because i think that chess players want always to explore new opponents that's how i needed to think about a new way to matching players and connecting them ,so i did core changes as i introduced : authentication and user connections ( friend) process .to quickly have an overview the about current UI UX let's see the following illustration:

![ui_ux_illustration](https://user-images.githubusercontent.com/63568455/157717067-28e99a0c-16b3-480d-870f-fb53167d5476.jpg)

### the user journey:
the new user have at first authenticate,the UI shows multiple choice (email/password,continue with google or continue with facebook oauth provider), after authenticate successfully ,a new UI appear shows an avatar photo (provider photo or a default one) the user have to enter a user name to continue.
the account is created and the user get redirected to the home page .
in ordre to setup a game ,the user have to invite a user from suggested player UI or he can invite a friend to the application and search him by id "tag Id : 7 characters",the game request expire after a certain time "10 min" ,as soon as the opponent accept the invitation both players get redirected to the Game and that's it. the users are supposed to connect with each others in ordre to re - match and find previous opponent .     

### Layout and font: 
- i think that the dark theme is suited for a gaming application ,so i sticked with the my fav color palette Eigengrau color with steel-blue `(#16161d | #4682b4)` 
- i used a kind of border in 2 opposite corner of some Layout {card button group-of-button label } to emphasize that content or CTA  but also to demarcate the design.
- most icons are uploaded from  [feathericons](https://feathericons.com/)  open source.
- chess set icon 'gioco' uploaded from an open source project [lichess.org](https://github.com/lichess-org/lila/tree/master/public/piece/gioco)
-  i search for fonts similaire to `minecraft` but more readable and `karma suture` was just perfect. 

## about the system Design

## about the technologies and the implementation

## what's coming Next

