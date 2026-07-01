function ThreadCard({

    thread,

    active,

    onClick

}) {

    return (

        <div

            onClick={onClick}

            className={`
                mx-3
                mb-2
                rounded-lg
                cursor-pointer
                transition
                px-4
                py-3

                ${
                    active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }
            `}

        >

            <p className="font-medium truncate">

                {thread.title}

            </p>

        </div>

    );

}

export default ThreadCard;