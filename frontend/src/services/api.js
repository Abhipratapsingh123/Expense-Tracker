const BASE_URL = "http://localhost:8001";

export async function sendMessage(message, userId, threadId) {

    const response = await fetch(`${BASE_URL}/chat`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            message,
            user_id: userId,
            thread_id: threadId

        })

    });

    if (!response.ok) {
        throw new Error("Failed to send message");
    }

    return await response.json();

}

export async function getHistory(threadId) {

    const response = await fetch(
        `${BASE_URL}/history/${threadId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load history");
    }

    return await response.json();
}