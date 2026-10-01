export type Testimonial = {
  name: string;
  quote: string;
  language?: "en" | "ta";
};

export const testimonials: Testimonial[] = [
  {
    name: "Deva",
    quote:
      "I had a great experience at this hospital. I received a clear and thorough report. While many people complain about long wait times, I found that the staff really take good care of their patients. It takes more time, but it is truly valuable because they ensure proper care. I am very happy because they saved my twins.",
  },
  {
    name: "Rajesh",
    // Original review is in Tamil; shown translated with the original preserved.
    // TODO: confirm the Tamil rendering and translation with the client.
    language: "ta",
    quote:
      "மிக,மிக சிறப்பான மருத்துவமனை. கனிவான மருத்துவர்கள். தரமான மருத்துவ சேவை. நடுத்தர குடும்பங்களுக்கு ஏற்ற மருத்துவமனை. மருத்துவர் மிக கனிவுடனும், அக்கரையுடனும் சிகிச்சையளித்தார்.",
  },
  {
    name: "Manisha Margrete",
    quote:
      "Very good experience with this centre. The doctors are absolutely kind and explained every single detail about the baby. I really appreciate the patience of the doctors, as it took a long time for my baby to come into position. Thank you, Fetal Medicine Centre.",
  },
];
