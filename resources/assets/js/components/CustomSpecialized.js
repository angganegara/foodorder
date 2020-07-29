import React from "react";
import { Link } from "react-router-dom";

const diets = [
  {
    title: "BIKINI MODEL DIET",
    body: `<ul><li>Designed for professional bikini model competitor</li><li>Perfect combination of proteins and complex carbohydrates</li><li>Boost metabolism</li><li>Reduce body fat</li><li>Promoting lean mass</li><li>5 small meals per day</li></ul>`
  },
  {
    title: "METABOLISM BOOSTER",
    body: `<ul><li>Improves digestive system</li><li>A 4 weeks plan to re-build your metabolism</li><li>Recommended as recovery diet when you have a lot of diet/detox history which slowed down the metabolism</li></ul>`
  },
  {
    title: "GLYX DIET",
    body: "<ul><li>Control blood sugar and insulin levels</li><li>Weight loss</li><li>Increase energy levels and mood</li></ul>"
  },
  {
    title: "CANDIDA DIET",
    body:
      "<ul><li>Help balance the overproduction of candida</li><li>Sugar, gluten and dairy free</li><li>Includes probiotic foods</li></ul>"
  },
  {
    title: "HORMONE DIET",
    body:
      "<ul><li>Rich in food that can raise your progesterone levels</li><li>Help stabilize the hormonal balance</li><li>Lead to better sleep</li><li>Improve mood</li><li>Increase energy</li><li>Improve libido</li><li>Weight loss</li><li>Reduce cravings</li></ul>"
  },
  {
    title: "THYROID DIET",
    body: "<ul><li>Support against iodine deficiency</li><li>Supports stress resistance</li></ul>"
  },
  {
    title: "AYUVERDA MENU",
    body:
      "<ul><li>Based on the Ayurveda principals</li><li>Based on your &ldquo;Dosha&rdquo; &ndash; Vata, Pitta or Kapha</li><li>Health is defined as the dynamic state of a balanced mind, body and environment</li></ul>"
  }
];

const CustomSpecialized = () => (
  <section className="top details">
    <div className="container">
      <div className="row">
        <div className="col-md-2">
          <Link to="/" title="" className="details--return">
            <i className="fa fa-fw fa-long-arrow-alt-left" /> Home
          </Link>
        </div>
        <div className="col-md-10">
          <h1>custom / specialized</h1>
          <div className="details--description">
            <p>Depending on your personal preferences and needs we design a customized meal plan for you. We are specialized to maximize your results to achieve your goals as well as to support your health issues. </p>
            <p>After finalizing the details with you, we will send you a quote for your personal meal plan.</p>
            <p>To get started, please download the questionnaire, fill it in and send it to <a href="mailto:foodorder@motionfitnessbali.com" title="">foodorder@motionfitnessbali.com</a>.</p>
            <p>Do you have tried many diets and just don’t know what to do anymore?</p>
            <p>A nutritional consultation could be the right choice for you. The 1:1 consultation involves building a detailed picture of your lifestyle, eating habits, sport and medical history and
            any concerns you have about your health and wellbeing. With this information, we can work with you to form an eating plan that suits your needs, your lifestyle and daily commitments.</p>
            <br />
            <p>
              <a href="mailto:foodorder@motionfitnessbali.com" title="" className="custom-btn mr-2">Book an Appointment</a>
              <a href="/pdf/nutrition-questionnaire.pdf" title="" className="custom-btn">
                <i className="fa fa-fw fa-arrow-circle-down" /> Download Questionnaire PDF
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CustomSpecialized;
