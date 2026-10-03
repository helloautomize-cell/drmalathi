// TODO: ask the client for more consented written reviews. These three are
// the only reviews currently approved for use on the site.

export type Testimonial = {
  name: string;
  quote: string;
  language?: "en" | "ta";
  /** Faithful English rendering shown behind a "Read in English" toggle. */
  translation?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Deva",
    quote:
      "I had a great experience at this hospital. I received a clear and thorough report. While many people complain about long wait times, I found that the staff really take good care of their patients. It takes more time, but it is truly valuable because they ensure proper care. I am very happy because they saved my twins.",
  },
  {
    name: "Rajesh",
    language: "ta",
    quote:
      "மிக,மிக சிறப்பான மருத்துவமனை. கனிவான மருத்துவர்கள். தரமான மருத்துவ சேவை. நடுத்தர குடும்பங்களுக்கு ஏற்ற மருத்துவமனை. மருத்துவர் மிக கனிவுடனும், அக்கரையுடனும் சிகிச்சையளித்தார்.",
    // TODO: client approval needed for this English translation.
    translation:
      "A very, very good hospital. Kind doctors. Quality medical care. A hospital well suited to middle-income families. The doctor treated us with great kindness and care.",
  },
  {
    name: "Manisha Margrete",
    quote:
      "Very good experience with this centre. The doctors are absolutely kind and explained every single detail about the baby. I really appreciate the patience of the doctors, as it took a long time for my baby to come into position. Thank you, Fetal Medicine Centre.",
  },
];
