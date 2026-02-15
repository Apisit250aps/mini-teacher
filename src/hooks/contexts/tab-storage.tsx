'use client'

import React from 'react'

type UseStoredTabOptions = {
  id: string
  defaultValue: string
  allowedValues?: string[]
}

type TabStorageContextValue = {
  getTabValue: (id: string) => string | null
  setTabValue: (id: string, value: string) => void
}

const TabStorageContext = React.createContext<TabStorageContextValue | null>(
  null,
)

export function TabStorageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const getTabValue = React.useCallback((id: string) => {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage.getItem(id)
  }, [])

  const setTabValue = React.useCallback((id: string, value: string) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(id, value)
  }, [])

  const contextValue = React.useMemo(
    () => ({ getTabValue, setTabValue }),
    [getTabValue, setTabValue],
  )

  return (
    <TabStorageContext.Provider value={contextValue}>
      {children}
    </TabStorageContext.Provider>
  )
}

export function useStoredTab({
  id,
  defaultValue,
  allowedValues,
}: UseStoredTabOptions) {
  const context = React.useContext(TabStorageContext)

  if (!context) {
    throw new Error('useStoredTab must be used within TabStorageProvider')
  }

  const { getTabValue, setTabValue } = context
  const allowedSet = React.useMemo(
    () => (allowedValues ? new Set(allowedValues) : null),
    [allowedValues],
  )

  const [value, setValue] = React.useState(defaultValue)

  React.useEffect(() => {
    const storedValue = getTabValue(id)
    if (!storedValue) {
      setTabValue(id, defaultValue)
      setValue(defaultValue)
      return
    }

    if (allowedSet && !allowedSet.has(storedValue)) {
      setTabValue(id, defaultValue)
      setValue(defaultValue)
      return
    }

    setValue(storedValue)
  }, [allowedSet, defaultValue, getTabValue, id, setTabValue])

  const onValueChange = React.useCallback(
    (nextValue: string) => {
      if (allowedSet && !allowedSet.has(nextValue)) {
        setTabValue(id, defaultValue)
        setValue(defaultValue)
        return
      }

      setTabValue(id, nextValue)
      setValue(nextValue)
    },
    [allowedSet, defaultValue, id, setTabValue],
  )

  return {
    value,
    onValueChange,
  }
}
