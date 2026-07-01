import { useState, useEffect } from "react";
import { sendMessage, getHistory } from "../services/api";

export default function useChat(userId, threadId) {

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! How can I help you today?"
        }
    ]);

    const [loading, setLoading] = useState(false);

    // Load chat history whenever the thread changes
    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getHistory(threadId);

                if (data.messages.length === 0) {

                    setMessages([
                        {
                            role: "assistant",
                            content: "Hi! How can I help you today?"
                        }
                    ]);

                } else {

                    setMessages(data.messages);

                }

            } catch (error) {

                console.error(error);

                setMessages([
                    {
                        role: "assistant",
                        content: "Hi! How can I help you today?"
                    }
                ]);

            }

        }

        loadHistory();

    }, [threadId]);

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

            console.error(error);

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong."
                }
            ]);

        } finally {

            setLoading(false);

        }

    }

    return {
        messages,
        loading,
        handleSend
    };

}