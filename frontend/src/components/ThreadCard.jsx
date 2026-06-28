function ThreadCard({
    thread,
    active,
    onClick
}) {

    return (

        <div
            onClick={onClick}
            className={`
                cursor-pointer
                px-4
                py-3
                border-b
                border-gray-800
                hover:bg-gray-800

                ${active ? "bg-gray-800" : ""}
            `}
        >

            <h3 className="font-medium">

                {thread.title}

            </h3>

        </div>

    );

}

export default ThreadCard;