import { useState, useRef } from "react";
import { SendHorizontal } from "lucide-react";

function InputBar({ onSend }) {

    const [message, setMessage] = useState("");

    const textareaRef = useRef(null);

    function handleSend() {

        if (!message.trim()) return;

        onSend(message);

        setMessage("");

        textareaRef.current.style.height = "48px";

    }

    function handleChange(e) {

        setMessage(e.target.value);

        textareaRef.current.style.height = "auto";

        textareaRef.current.style.height =
            textareaRef.current.scrollHeight + "px";

    }

    return (

        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 transition-colors duration-300">

            <div className="flex items-end gap-3 max-w-5xl mx-auto">

                <textarea

                    ref={textareaRef}

                    rows={1}

                    value={message}

                    onChange={handleChange}

                    onKeyDown={(e) => {

                        if (e.key === "Enter" && !e.shiftKey) {

                            e.preventDefault();

                            handleSend();

                        }

                    }}

                    placeholder="Ask anything about your expenses..."

                    className="
                        flex-1
                        min-h-[48px]
                        max-h-40
                        overflow-y-auto
                        resize-none
                        rounded-2xl
                        border
                        border-gray-300
                        dark:border-gray-700
                        bg-white
                        dark:bg-gray-800
                        text-gray-900
                        dark:text-white
                        placeholder:text-gray-400
                        dark:placeholder:text-gray-500
                        px-5
                        py-3
                        outline-none
                        transition
                        focus:ring-2
                        focus:ring-blue-500
                    "

                />

                <button

                    onClick={handleSend}

                    disabled={!message.trim()}

                    className={`
                        p-3
                        rounded-2xl
                        transition
                        ${
                            message.trim()
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        }
                    `}

                >

                    <SendHorizontal size={20} />

                </button>

            </div>

        </div>

    );

}

export default InputBar;