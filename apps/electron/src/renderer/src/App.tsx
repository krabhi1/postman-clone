import { shell } from 'electron'
import { env } from './configs/env.config'
import { Init } from 'shared-ui'
import 'shared-ui/css'

const { Component, router, localStore } = Init({
  env: {
    SERVER_URL: env.SERVER_URL,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: env.GOOGLE_REDIRECT_URI
  },
  mode: 'electron'
})

export default function App() {
  return (
    <>
      {/* <Component /> */}
      <Home />
    </>
  )
}

function Home() {
  return (
    <div>
      <button
        onClick={() => {
          window.api.externalOpen('http://localhost:5173/login/electron')
        }}
      >
        Login
      </button>
    </div>
  )
}
