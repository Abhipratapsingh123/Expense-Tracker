import { useState } from "react";
import { sendMessage } from "../services/api";

export default function useChat(userId, threadId) {

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! How can I help you today?"
        }
    ]);

    const [loading, setLoading] = useState(false);

    async function handleSend(userMessage) {

        if (!userMessage.trim()) return;

        const userMsg = {
            role: "user",
            content: userMessage
        };

        setMessages(prev => [...prev, userMsg]);

        setLoading(true);

        try {

            const response = await sendMessage(
                userMessage,
                userId,
                threadId
            );

            const assistantMsg = {
                role: "assistant",
                content: response.response
            };

            setMessages(prev => [
                ...prev,
                assistantMsg
            ]);

        } catch (error) {

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong."
                }
            ]);

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    return {
        messages,
        loading,
        handleSend,
        setMessages
    };

}