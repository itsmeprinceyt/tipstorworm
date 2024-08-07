import Card from "@/app/(components)/card";


export default function websites() {
    // add mongo db code here to fetch all the data.
    // fetch the data and see what data has what color then add that color in this ButtonStyle then map all the data one by one and make a html file then put that html file in the return

    return (
        <div className=" flex flex-col items-center justify-center min-h-screen p-4 gap-4">
            <div className="grid grid-cols-1 gap-3 boxmd:grid-cols-2">
            <Card 
            url="/cat.jpg"
            alt="Cat"
            title="Title"
            description="This is a dummy description of the asset which has been uploaded to this page.This is a dummy description of the asset which has been uploaded to this page.This is a dummy description of the asset which has been uploaded to this page."
            credit="by @itsmeprinceyt"
            color='red'
            />
            <Card 
            url="/cat.jpg"
            alt="Cat"
            title="Title"
            description="This is a dummy description of the asset which has been uploaded to this page"
            credit="by @itsmeprinceyt"
            color='pink'
            />
            <Card 
            url="/cat.jpg"
            alt="Cat"
            title="Title"
            description="This is a dummy description of the asset which has been uploaded to this page"
            credit="by @itsmeprinceyt"
            color='red'
            />
            </div>
        </div>
    )
}