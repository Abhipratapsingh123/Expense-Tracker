import { useState } from "react";

function InputBar({
    onSend
}) {

    const [message, setMessage] = useState("");

    function handleSend() {

        if (!message.trim()) return;

        onSend(message);

        setMessage("");

    }

    return (

        <div className="border-t p-4 flex gap-3 bg-white">

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {

                    if (e.key === "Enter")
                        handleSend();

                }}
                placeholder="Ask anything..."
                className="flex-1 border rounded-lg px-4 py-2"
            />

            <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-6 rounded-lg"
            >
                Send
            </button>

        </div>

    );

}

export default InputBar;