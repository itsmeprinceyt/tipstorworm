import Image from "next/image";

export default function Card({ url, alt, title, description, credit }) {

    const ButtonStyle = `text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded shadow-blackcustom hover:shadow-yellowcustom`;
    return (
        <div className="bg-white min-h-[300px] w-[500px] shadow-2xl rounded-xl flex ">
            <div className="bg-yellow-400 inline-block">
            <Image className="p-2 rounded-md"
                    src={url}
                    height={250}
                    width={250}
                    alt={alt}
                />
            </div>
            <div className="bg-pink-700 flex flex-col">
                <div className="bg-red-400"> Hello</div>
                <div className="bg-blue-600">Uploaded by</div>
            </div>
        </div>
    );
}


/*import Image from "next/image";

export default function Card({ url, alt, title, description, credit }) {

    const ButtonStyle = `text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 py-2 px-4 rounded shadow-blackcustom hover:shadow-yellowcustom`;
    return (
        <div className="bg-orange-400 flex justify-start h-48 mx-2 my-2 rounded-lg shadow-yellowcustom max-w-[500px] ">
            <div className="relative w-1/5 flex justify-center items-center overflow-hidden rounded-md">
                <Image className="p-2 rounded-md"
                    src={url}
                    height={250}
                    width={250}
                    alt={alt}
                />
            </div>
            <div className="flex flex-col justify-between w-3/5 py-2">
                <div>
                    <p className="font-semibold text-lg">{title}</p>
                    <p className="text-sm">{description}</p>
                </div>
                <div className="flex justify-end">
                    <p className="text-xs">{credit}</p>
                </div>
            </div>
            <div className=" w-1/5 flex justify-center items-center">
                <button className={ButtonStyle}>Click Here</button>
            </div>
        </div>
    );
}*/