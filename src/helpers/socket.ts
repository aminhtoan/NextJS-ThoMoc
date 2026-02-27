export const generateRoom = (userId: number): string => {
  return `user:${userId}`
}

export const generateConversationRoom = (userId1: number, userId2: number): string => {
  const sortedIds = [userId1, userId2].sort((a, b) => a - b)

  return `conversation:${sortedIds[0]}-${sortedIds[1]}`
}

export const parseRoomUserId = (roomName: string): number | null => {
  const match = roomName.match(/^user:(\d+)$/)

  return match ? parseInt(match[1]) : null
}

export const isValidRoom = (roomName: string): boolean => {
  return /^user:\d+$/.test(roomName) || /^conversation:\d+-\d+$/.test(roomName)
}
