import { useEffect, useState } from 'react'

const fs = window.require('fs')

function Passwords({ path }) {
  const [data, setData] = useState('')

  const readFile = path => {
    setData(() => JSON.parse(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })))
  }

  useEffect(() => {
    if (fs.existsSync(path)) {
      readFile(path)
    } else {
      fs.writeFile(path, '[]', () => readFile(path))
    }
  }, [path])

  return (
    <div className='container my-3'>
      <h2>{path}</h2>
      <code>
        <pre>{JSON.stringify(data, undefined, 2)}</pre>
      </code>
    </div>
  )
}

export default Passwords
