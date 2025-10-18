import Link from "next/link";

export default function AdminDashboard(){
    const CSS: string ="p-2 m-2 bg-lime-400 px-4 rounded-xl text-lime-800";
    return(
        <div>
            This is admin dashboard

            <Link className={CSS} href="/admin/categories-manager"> 
            Category Manager
            </Link>

                        <Link className={CSS} href="/admin/invite-code-manager"> 
            Invite Code Manager
            </Link>
        </div>
    )
}