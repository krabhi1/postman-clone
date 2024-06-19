
# Tasks
flow = routes => services => database
### Database
#### User 
- [ ]  create 
- [ ]  update by email or id
- [ ]  delete by email or id
- [ ]  get by email or id if missing return all

#### Workspace
- [ ]  create 
- [ ]  update by id
- [ ]  delete by id
- [ ]  get by id if missing return all

----------
### Routes
api/v1/

#### User 
- [x]  POST user/google/signin
- [x]  POST user/refresh/access_token
- [x]  GET profile
- [ ]  PUT profile
- [ ]  DELETE user

#### Workspace
- [x]  POST workspace/
- [ ]  PUT workspace/:id
- [x]  DELETE workspace/:id
- [ ]  GET workspace/:id
- [x]  GET workspace/  
**users**
- [ ]  GET workspace/:id/sharedUsers #not needed
- [ ]  POST workspace/:id/sharedUsers
- [ ]  DELETE workspace/:id/sharedUsers/:userId
- [ ]  PUT  workspace/:id/sharedUsers/:userId

#### liveblocks
- [x]  POST liveblocks/auth

----------
### Services

#### User
- [x]  handleGoogleSignInFromCode
- [x]  handleRefreshAccessToken
- [ ]  handleGetUser
- [ ]  handleUpdateUser
- [ ]  handleDeleteUser

#### Workspace
- [ ]  create
- [ ]  update
- [ ]  delete
- [ ]  get by id
- [ ]  get all

----------
### liveblocks

- [ ]  auth
- [ ]  create room
- [ ]  delete room
- [ ]  get room by id
- [ ]  get all rooms
- [ ]  update add user to room
- [ ]  remove user from room
- [ ]  get all users in room


### Others

#### api caller
- [x]  apiCall
- [ ] googleAutoAuthApiCall

#### google
- [x] getGoogleTokens 
- [x] getGoogleAccessToken
- [x] getGoogleProfile

#### jwt
- [x]  generateJWT
- [x]  verifyJWT
**user**
- [x]  generateUserSignInToken
- [x]  verifyUserSignInToken