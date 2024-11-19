'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCog, FaCoffee, FaRobot, FaCalculator, FaLightbulb, FaHourglassHalf } from 'react-icons/fa'
import confetti from 'canvas-confetti'

const loadingStates = [
  { icon: FaCog, text: "Calculating with quantum precision..." },
  { icon: FaRobot, text: "AI is pondering your numbers..." },
  { icon: FaCalculator, text: "Abacus warming up..." },
  { icon: FaLightbulb, text: "Eureka moment incoming..." },
  { icon: FaHourglassHalf, text: "Time is relative while we calculate..." }
]

export default function Home() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [result, setResult] = useState<number | string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [coffeeBrake, setCoffeeBreak] = useState(false)
  const [loadingState, setLoadingState] = useState(0)

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num))
    setEquation(prev => prev + num)
  }

  const handleOperationClick = (op: string) => {
    if (prevValue === null) {
      setPrevValue(parseFloat(display))
      setDisplay('0')
      setOperation(op)
      setEquation(prev => `${prev} ${op} `)
    } else {
      handleCalculate()
      setOperation(op)
    }
  }

  const getFunnyResult = () => {
    const funnyResults = [
      "potato",
      "42 (the answer to everything)",
      "π (approximately)",
      "∞ (but not quite)",
      "404 (result not found)",
      "a number (probably)",
    ]
    return funnyResults[Math.floor(Math.random() * funnyResults.length)]
  }

  const fireConfetti = useCallback(() => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1)
      }))
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1)
      }))
    }, 250)
  }, [])

  const handleCalculate = async () => {
    if (prevValue !== null && operation) {
      setLoading(true)
      setResult(null)
      setCoffeeBreak(false)

      const delay = Math.floor(Math.random() * 5000) + 3000
      for (let i = 0; i < loadingStates.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delay / loadingStates.length))
        setLoadingState(i)
      }

      if (Math.random() < 0.1) {
        setCoffeeBreak(true)
        setLoading(false)
        return
      }

      if (Math.random() < 0.2) {
        setShowQuestion(true)
        setLoading(false)
        return
      }

      let calculatedResult: number

      switch (operation) {
        case '+': calculatedResult = prevValue + parseFloat(display); break
        case '-': calculatedResult = prevValue - parseFloat(display); break
        case '*': calculatedResult = prevValue * parseFloat(display); break
        case '/': calculatedResult = prevValue / parseFloat(display); break
        default: calculatedResult = parseFloat(display)
      }

      fireConfetti()

      await new Promise(resolve => setTimeout(resolve, 2000))

      if (Math.random() < 0.2) {
        const funnyResult = getFunnyResult()
        setResult(funnyResult)
        setDisplay(funnyResult)
      } else {
        const roundedResult = Number(calculatedResult.toFixed(8))
        setResult(roundedResult)
        setDisplay(roundedResult.toString())
      }

      setEquation('')
      setPrevValue(null)
      setOperation(null)
      setLoading(false)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
    setPrevValue(null)
    setOperation(null)
    setResult(null)
  }

  useEffect(() => {
    if (showQuestion) {
      const timer = setTimeout(() => {
        setShowQuestion(false)
        handleCalculate()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showQuestion])

  const renderButton = (content: string, onClick: () => void, className: string = '') => (
    <button
      onClick={onClick}
      className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 sm:py-4 px-3 sm:px-6 rounded-full transition duration-300 text-sm sm:text-base ${className}`}
    >
      {content}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-xl max-w-[95vw] sm:max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">World&apos;s Slowest Calculator</h1>
        <div className="mb-4 bg-gray-700 p-4 rounded-2xl text-2xl font-mono h-40 flex flex-col justify-between overflow-hidden">
          <div className="text-left text-sm text-gray-400 overflow-x-auto whitespace-nowrap">{equation}</div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  {loadingStates[loadingState].icon({ className: "text-4xl text-blue-400" })}
                </motion.div>
                <p className="text-xs sm:text-sm mt-2">{loadingStates[loadingState].text}</p>
              </motion.div>
            ) : showQuestion ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-lg sm:text-xl flex items-center justify-center h-full"
              >
                Are you sure? 🤔
              </motion.div>
            ) : coffeeBrake ? (
              <motion.div
                key="coffee"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 10 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <FaCoffee className="text-3xl sm:text-4xl text-yellow-400" />
                <p className="text-xs sm:text-sm mt-2">Coffee break!</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-3xl text-right"
              >
                {display}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {renderButton('7', () => handleNumberClick('7'))}
          {renderButton('8', () => handleNumberClick('8'))}
          {renderButton('9', () => handleNumberClick('9'))}
          {renderButton('/', () => handleOperationClick('/'), 'bg-purple-600 hover:bg-purple-700')}
          {renderButton('4', () => handleNumberClick('4'))}
          {renderButton('5', () => handleNumberClick('5'))}
          {renderButton('6', () => handleNumberClick('6'))}
          {renderButton('*', () => handleOperationClick('*'), 'bg-purple-600 hover:bg-purple-700')}
          {renderButton('1', () => handleNumberClick('1'))}
          {renderButton('2', () => handleNumberClick('2'))}
          {renderButton('3', () => handleNumberClick('3'))}
          {renderButton('-', () => handleOperationClick('-'), 'bg-purple-600 hover:bg-purple-700')}
          {renderButton('0', () => handleNumberClick('0'))}
          {renderButton('.', () => handleNumberClick('.'))}
          {renderButton('=', handleCalculate, 'bg-green-600 hover:bg-green-700')}
          {renderButton('+', () => handleOperationClick('+'), 'bg-purple-600 hover:bg-purple-700')}
          {renderButton('C', handleClear, 'bg-red-600 hover:bg-red-700 col-span-4')}
        </div>
      </div>
    </div>
  )
}