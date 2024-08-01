export default function websites(){
    // add mongo db code here to fetch all the data.
    return(
        <div className="bg-slate-800 h-screen w-screen flex flex-col gap-3">
            <div className="bg-red-400 w-screen flex justify-between h-24 mx-2 my-2">
                <div className="bg-yellow-500 w-1/5">
                    Photo
                </div>
                <div className="flex flex-col w-3/5">
                    <p>Title</p>
                    <p>Description</p>
                    <div className="flex justify-end">
                        <p>Uploaded by @itsmeprinceyt</p>
                    </div>
                </div>
                <div className="bg-purple-700 w-1/5">
                    <button className="bg-white rounded-md px-2 py-2">Click Here!</button>
                </div>
            </div>
        </div>
    )
}