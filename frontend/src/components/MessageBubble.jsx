function MessageBubble({
    message
}) {

    const isUser = message.role === "user";

    return (

        <div
            className={`flex mb-4 ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            <div
                className={`
                    max-w-xl
                    rounded-xl
                    px-4
                    py-3

                    ${
                        isUser
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                    }
                `}
            >

                {message.content}

            </div>

        </div>

    );

}

export default MessageBubble;