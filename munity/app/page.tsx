"use client"
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import wellness from "@/public/images/wellness.png";
import peer from "@/public/images/peer.png";
import works from "@/public/images/works.png";
import Button from "@/components/Button";
import { routes } from "@/lib/routes";

const Home = () => {
  const router = useRouter();

  return (
    <div>
      <div
        id="navbar"
        className="flex justify-between px-6 py-3 items-center shadow-sm"
      >
        <div className="font-bold text-[#3E5219] text-[24px] font">Munity</div>
        <div className="flex items-center gap-3">
          <Button
            name="Join as a therapist"
            onclick={() => router.push(routes.therapistOnboarding.basicInfo)}
            buttonStyles="bg-[#D6E7A1] text-[#5A682F] font-semibold text-[14px] px-5"
          />
          <Button
            name="Login"
            onclick={() => router.push(routes.login)}
            buttonStyles="bg-[#3E5219] text-[#fff] font-semibold text-[14px] w-[99px]"
          />
        </div>
      </div>

      <div id="description" className="flex justify-between py-20 px-10">
        <div>
          <div>
            <div className="bg-[#D6E7A1] text-[14px] font-semibold text-[#5A682F] w-56 rounded-2xl pl-4 py-0.5">
              Mental Wellness Reinvented
            </div>
          </div>
          <div className="font-bold text-[48px] pt-6 w-121.25">
            Find Support. Build Connections. Access Professional Care.
          </div>
          <div className="text-[18px] text-[#45483C] w-lg py-4">
            A safe community where emotional support and professional therapy
            work together to nurture your mental well-being.
          </div>
          <div className="flex pt-[15.21px]">
            <Button
              name="Join our Community"
              buttonStyles="bg-[#3E5219] text-[#fff] text-[14px] w-[201.73px]"
            />
            <Button
              name="Find a Therapist"
              buttonStyles="bg-[#D6E7A1] text-[#5A682F] font-semibold text-[14px] ml-[32px] w-[201.73px]"
            />
          </div>
        </div>

        <div className="">
          <Image
            src={wellness}
            alt="Wellness"
            className="rounded-[40px]"
          ></Image>
        </div>
      </div>

      <div
        id="platform numbers"
        className="bg-[#F5F3F3] flex justify-between py-12 px-10 border-[#C5C8B84D]"
      >
        <div className="text-center">
          <p className="text-[32px] text-[#3E5219] font-bold">50k+</p>
          <p className="text-[14px] text-[#45483C] font-semibold">
            Active Members
          </p>
        </div>
        <div className="text-center">
          <p className="text-[32px] text-[#3E5219] font-bold">200+</p>
          <p className="text-[14px] text-[#45483C] font-semibold">
            Support Communities
          </p>
        </div>
        <div className="text-center">
          <p className="text-[32px] text-[#3E5219] font-bold">1.2k+</p>
          <p className="text-[14px] text-[#45483C] font-semibold">
            Licensed Therapists
          </p>
        </div>
        <div className="text-center">
          <p className="text-[32px] text-[#3E5219] font-bold">24/7</p>
          <p className="text-[14px] text-[#45483C] font-semibold">
            Peer Support
          </p>
        </div>
      </div>

      <div id="features" className=" my-16 mx-8">
        <div className="text-center">
          <p className="text-[#1B1C1C] font-bold text-[32px]">
            Comprehensive Care for Every Mind
          </p>
          <p className="text-[#45483C] text-[16px] ">
            Our ecosystem is built on the belief that stability is nurtured
            through a combination of peer empathy and clinical expertise.
          </p>
        </div>

        <div className="pt-12 flex justify-between">
          <div className="shadow-lg p-6 rounded-[20px] h-111.25 w-147">
            <div className="w-12 h-12 bg-[#556B2F1A] flex items-center justify-center rounded-xl">
              <p className="text-[#3E5219]">com</p>
            </div>
            <div className="py-4">
              <p className="text-[24px] font-semibold text-[#1B1C1C]">
                Peer Support Communities
              </p>
              <p className="text-[16px] text-[#45483C] pt-4">
                Join safe, moderated spaces where people with shared experiences
                offer mutual understanding and encouragement.
              </p>
            </div>
            <div className="pt-4">
              <Image
                src={peer}
                alt="Peer"
                className="h-48 w-130.5 object-cover rounded-b-xl"
              />
            </div>
          </div>

          <div className="bg-[#EAE8E7] w-70.5 h-[402.99px] rounded-xl p-6">
            <div className="w-12 h-12 bg-white text-[#3E5219] flex items-center justify-center rounded-xl">
              <p className="text-[#3E5219]">eye</p>
            </div>
            <div>
              <p className="text-[24px] py-4">Anonymous Posting</p>
              <p className="text-[14px] pb-22 w-48">
                Share your story or seek advice without the pressure of
                identity. Your privacy is our priority.
              </p>
            </div>
            <div>
              <p className=" italic text-[#3E5219B2] text-[16px] w-32">
                &quot;Finding safety in anonymity...&quot;
              </p>
            </div>
          </div>

          <div className="bg-[#D6E7A1] w-70.5 h-[365.99px] rounded-xl p-6">
            <div className="w-12 h-12 bg-white text-[#3E5219] flex items-center justify-center rounded-xl">
               <p className="text-[#56642B]">head</p>
            </div>
            <div>
              <p className="text-[24px] py-4">Professional Therapy</p>
              <p className="text-[14px] pb-6 w-48">
                Book 1-on-1 video or chat sessions with licensed clinicians
                specializing in anxiety, trauma, and more.
              </p>
            </div>
            <div>
              <Button
                name="Explore Clinicians"
                buttonStyles="bg-[#3E5219] text-white px-8 text-[14px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div id="messaging" className="mx-8 mb-14 flex justify-between">
        <div className="w-70.5 h-[253.19px] rounded-xl flex flex-col items-center shadow-[#556B2F0D] shadow-xl text-center">
          <div className="bg-[#6465521A] h-12 w-12 flex justify-center items-center rounded-xl mt-8 mb-2">
            <p className="text-[#4C4D3B]">lock</p>
          </div>
          <p className="font-bold text-[14px] py-2">Secure Messaging</p>
          <p className="text-[#45483C] text-[13px] w-55">
            End-to-end encrypted communication for all your support chats.
          </p>
        </div>

        <div className="w-223.5 bg-[#F5F3F3] rounded-xl flex justify-between p-8">
          <div>
            <div className="bg-[#3E52191A] h-12 w-12 flex items-center justify-center rounded-xl">
              <p className="text-[#3E5219]">book</p>
            </div>
            <p className="text-[24px] font-semibold py-4">
              Emotional Wellness Resources
            </p>
            <p className="w-99.5 text-[#45483C]">
              Access a curated library of mindfulness exercises, guided
              journals, and crisis management tools developed by mental health
              professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 space-x-4 space-y-4">
            <div className="bg-white w-47.75 h-18.5 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <p className="text-[#3E5219]">icon</p>
              <p className="text-[18px] font-bold">Meditation</p>
            </div>
            <div className="bg-white w-47.75 h-18.5 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <p className="text-[#3E5219]">icon</p>
              <p className="text-[18px] font-bold">Journaling</p>
            </div>
            <div className="bg-white w-47.75 h-18.5 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <p className="text-[#3E5219]">icon</p>
              <p className="text-[18px] font-bold">Sleep Aids</p>
            </div>
            <div className="bg-white w-47.75 h-18.5 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <p className="text-[#3E5219]">icon</p>
              <p className="text-[18px] font-bold">Mood Tracking</p>
            </div>
          </div>
        </div>
      </div>

      <div id="howItWorks" className="flex justify-between px-12 py-6">
        <div className="space-y-4 pt-32">
          <div>
            <p className="text-[32px] font-bold">
              The Journey to Nurtured Stability
            </p>
          </div>

          <div className="flex space-x-6">
            <div className="rounded-full p-4 bg-[#3E5219] h-12 w-12 text-white font-bold text-[19px] flex items-center justify-center pr-4">
              1
            </div>
            <div>
              <p className="text-[24px] font-semibold">Join a Community</p>
              <p className="w-124 text-[#45483C]">
                Create your anonymous profile and discover interest-based groups
                that resonate with your current journey.
              </p>
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="rounded-full p-4 bg-[#B6D088] h-12 w-12 text-[#3E5219] font-bold text-[19px] flex items-center justify-center pr-4">
              2
            </div>
            <div>
              <p className="text-[24px] font-semibold">Connect & Share</p>
              <p className="w-124 text-[#45483C]">
                Engage in discussions, attend live support sessions, or connect
                privately with specialized therapists.
              </p>
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="rounded-full p-4 bg-[#D9EAA3] h-12 w-12 text-[#5A682F] font-bold text-[19px] flex items-center justify-center pr-4">
              3
            </div>
            <div>
              <p className="text-[24px] font-semibold">Heal at Your Pace</p>
              <p className="w-124 text-[#45483C]">
                Track your progress, utilize our resource library, and feel the
                steady growth of your emotional resilience.
              </p>
            </div>
          </div>
        </div>

        <div className="w-142 h-142 rounded-xl shadow-lg flex items-center justify-center">
          <Image src={works} alt="works" className="rounded-xl h-126 w-126" />
        </div>
      </div>

      <div className="flex items-center justify-center p-24">
        <div className="bg-[#3E5219] text-center h-[405.6px] w-250 rounded-[40px] p-24">
          <p className="text-white text-[48px] font-bold">
            Ready to find your community?
          </p>
          <p className="text-white text-[18px] py-5">
            Join thousands of others on a path to sustained mental wellness and
            connection.
          </p>
          <div className="flex justify-center space-x-6 pt-5">
            <Button
              name="Create Free Account"
              buttonStyles="bg-white w-[240.27px] font-bold h-[66px]  text-[#3E5219]"
            />
            <Button
              name="Learn More"
              buttonStyles="border border-white font-bold text-white  h-[66px] w-[168.55px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#C5C8B84D] py-20 px-16">
        <div className="flex justify-between">
          <div className="space-y-4">
            <p className="text-[24px] text-[#3E5219] font-bold">Munity</p>
            <p className="text-[#45483C] text-[12px] w-[320px]">
              Nurturing stability through peer-driven support and professional
              clinical care. Your journey to wellness is our mission.
            </p>
            <div className="flex space-x-4">
              <div className="rounded-full bg-white w-10 h-10 p-2 flex items-center justify-center">
                <p className="text-[#3E5219]">wor</p>
              </div>
              <div className="rounded-full bg-white w-10 h-10 p-2 flex items-center justify-center">
                <p className="text-[#3E5219]">at</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-bold text-[14px]">Platform</p>
            <p className="font-medium text-[#45483C] text-[12px]">Home</p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Communities
            </p>
            <p className="font-medium text-[#45483C] text-[12px]">Resources</p>
            <p className="font-medium text-[#45483C] text-[12px]">Therapy</p>
          </div>

          <div className="space-y-4">
            <p className="font-bold text-[14px]">Support</p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Emergency Support
            </p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Help Center
            </p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Community Guidelines
            </p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Safety Tools
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-bold text-[14px]">Legal</p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Privacy Policy
            </p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Terms of Service
            </p>
            <p className="font-medium text-[#45483C] text-[12px]">
              Cookie Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
