import React from 'react';
import Banner from './Banner';
import { useLoaderData } from 'react-router';
import PartnersSection from './PartnersSection';
import JoinAsTeacher from './JoinAsTeacher';
import OurMission from './OurMisson';
import FAQSection from './FAQSection';
import StatsOverview from './StatsOverview';
import TopEnrolledClasses from './TopEnrolledClasses';
import FeedbackCarousel from './FeedbackCarousel';
import Gemini from './Gemini';

const Home = () => {
    const data = useLoaderData()
    return (
        <div className='px-4 sm:px-6 lg:px-15'>
            <Banner data={data}></Banner>
            <TopEnrolledClasses></TopEnrolledClasses>
            <Gemini></Gemini>
            <PartnersSection></PartnersSection>
            <JoinAsTeacher></JoinAsTeacher>
            <StatsOverview></StatsOverview>
            <FeedbackCarousel></FeedbackCarousel>
            <OurMission></OurMission>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;