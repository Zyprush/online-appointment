"use client";
import React from "react";

const page = () => {
  return (
    <div className="p-10 space-y-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl text-primary font-bold">User Guide</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* guide no. 1 */}

        <div className="bg-white shadow group relative">
          <div className="h-full">
            <div className="bg-[url('/img/omsc.jpg')] bg-cover bg-center h-full group-hover:opacity-100 opacity-0 transition duration-300 ease-linear">
              {/* this is the background when the component is hover */}
            </div>
            <div className="absolute top-0 p-5 m-5 group-hover:bg-white group-hover:bg-opacity-50">
              <h1 className="text-xl text-primary font-bold">How to haha</h1>
              <p className="text-gray-600 text-sm">
                Description about the Guide Lorem ipsum dolor sit, amet
                consectetur adipisicing elit. Quas dolores alias, eveniet eos
                enim similique tempora laudantium expedita cum quidem libero
                dicta fuga, explicabo sapiente fugiat, eaque provident mollitia
                labore.
              </p>
            </div>
            <a href="http://" target="_blank" rel="noopener noreferrer" className="absolute bottom-0 right-0 p-2 m-5 group-hover:bg-white group-hover:bg-opacity-100">see more..</a>
          </div>
        </div>
        {/* guide no. 2 */}
        <div className="bg-white p-10 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold">How to haha</h1>
          <p className="text-gray-600">
            Description about the Guide Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Quas dolores alias, eveniet eos enim similique
            tempora laudantium expedita cum quidem libero dicta fuga, explicabo
            sapiente fugiat, eaque provident mollitia labore.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
