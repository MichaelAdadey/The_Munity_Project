import Navbar from "@/components/Navbar";
import Image from "next/image";
import profile from "@/public/images/profile.jpg";
import doc1 from "@/public/images/doc1.jpg";
import doc2 from "@/public/images/doc2.jpg";
import React from "react";
import Button from "@/components/Button";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="px-8 pt-6 flex justify-between">
        <div className="space-y-10">
          <div className="w-70.5 h-[277.58px] shadow-sm rounded-xl flex flex-col items-center justify-center">
            <div className="border-4 border-[#D6E7A1] rounded-full p-1 w-20 h-20 flex flex-col items-center justify-center">
              <Image
                src={profile}
                alt="profile"
                className="w-30 h-30 rounded-full"
              />
            </div>
            <div className="text-center p-3">
              <p className="text-[24px] font-semibold">Name</p>
              <p className="text-[#45483C] text-[12px] font-medium">Username</p>
            </div>
            <div className="flex space-x-4">
              <div className="bg-[#EFEDED] w-28 h-[67.59px] text-[14px] text-[#3E5219] font-semibold rounded-xl text-center p-3">
                <p>12</p>
                <p>Day Streak</p>
              </div>
              <div className="bg-[#EFEDED] w-28 h-[67.59px] rounded-xl text-center text-[14px] text-[#3E5219] p-3 font-semibold">
                <p>4</p>
                <p>Groups</p>
              </div>
            </div>
          </div>
          <div className="w-70.5 h-[310.39px] shadow-sm rounded-xl p-5">
            <div className="flex justify-between pb-2">
              <div className="font-semibold">Your Communities</div>
              <div>
                <p className="text-[#3E5219]">plus</p>
              </div>
            </div>
            <div className="py-4 space-y-5">
              <div className="flex items-center space-x-3">
                <div className="font-bold bg-[#D6E7A1] h-10 w-10 flex items-center justify-center rounded-xl">
                  A
                </div>
                <div>
                  <p className="font-semibold">Anxiety Support</p>
                  <p className="text-[#45483C] text-[12px]">12 new posts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="font-bold bg-[#E4E4CC] h-10 w-10 flex items-center justify-center rounded-xl">
                  M
                </div>
                <div>
                  <p className="font-semibold">Meditation Circle</p>
                  <p className="text-[#45483C] text-[12px]">5 new posts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="font-bold bg-[#D6E7A1] h-10 w-10 flex items-center justify-center rounded-xl">
                  N
                </div>
                <div>
                  <p className="font-semibold">Night Owls</p>
                  <p className="text-[#45483C] text-[12px]">12 new posts</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pt-4 text-[#3E5219] text-[12px]">
              <p>View all communities</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="w-147 h-[333.21px] shadow-lg rounded-2xl p-6 border border-[#E5E5E1] space-y-4">
            <div className="flex justify-between">
              <div>
                <Image
                  src={profile}
                  alt="profile"
                  className="rounded-full h-12 w-12"
                />
              </div>
              <div>
                <textarea
                  name="Message"
                  id="Message"
                  placeholder="What's on your mind, Name?"
                  className="w-118.5 h-[100.41px] bg-[#F5F3F3] p-4 rounded-2xl resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex justify-between space-x-4">
                <Button
                  name="Mood"
                  buttonStyles="w-[88.98px] h-[32.8px] bg-[#EFEDED] text-[12px] font-medium"
                />
                <Button
                  name="Photo"
                  buttonStyles="w-[88.98px] h-[32.8px] bg-[#EFEDED] text-[12px] font-medium"
                />
                <Button
                  name="Anonymous"
                  buttonStyles="w-[123.25px] h-[32.8px] bg-[#EFEDED] text-[12px] font-medium"
                />
              </div>
              <div>
                <Button
                  name="Post"
                  buttonStyles="bg-[#3E5219] w-[95.31px] text-white h-[40px] rounded-full font-semibold"
                />
              </div>
            </div>

            <div className="w-134.5 h-[94.8px] bg-[#FBF9F8] rounded-2xl border border-[#C5C8B84D] flex justify-between p-4">
              <div>
                <div className="rounded-full h-10 w-10 bg-[#FEF9C3] flex items-center justify-center">
                  emo
                </div>
                <p className="text-[12px] text-center">Happy</p>
              </div>
              <div>
                <div className="rounded-full h-10 w-10 bg-[#DCFCE7] flex items-center justify-center">
                  emo
                </div>
                <p className="text-[12px] text-center">Calm</p>
              </div>
              <div>
                <div className="rounded-full h-10 w-10 bg-[#FFEDD5] flex items-center justify-center">
                  emo
                </div>
                <p className="text-[12px] text-center">Stressed</p>
              </div>
              <div>
                <div className="rounded-full h-10 w-10 bg-[#DBEAFE] flex items-center justify-center">
                  emo
                </div>
                <p className="text-[12px] text-center">Sad</p>
              </div>
              <div>
                <div className="rounded-full h-10 w-10 bg-[#F3E8FF] flex items-center justify-center">
                  emo
                </div>
                <p className="text-[12px] text-center">Anxious</p>
              </div>
            </div>
          </div>

          <div className="w-147 h-67.75 shadow-lg rounded-2xl"></div>
          <div></div>
        </div>

        <div className="space-y-10">
          <div className="w-70.5 h-[223.99px] bg-[#556B2F] border border-[#E5E5E1] rounded-2xl p-6">
            <div className="flex space-x-2">
              <p className="text-[#D0EBA1]">bulb</p>
              <p className="text-[#D0EBA1] font-semibold uppercase">
                mindful moment
              </p>
            </div>
            <p className="py-3 italic text-[16px] text-[#D0EBA1] ">
              &quot;Box breathing: Inhale for 4, Hold for 4, Exhale for 4, Hold
              for 4. Repeat until you feel grounded.&quot;
            </p>
            <p className="underline underline-offset-2 text-[12px] text-[#D0EBA1] pt-2">
              Try it now
            </p>
          </div>
          <div className="h-[181.59px] w-70.5 rounded-2xl shadow-sm p-6 space-y-3">
            <p className="font-semibold">Suggested Groups</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <div className="bg-[#D9EAA3] h-10 w-10 rounded-full font-bold flex items-center justify-center">
                  S
                </div>
                <div>
                  <p className="text-[12px] font-medium">Sleep Hygie</p>
                  <p className="text-[10px] text-[#45483C]">12k Memebers</p>
                </div>
              </div>
              <Button
                name="Join"
                buttonStyles="border border-[#3E5219] text-[#3E5219] text-[12px] w-[48.3px] h-[27px]"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <div className="bg-[#D9EAA3] h-10 w-10 rounded-full font-bold flex items-center justify-center">
                  C
                </div>
                <div>
                  <p className="text-[12px] font-medium">CBT Basics</p>
                  <p className="text-[10px] text-[#45483C]">1k Memebers</p>
                </div>
              </div>
              <Button
                name="Join"
                buttonStyles="border border-[#3E5219] text-[#3E5219] text-[12px] w-[48.3px] h-[27px]"
              />
            </div>
          </div>

          <div className="h-[213.59px] w-70.5 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Available Therapists</p>
              <p className="text-[12px] text-[#3E5219]">See all</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <Image
                  src={doc1}
                  alt="doc"
                  className="h-10 w-10 rounded-full "
                />
                <div>
                  <p className="text-[12px] font-medium">Dr. Elena Thorne</p>
                  <p className="text-[10px] text-[#45483C]">
                    Cognitive Behavioral
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 bg-[#22C55E] rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 items-center">
                <Image
                  src={doc2}
                  alt="doc"
                  className="h-10 w-10 rounded-full "
                />
                <div>
                  <p className="text-[12px] font-medium">Mark Wilson, LCSW</p>
                  <p className="text-[10px] text-[#45483C]">Peer Specialist</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-[#FB923C] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
