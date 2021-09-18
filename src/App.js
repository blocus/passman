import { useEffect, useState } from 'react'
import Passwords from './Passwords'

const os = window.require('os')
const pathModule = window.require('path')
const fs = window.require('fs')

const configFolder = pathModule.resolve(os.homedir() + '/.config/passman')
const passwordsFile = pathModule.join(configFolder, 'passwords.json')

function App() {
  const [exists, setExists] = useState(false)
  useEffect(() => {
    if (fs.existsSync(configFolder)) setExists(true)
    else {
      fs.mkdirSync(configFolder, { recursive: true })
      fs.writeFileSync(passwordsFile, '[]')
      setExists(true)
    }
  }, [])

  if (!exists) return <h1>config folder doesn't exists, creating a new one</h1>
  return <Passwords path={passwordsFile} />
}

export default App
