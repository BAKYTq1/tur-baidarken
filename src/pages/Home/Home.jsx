// pages/Home/Home.jsx
import  "react";
import Features from "../../shared/features/Features";
import PopularDestinations from "../../shared/populardestinations/Populardestinations";
import TravelStories from "../../shared/travelstories/Travelstories";
import PromoBanner from "../../shared/promobanner/PromoBanner";
import Reviews from "../../shared/reviews/Reviews";
export function Home() {
  return (
 <>
    <Features/>
    <PopularDestinations/>
    <TravelStories/>
    <PromoBanner/>
    <Reviews/>
 </>
  );
}