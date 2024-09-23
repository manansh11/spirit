// src/app/components/MindfulMoments.jsx
"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Feather, Moon, Sun, Menu } from 'lucide-react'

const StepItem = ({ step, index, theme, depth = 0 }) => {
  return (
    <motion.li 
      className={`flex items-start mt-${depth ? 2 : 0}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
    >
      {depth === 0 && (
        <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${theme === 'light' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-700 text-indigo-200'} flex items-center justify-center mr-2 flex-shrink-0 text-xs sm:text-sm`}>{index + 1}</span>
      )}
      <span className="text-sm sm:text-base font-light">
        {step.text}
        {step.substeps && step.substeps.length > 0 && (
          <ol className={`ml-4 mt-2 list-${depth % 2 ? 'alpha' : 'decimal'} pl-4`}>
            {step.substeps.map((substep, subindex) => (
              <StepItem key={subindex} step={substep} index={subindex} theme={theme} depth={depth + 1} />
            ))}
          </ol>
        )}
      </span>
    </motion.li>
  );
};

export default function MindfulMoments() {
  const [practices, setPractices] = useState([])
  const [openSection, setOpenSection] = useState('')
  const [theme, setTheme] = useState('light')
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mainRef = useRef(null)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const fetchPractices = async () => {
      try {
        const res = await fetch('/api/markdown/list')
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setPractices(data.practices)
      } catch (error) {
        console.error('Failed to fetch practices:', error)
      }
    }

    fetchPractices()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { current: main } = mainRef
      if (main) {
        const { left, top } = main.getBoundingClientRect()
        setCursorPosition({ x: clientX - left, y: clientY - top })
      }
    }

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div 
      ref={mainRef}
      className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-purple-100' : 'bg-gradient-to-br from-gray-900 to-purple-900'} p-4 sm:p-8 font-sans transition-colors duration-500 overflow-hidden`}
    >
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity hidden sm:block"
        animate={{
          background: `radial-gradient(600px at ${cursorPosition.x}px ${cursorPosition.y}px, ${theme === 'light' ? 'rgba(179, 136, 255, 0.15)' : 'rgba(139, 92, 246, 0.15)'}, transparent 80%)`
        }}
      />
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-between items-center mb-8 sm:mb-12">
            <h1 className={`text-3xl sm:text-5xl font-light ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-100'} tracking-wide`}>
              <span className="text-4xl sm:text-6xl mr-2">✨</span> Manansh's Practices
            </h1>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={toggleTheme} 
                className={`p-2 sm:p-3 rounded-full ${theme === 'light' ? 'bg-indigo-100 text-indigo-900' : 'bg-indigo-900 text-indigo-100'} hover:scale-110 transition-all duration-300`}
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'light' ? <Moon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun className="w-5 h-5 sm:w-6 sm:h-6" />}
              </motion.button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100 md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mb-4"
            >
              {practices.map((practice) => (
                <button
                  key={practice.id}
                  onClick={() => {
                    toggleSection(practice.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full text-left p-2 ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-100'}`}
                >
                  {practice.title}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-4 sm:space-y-8">
          {practices.map((practice, index) => (
            <motion.div
              key={practice.id}
              className={`rounded-xl overflow-hidden ${theme === 'light' ? 'bg-white bg-opacity-60 shadow-lg' : 'bg-gray-800 bg-opacity-30 shadow-2xl'} backdrop-blur-sm`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleSection(practice.id)}
                className="w-full text-left p-4 sm:p-6 focus:outline-none group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <motion.span 
                      className="text-2xl sm:text-4xl"
                      animate={{ rotate: openSection === practice.id ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {practice.icon}
                    </motion.span>
                    <h2 className={`text-xl sm:text-2xl font-light ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-200'}`}>{practice.title}</h2>
                  </div>
                  <motion.div
                    animate={{ rotate: openSection === practice.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'} transition-transform duration-300 group-hover:scale-110`} />
                  </motion.div>
                </div>
                <p className={`mt-2 text-sm sm:text-base ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'} font-light`}>{practice.description}</p>
              </button>
              <AnimatePresence>
                {openSection === practice.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                      <motion.div 
                        className={`p-3 sm:p-4 rounded-lg ${theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900 bg-opacity-30'}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h3 className={`text-base sm:text-lg font-medium mb-2 ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-200'}`}>Benefits:</h3>
                        <ul className={`list-none space-y-1 sm:space-y-2 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                          {practice.benefits.map((benefit, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                              <Feather className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-1 flex-shrink-0" />
                              <span className="text-sm sm:text-base font-light">{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <h3 className={`text-base sm:text-lg font-medium mb-2 ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-200'}`}>How to practice:</h3>
                        <ol className={`list-none space-y-1 sm:space-y-2 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                          {practice.steps.map((step, index) => (
                            <StepItem key={index} step={step} index={index} theme={theme} />
                          ))}
                        </ol>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}