# postman-clone

### How to (pnpm way) _only in dev mode_

```bash
pnpm --filter=<project-name> <script-command>
pnpm --filter=backend dev


```

### How to (turbo way)

```bash
#install depecencies
pnpm install

#install turbo globally
pnpm i -g turbo

#save environment variables in .zshrc or .bashrc
alias turbo1="turbo --no-daemon"

#you can also use pnpm to run app
pnpm dev | build  --filter=project-name
# run frontend
turbo dev  --filter=frontend --no-daemon

# run backend
turbo dev2  --filter=backend --no-daemon

#for development of backend
#ctrl + shift +b -> select watch tsconfig.json of backend
turbo dev --filter=backend --no-daemon


#electron app
#try this if won't work
turbo dev --filter=electron --no-daemon
#else
pnpm dev --filter=electron
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
