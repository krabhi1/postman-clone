# postman-clone
this is a clone of postman app, made with electron, react, and express.
it is a project for learning purpose.

### How to 
```bash
#install depecencies
pnpm install

#install turbo globally
pnpm i -g turbo

#save environment variables in .zshrc or .bashrc
alias turbo1="turbo --no-daemon"

# run frontend
turbo1 dev  --filter=frontend 

# run backend
turbo1 dev  --filter=backend 

#shortcut
turbo1 dev -F <project_name>


#install dependencies using pnpm
pnpm -F <project_name> <command>
pnpm -F frontend i nanoid




```

### Command

```bash
#run command
pnpm --filter <package-name> <command>

#add shared-ui package to vite-app
pnpm add shared-ui  --filter vite-app --workspace

#-------turbo--------
turbo --no-daemon <command>
turbo daemon status
#new project
pnpx create-turbo@latest
#
turbo <command> --filter=name

#set ui="stream" in turbo.json
```
