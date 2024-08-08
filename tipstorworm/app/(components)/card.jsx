import Image from "next/image";
import CardPreview from "/card";

export default async function Card({ url, alt, title, description, credit, color }) {
    const ButtonStyle = 'w-16 text-yellow-950 bg-yellow-400 hover:bg-black hover:text-yellow-400 p-3 text-xs rounded shadow-2xl';

    return (
        <div>
            <div className="bg-red-400 min-h-[300px] w-[450px] boxxs:w-[550px] shadow-2xl rounded-xl flex ">
                <div className="rounded-xl w-1/3 flex items-center justify-center">
                    <Image className="rounded-xl shadow-2xl"
                        src={url}
                        height={115}
                        width={115}
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
                <div className="w-1/5 flex flex-col justify-center items-center gap-5 rounded-xl">
                    <button className={ButtonStyle}>Visit</button>
                    <button className={ButtonStyle}>Edit</button>
                    <button className={ButtonStyle}>Delete</button>
                </div>
            </div>
            <div>
                <CardPreview

                    url="/cat.jpg"
                    alt="Cat"
                    title="Title"
                    description="This is a dummy description of the asset which has been uploaded to this page"
                    credit="by @itsmeprinceyt"
                    color='pink'

                />
            </div>
        </div>
    );
}

