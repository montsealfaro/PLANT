import { MESSAGES } from "../config/messages"

export const getRandomMessage = (
  type = "idle",
  stage = "happy",
  personality = "alegría"
) => {
  const personalitySet =
    MESSAGES[personality] || MESSAGES["alegría"]

  const messages = personalitySet[type] || ["..."]

  return messages[Math.floor(Math.random() * messages.length)]
}