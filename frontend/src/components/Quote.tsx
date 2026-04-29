export default function Quote() {
  return (
    <>
      <div className="bg-slate-100 h-screen flex justify-center flex-col ">
        <div className="flex justify-center">
          <div className="max-w-lg">
            <div className=" text-2xl font-bold text-slate-700 dark:text-slate-100 ">
              "This guy is def either on drugs or abnormally driven."
            </div>

            <div className=" text-left mt-4 text-xl font-semibold text-slate-700 dark:text-slate-100 ">
              - Unknown
            </div>

            <div className=" text-left text-sm font-light text-slate-500">
              CTO | Some Company
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* 
h-full:  not complete 
h-screen: full vertical height, complete height of the current window

*/
