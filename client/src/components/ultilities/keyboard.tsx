// src/ultilities/keyboard/KeyboardDisplay.tsx
import React, { useEffect, useState } from 'react'

interface KeyboardDisplayProps {
  onKey: (token: string) => void
}

export const KeyboardDisplay: React.FC<KeyboardDisplayProps> = ({ onKey }) => {
  const [inputBuffer, setInputBuffer] = useState<string>('')

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ENTER', 'DELETE']

  const handleClick = (key: string) => {
    if (key === 'ENTER') {
      if (inputBuffer !== '') {
        onKey(inputBuffer) // send the collected number
        setInputBuffer('') // clear buffer
      }
      onKey('ENTER')
    } else if (key === 'DELETE') {
      setInputBuffer((prev) => prev.slice(0, -1))
      onKey('DELETE')
    } else {
      setInputBuffer((prev) => {
        if (prev.length < 2) {
          return prev + key
        }
        return prev // if already 2 digits, do not add more
      })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (/[0-9]/.test(key)) { // matches 0-9
        setInputBuffer((prev) => {
          if (prev.length < 2) {
            return prev + key
          }
          return prev
        })
      } else if (key === 'Enter') {
        if (inputBuffer !== '') {
          onKey(inputBuffer)
          setInputBuffer('')
        }
        onKey('ENTER')
      } else if (key === 'Backspace') {
        setInputBuffer((prev) => prev.slice(0, -1))
        onKey('DELETE')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputBuffer, onKey])

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {keys.map((key, idx) => (
        <button
          key={idx}
          onClick={() => handleClick(key)}
          className={`
            px-4 py-2 text-lg font-semibold rounded shadow
            ${key === 'DELETE' ? 'bg-red-600 hover:bg-red-700 text-white' :
              key === 'ENTER' ? 'bg-green-600 hover:bg-green-700 text-white' :
              'bg-gray-200 hover:bg-gray-300 text-gray-900'}
          `}
        >
          {key}
        </button>
      ))}
    </div>
  )
}
