import { Container } from "@/components/shared/container";

export function DisclaimerBar() {
  return (
    <div className="bg-black/25 py-4 text-xs leading-relaxed text-white/70">
      <Container className="space-y-2">
        <p>
          Trichy Fetal Medicine and Fertility Centre fully complies with the
          PCPNDT Act, 1994. Determination or disclosure of the sex of the fetus
          is a criminal offence in India and is not performed at this centre
          under any circumstances.
        </p>
        <p>
          The information on this website is for education only and is not a
          substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </Container>
    </div>
  );
}
