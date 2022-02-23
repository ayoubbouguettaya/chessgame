# chessxone shared code Repository

this repository has been created to contain all the shared functions and constants between chessxone projects ie web-frontEnd , backend , and possibly in near future React Native App

## How it's Work

since i'm using monolithic repository for my Projects ,it was easy for me to take an easy 
solution which is to link this shared-lib for each project that use it ,and this trick is possible with the power of `npm link`, no need to publish the repository since all the projects are in the same repository, and for the moment i'm Solo developer 

### Exemple

`cd ./chessxone-front && npm link ../chessxone-shared`
and that's it , now you can use it simply By

`import {whateverTheFunctionIs} from 'chessxone-shared'`

