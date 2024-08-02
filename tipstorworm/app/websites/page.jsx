import Image from "next/image";
export default function websites() {
    // add mongo db code here to fetch all the data.
    // fetch the data and see what data has what color then add that color in this ButtonStyle then map all the data one by one and make a html file then put that html file in the return
    const ButtonStyle= `text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded shadow-blackcustom hover:shadow-yellowcustom`;

    return (
        <div className="h-screen w-screen flex flex-col gap-3">
            <div className="flex justify-start h-36 mx-2 my-2 rounded-lg shadow-yellowcustom min-w-[400px] w-3/5">
                <div className=" w-1/5 flex justify-center items-center overflow-hidden relative rounded-tl-lg rounded-bl-lg">
                    <Image
                        src="/cat.jpg"
                        fill
                        style={{ objectFit: 'cover' }}
                        alt="Cat"
                    />
                </div>
                <div className=" flex flex-col justify-between w-3/5 px-2 py-2">
                    <div>
                        <p className="font-semibold text-lg">Title</p>
                        <p className="text-sm">This is a dummy description of the asset which has been uploaded to this page</p>
                    </div>
                    <div className="flex justify-end">
                        <p className="text-xs">Uploaded by @itsmeprinceyt</p>
                    </div>
                </div>
                <div className=" w-1/5 flex justify-center items-center">
                    <button className={ButtonStyle}>Click</button>
                </div>
            </div>
        </div>
    )
}