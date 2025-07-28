"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, ShoppingCart, Trash2, Plus, Search, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  category: string
  addedAt: Date
  completed: boolean
}

interface Suggestion {
  name: string
  category: string
  reason: string
}

const CATEGORIES = {
  dairy: "🥛 Dairy",
  produce: "🥬 Produce",
  meat: "🥩 Meat & Seafood",
  pantry: "🥫 Pantry",
  snacks: "🍿 Snacks",
  beverages: "🥤 Beverages",
  frozen: "🧊 Frozen",
  bakery: "🍞 Bakery",
  household: "🧽 Household",
  personal: "🧴 Personal Care",
  other: "📦 Other",
}

const COMMON_ITEMS = {
  // Dairy
  milk: "dairy",
  cheese: "dairy",
  yogurt: "dairy",
  butter: "dairy",
  cream: "dairy",
  sour_cream: "dairy",
  cottage_cheese: "dairy",
  mozzarella: "dairy",
  cheddar: "dairy",
  parmesan: "dairy",
  eggs: "dairy",

  // Produce
  apples: "produce",
  bananas: "produce",
  tomatoes: "produce",
  onions: "produce",
  potatoes: "produce",
  carrots: "produce",
  lettuce: "produce",
  spinach: "produce",
  broccoli: "produce",
  bell_peppers: "produce",
  cucumbers: "produce",
  garlic: "produce",
  ginger: "produce",
  lemons: "produce",
  limes: "produce",
  oranges: "produce",
  strawberries: "produce",
  grapes: "produce",
  avocados: "produce",
  mushrooms: "produce",

  // Meat & Seafood
  chicken: "meat",
  beef: "meat",
  pork: "meat",
  fish: "meat",
  salmon: "meat",
  tuna: "meat",
  shrimp: "meat",
  ground_beef: "meat",
  chicken_breast: "meat",
  bacon: "meat",
  ham: "meat",
  turkey: "meat",

  // Pantry (Significantly Expanded)
  rice: "pantry",
  pasta: "pantry",
  bread: "bakery",
  flour: "pantry",
  sugar: "pantry",
  brown_sugar: "pantry",
  salt: "pantry",
  black_pepper: "pantry",
  olive_oil: "pantry",
  vegetable_oil: "pantry",
  coconut_oil: "pantry",
  vinegar: "pantry",
  balsamic_vinegar: "pantry",
  soy_sauce: "pantry",
  hot_sauce: "pantry",
  ketchup: "pantry",
  mustard: "pantry",
  mayonnaise: "pantry",
  honey: "pantry",
  maple_syrup: "pantry",
  vanilla_extract: "pantry",
  baking_powder: "pantry",
  baking_soda: "pantry",
  yeast: "pantry",

  // Canned Goods
  canned_tomatoes: "pantry",
  tomato_sauce: "pantry",
  tomato_paste: "pantry",
  canned_beans: "pantry",
  black_beans: "pantry",
  kidney_beans: "pantry",
  chickpeas: "pantry",
  lentils: "pantry",
  canned_corn: "pantry",
  canned_tuna: "pantry",
  chicken_broth: "pantry",
  vegetable_broth: "pantry",
  beef_broth: "pantry",
  coconut_milk: "pantry",

  // Grains & Cereals
  oats: "pantry",
  quinoa: "pantry",
  barley: "pantry",
  brown_rice: "pantry",
  white_rice: "pantry",
  wild_rice: "pantry",
  couscous: "pantry",
  bulgur: "pantry",
  cereal: "pantry",
  granola: "pantry",
  oatmeal: "pantry",

  // Pasta & Noodles
  spaghetti: "pantry",
  penne: "pantry",
  macaroni: "pantry",
  linguine: "pantry",
  fettuccine: "pantry",
  lasagna_noodles: "pantry",
  ramen_noodles: "pantry",
  egg_noodles: "pantry",

  // Spices & Seasonings
  garlic_powder: "pantry",
  onion_powder: "pantry",
  paprika: "pantry",
  cumin: "pantry",
  chili_powder: "pantry",
  oregano: "pantry",
  basil: "pantry",
  thyme: "pantry",
  rosemary: "pantry",
  cinnamon: "pantry",
  nutmeg: "pantry",
  ginger_powder: "pantry",
  turmeric: "pantry",
  curry_powder: "pantry",
  italian_seasoning: "pantry",
  bay_leaves: "pantry",
  red_pepper_flakes: "pantry",

  // Nuts & Seeds
  almonds: "pantry",
  walnuts: "pantry",
  peanuts: "pantry",
  cashews: "pantry",
  pecans: "pantry",
  sunflower_seeds: "pantry",
  pumpkin_seeds: "pantry",
  chia_seeds: "pantry",
  flax_seeds: "pantry",
  sesame_seeds: "pantry",

  // Dried Fruits & Snacks
  raisins: "pantry",
  dates: "pantry",
  dried_cranberries: "pantry",
  dried_apricots: "pantry",
  peanut_butter: "pantry",
  almond_butter: "pantry",
  jam: "pantry",
  jelly: "pantry",

  // Baking Essentials
  cocoa_powder: "pantry",
  chocolate_chips: "pantry",
  powdered_sugar: "pantry",
  cornstarch: "pantry",
  cream_of_tartar: "pantry",
  food_coloring: "pantry",

  // International & Specialty
  coconut_flakes: "pantry",
  tahini: "pantry",
  miso_paste: "pantry",
  fish_sauce: "pantry",
  worcestershire_sauce: "pantry",
  sriracha: "pantry",
  sesame_oil: "pantry",
  rice_vinegar: "pantry",

  // Beverages
  water: "beverages",
  juice: "beverages",
  coffee: "beverages",
  tea: "beverages",
  soda: "beverages",
  beer: "beverages",
  wine: "beverages",
  sparkling_water: "beverages",
  energy_drinks: "beverages",

  // Snacks
  chips: "snacks",
  cookies: "snacks",
  crackers: "snacks",
  pretzels: "snacks",
  popcorn: "snacks",
  granola_bars: "snacks",
  trail_mix: "snacks",

  // Frozen
  ice_cream: "frozen",
  pizza: "frozen",
  frozen_vegetables: "frozen",
  frozen_berries: "frozen",
  frozen_chicken: "frozen",
  frozen_fish: "frozen",
  ice_cubes: "frozen",

  // Household
  soap: "household",
  detergent: "household",
  paper_towels: "household",
  toilet_paper: "household",
  dish_soap: "household",
  sponges: "household",
  trash_bags: "household",
  aluminum_foil: "household",
  plastic_wrap: "household",

  // Personal Care
  shampoo: "personal",
  conditioner: "personal",
  toothpaste: "personal",
  toothbrush: "personal",
  deodorant: "personal",
  body_wash: "personal",
  lotion: "personal",
  sunscreen: "personal",
}

