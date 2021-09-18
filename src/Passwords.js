import { useEffect, useState } from 'react'
import { CopyIcon, EditIcon, TrashIcon } from './Icons'

const fs = window.require('fs')
const shell = window.require('electron').shell

function ExternalLink({ link = '', username }) {
  const domain = link.replace(/http.:\/\//i, '')

  if (link.match(/^http/))
    return (
      <div>
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}`}
          className='me-3'
          width='16'
          height='16'
          alt={domain}
        />
        <a
          onClick={event => {
            event.preventDefault()
            shell.openExternal(link)
          }}
          className='me-1'
          href={link}>
          {domain}
        </a>
        ({username})
      </div>
    )
  return link
}

function PasswordCard({ item }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    setCopied(true)
    navigator.clipboard.writeText(item.password)
    setTimeout(() => setCopied(false), 5000)
  }

  return (
    <div className='border-bottom card-header d-flex align-items-center justify-content-between'>
      <div>
        <ExternalLink link={item.address} username={item.user} />
      </div>
      <div>
        {copied && <span className='text-success me-3'>Copied !</span>}
        <div className='btn-group' role='group'>
          <button className='btn btn-sm btn-primary' onClick={copy}>
            <CopyIcon />
          </button>
          <button className='btn btn-sm btn-dark'>
            <EditIcon />
          </button>
          <button className='btn btn-sm btn-danger'>
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function Filters({ categories }) {
  return categories.map(category => (
    <div key={category} className='form-check form-check-inline'>
      <label>
        <input className='form-check-input' type='checkbox' value={category} />
        {category}
      </label>
    </div>
  ))
}

function Passwords({ path }) {
  const [data, setData] = useState([])

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

  const categories = [...new Set(data.map(item => (item.type ? item.type : 'Other')))]

  return (
    <div className='container my-3'>
      <Filters categories={categories} />
      <div className='card border-bottom-0 my-3'>
        {data.map((item, key) => (
          <PasswordCard key={item.address + key} item={item} />
        ))}
      </div>
    </div>
  )
}

export default Passwords
