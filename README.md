# postman-clone

### Command
```bash
#run command
pnpm --filter <package-name> <command>

#add shared-ui package to vite-app
pnpm add shared-ui  --filter vite-app --workspace

#-------turbo--------
#new project
pnpx create-turbo@latest
#
turbo <command> filter=name

#set ui="stream" in turbo.json
```