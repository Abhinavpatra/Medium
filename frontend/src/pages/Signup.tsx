import Auth from "../components/Auth";
import Quote from "../components/Quote";


export default function Signup(){
    return<>
     <div className="grid grid-cols-1 lg:grid-cols-2">

<div>
    <Auth type="signup"/>

</div>
<div className="hidden lg:block"><Quote/></div> 
    </div>
    </>
}
// understand the tailwind
/**
 *  size by default is one grid col and the other div is hidden
 *  but as soon as it reaches the lg point, the grid-cols become 2 and the quote becomes visible
 */