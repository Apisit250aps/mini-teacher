'use client'

import React from 'react'

type UseStoredTabOptions = {
  id: string
  defaultValue: string
  allowedValues?: string[]
}

type TabStateMap = Record<string, string>

type TabStorageContextValue = {
  tabValues: TabStateMap
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
  const [tabValues, setTabValues] = React.useState<TabStateMap>({})

  const setTabValue = React.useCallback((id: string, value: string) => {
    setTabValues((prev) => {
      if (prev[id] === value) {
        return prev
      }

      return {
        ...prev,
        [id]: value,
      }
    })
  }, [])

  const contextValue = React.useMemo(
    () => ({ tabValues, setTabValue }),
    [tabValues, setTabValue],
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

  const { tabValues, setTabValue } = context
  const allowedSet = React.useMemo(
    () => (allowedValues ? new Set(allowedValues) : null),
    [allowedValues],
  )

  const currentValue = tabValues[id]

  const value = React.useMemo(() => {
    if (!currentValue) {
      return defaultValue
    }

    if (!allowedSet) {
      return currentValue
    }

    return allowedSet.has(currentValue) ? currentValue : defaultValue
  }, [allowedSet, currentValue, defaultValue])

  React.useEffect(() => {
    if (!currentValue) {
      setTabValue(id, defaultValue)
      return
    }

    if (allowedSet && !allowedSet.has(currentValue)) {
      setTabValue(id, defaultValue)
    }
  }, [allowedSet, currentValue, defaultValue, id, setTabValue])

  const onValueChange = React.useCallback(
    (nextValue: string) => {
      if (allowedSet && !allowedSet.has(nextValue)) {
        setTabValue(id, defaultValue)
        return
      }

      setTabValue(id, nextValue)
    },
    [allowedSet, defaultValue, id, setTabValue],
  )

  return {
    value,
    onValueChange,
  }
}