export default function VoiceShoppingAssistant() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [lastCommand, setLastCommand] = useState("")
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex
          const transcript = event.results[current][0].transcript
          setTranscript(transcript)

          if (event.results[current].isFinal) {
            processVoiceCommand(transcript)
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          setTranscript("")
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          setTranscript("")
        }
      }

      // Speech Synthesis
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }

      // Load saved items
      const savedItems = localStorage.getItem("shoppingItems")
      if (savedItems) {
        setItems(JSON.parse(savedItems))
      }

      // Generate initial suggestions
      generateSuggestions([])
    }
  }, [])

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem("shoppingItems", JSON.stringify(items))
    generateSuggestions(items)
  }, [items])

  const speak = (text: string) => {
    if (speechEnabled && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      synthRef.current.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const categorizeItem = (itemName: string): string => {
    const lowerName = itemName.toLowerCase().replace(/\s+/g, "_")
    return COMMON_ITEMS[lowerName as keyof typeof COMMON_ITEMS] || "other"
  }

  const extractQuantityAndItem = (text: string): { quantity: number; item: string } => {
    const quantityMatch = text.match(/(\d+)\s+(.+)/)
    if (quantityMatch) {
      return {
        quantity: Number.parseInt(quantityMatch[1]),
        item: quantityMatch[2],
      }
    }
    return { quantity: 1, item: text }
  }

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim()
    setLastCommand(command)

    // Add item commands
    if (
      lowerCommand.includes("add") ||
      lowerCommand.includes("buy") ||
      lowerCommand.includes("need") ||
      lowerCommand.includes("want")
    ) {
      const itemText = lowerCommand
        .replace(/^(add|buy|i need|i want|get me|purchase)\s*/i, "")
        .replace(/\s*(to my list|to the list|please)$/i, "")
        .trim()

      if (itemText) {
        const { quantity, item } = extractQuantityAndItem(itemText)
        addItem(item, quantity)
        speak(`Added ${quantity > 1 ? quantity + " " : ""}${item} to your shopping list`)
      }
    }
    // Remove item commands
    else if (lowerCommand.includes("remove") || lowerCommand.includes("delete")) {
      const itemText = lowerCommand
        .replace(/^(remove|delete)\s*/i, "")
        .replace(/\s*(from my list|from the list)$/i, "")
        .trim()

      if (itemText) {
        removeItemByName(itemText)
        speak(`Removed ${itemText} from your shopping list`)
      }
    }
    // Search commands
    else if (lowerCommand.includes("search") || lowerCommand.includes("find")) {
      const searchText = lowerCommand.replace(/^(search for|find|look for)\s*/i, "").trim()

      if (searchText) {
        setSearchQuery(searchText)
        setIsSearching(true)
        speak(`Searching for ${searchText}`)
      }
    }
    // Clear list command
    else if (lowerCommand.includes("clear") && lowerCommand.includes("list")) {
      clearList()
      speak("Shopping list cleared")
    }
    // Show suggestions
    else if (lowerCommand.includes("suggest") || lowerCommand.includes("recommend")) {
      if (suggestions.length > 0) {
        speak(`I suggest adding ${suggestions[0].name}. ${suggestions[0].reason}`)
      } else {
        speak("No suggestions available right now")
      }
    } else {
      speak("I didn't understand that command. Try saying 'add milk' or 'remove bread'")
    }
  }

  const addItem = (name: string, quantity = 1) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity,
      category: categorizeItem(name),
      addedAt: new Date(),
      completed: false,
    }

    setItems((prev) => [...prev, newItem])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const removeItemByName = (name: string) => {
    const lowerName = name.toLowerCase()
    setItems((prev) => prev.filter((item) => !item.name.toLowerCase().includes(lowerName)))
  }

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const clearList = () => {
    setItems([])
  }

  const generateSuggestions = (currentItems: ShoppingItem[]) => {
    const currentItemNames = currentItems.map((item) => item.name.toLowerCase().replace(/\s+/g, "_"))
    const newSuggestions: Suggestion[] = []

    // Essential pantry staples
    const pantryStaples = [
      "rice",
      "pasta",
      "olive_oil",
      "salt",
      "black_pepper",
      "garlic_powder",
      "onion_powder",
      "flour",
      "sugar",
      "canned_tomatoes",
      "chicken_broth",
      "soy_sauce",
      "honey",
      "oats",
      "peanut_butter",
      "canned_beans",
    ]

    // Basic household essentials
    const essentials = ["milk", "bread", "eggs", "bananas", "onions", "garlic"]

    // Combine all staples
    const allStaples = [...pantryStaples, ...essentials]

    allStaples.forEach((staple) => {
      if (!currentItemNames.some((name) => name.includes(staple))) {
        newSuggestions.push({
          name: staple.replace(/_/g, " "),
          category: categorizeItem(staple),
          reason: pantryStaples.includes(staple) ? "Pantry essential" : "Household staple",
        })
      }
    })

    // Seasonal suggestions (simplified)
    const seasonalItems = ["apples", "oranges", "soup", "hot_chocolate", "cinnamon", "nutmeg"]
    seasonalItems.forEach((item) => {
      if (!currentItemNames.some((name) => name.includes(item)) && Math.random() > 0.7) {
        newSuggestions.push({
          name: item,
          category: categorizeItem(item),
          reason: "Seasonal recommendation",
        })
      }
    })

    // Cooking essentials based on what's already in the list
    if (
      currentItemNames.some((name) => name.includes("pasta")) &&
      !currentItemNames.some((name) => name.includes("tomato"))
    ) {
      newSuggestions.push({
        name: "tomato sauce",
        category: "pantry",
        reason: "Great with pasta",
      })
    }

    if (
      currentItemNames.some((name) => name.includes("rice")) &&
      !currentItemNames.some((name) => name.includes("soy"))
    ) {
      newSuggestions.push({
        name: "soy sauce",
        category: "pantry",
        reason: "Perfect for rice dishes",
      })
    }

    setSuggestions(newSuggestions.slice(0, 4))
  }

  const addSuggestion = (suggestion: Suggestion) => {
    addItem(suggestion.name)
    speak(`Added ${suggestion.name} to your list`)
  }

  const groupedItems = items.reduce(
    (groups, item) => {
      const category = item.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
      return groups
    },
    {} as Record<string, ShoppingItem[]>,
  )

  const filteredItems = searchQuery
    ? items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            Voice Shopping Assistant
          </h1>
          <p className="text-gray-600">Add items to your shopping list using voice commands</p>
        </div>

        {/* Voice Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Voice Commands
              <Button variant="outline" size="sm" onClick={() => setSpeechEnabled(!speechEnabled)}>
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className={`rounded-full w-20 h-20 ${
                  isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
            </div>

            {isListening && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Listening...</p>
                {transcript && <p className="text-lg font-medium text-blue-600">"{transcript}"</p>}
              </div>
            )}

            {lastCommand && !isListening && (
              <Alert>
                <AlertDescription>Last command: "{lastCommand}"</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Try saying:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>"Add milk to my list"</li>
                <li>"I need 3 apples"</li>
                <li>"Remove bread"</li>
                <li>"Search for organic tomatoes"</li>
                <li>"Clear my list"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search your shopping list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Smart Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{suggestion.name}</p>
                      <p className="text-sm text-gray-600">{suggestion.reason}</p>
                    </div>
                    <Button size="sm" onClick={() => addSuggestion(suggestion)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shopping List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Shopping List ({items.length} items)
              {items.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearList}>
                  Clear All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Your shopping list is empty. Use voice commands to add items!
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      {CATEGORIES[category as keyof typeof CATEGORIES]}
                      <Badge variant="secondary">{categoryItems.length}</Badge>
                    </h3>
                    <div className="grid gap-2">
                      {categoryItems
                        .filter((item) => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              item.completed ? "bg-gray-50 text-gray-500 line-through" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleItem(item.id)}
                                className="rounded"
                              />
                              <div>
                                <p className="font-medium">
                                  {item.quantity > 1 && `${item.quantity}x `}
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">Added {item.addedAt.toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                    {category !== Object.keys(groupedItems)[Object.keys(groupedItems).length - 1] && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{items.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{items.filter((item) => item.completed).length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{Object.keys(groupedItems).length}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
