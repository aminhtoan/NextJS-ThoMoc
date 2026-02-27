import handleAPI from 'src/apis/handleAPI'

/**
 * Lấy danh sách cuộc trò chuyện
 */
export const listMessage = async () => {
  return await handleAPI('/message/messages/conversations/list')
}

/**
 * Đếm tổng số tin chưa đọc
 */
export const countUnread = async () => {
  return await handleAPI('/message/messages/unread/count')
}

/**
 * Gửi tin nhắn mới (REST API - backup cho WebSocket)
 */
export const createMessage = async (toUserId: number, content: string) => {
  return await handleAPI('/message', { toUserId, content }, 'post')
}

/**
 * Lấy lịch sử chat với một người
 */
export const getConversation = async (toUserId: number) => {
  return await handleAPI(`/message/messages/conversation/${toUserId}`)
}

/**
 * Lấy tất cả tin nhắn của user
 */
export const getAllMessageOfUser = async () => {
  return await handleAPI('/message/messages/all')
}

/**
 * Đánh dấu đã đọc tin nhắn từ một người (REST API - backup cho WebSocket)
 */
export const markAsRead = async (fromUserId: number) => {
  return await handleAPI(`/message/messages/read/from/${fromUserId}`, {}, 'patch')
}

/**
 * Đếm số tin chưa đọc từ một người cụ thể
 */
export const countUnreadFrom = async (fromUserId: number) => {
  return await handleAPI(`/message/messages/unread/count/from/${fromUserId}`)
}

/**
 * Xóa tin nhắn
 */
export const deleteMessage = async (messageId: number) => {
  return await handleAPI(`/message/messages/${messageId}`, {}, 'delete')
}

/**
 * Tìm kiếm tin nhắn
 */
export const searchMessages = async (searchTerm: string) => {
  return await handleAPI(`/message/messages/search?q=${encodeURIComponent(searchTerm)}`)
}
