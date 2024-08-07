import Image from "next/image";

export default async function Card({ url, alt, title, description, credit,color }) {
    const ButtonStyle = 'text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 p-3 text-xs rounded shadow-blackcustom hover:shadow-yellowcustom';
    
    return (
        <div className="bg-white min-h-[300px] w-[450px] boxxs:w-[550px] shadow-2xl rounded-xl flex">
            <div className="rounded-xl w-1/3 flex items-center">
                <Image className="p-2 rounded-xl"
                    src={url}
                    height={150}
                    width={150}
                    alt={alt}
                />
            </div>
            <div className=" flex flex-col justify-between w-3/5 p-2">
                <div>
                    <div className="font-semibold text-lg">{title}</div>
                    <div className="text-sm">{description}</div>
                </div>
                <div className="flex justify-end text-xs">{credit}</div>
            </div>
            <div className="w-1/5 flex items-center rounded-xl">
                <button className={ButtonStyle}>Click Here</button>
            </div>
        </div>
    );
}

