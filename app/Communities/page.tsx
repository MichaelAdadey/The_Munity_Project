import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-289 h-[335.78px] bg-[#D6E7A166] rounded-2xl p-12 space-y-3">
          <p className="text-[58px] text-[#3E5219] font-bold">
            Find your people.
          </p>
          <p className="text-[20px] text-[#45483C] w-3xl">
            Join safe, moderated spaces where empathy is the standard. Connect
            with others walking a similar path.
          </p>
          <div className="flex space-x-4 pt-6">
            <Button name="Create Community" buttonStyles="bg-[#3E5219] w-[246.31px] h-[55.59px] text-white text-[16px] font-semibold" />
            <Button name="How it works" buttonStyles="w-[158.08px] h-[55.59px] bg-white text-[16px] font-semibold" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
